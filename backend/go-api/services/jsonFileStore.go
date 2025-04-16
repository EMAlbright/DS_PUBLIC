package services

import (
	"encoding/json"
	"fmt"
	"time"

	_ "github.com/lib/pq"
)

type JsonDBData struct {
	Id           int
	File_name    string
	JsonData     json.RawMessage
	Created_at   string
	Version_name string
}

type Project struct {
	Id          int
	User_id     int
	Name        string
	Description string
	Created_at  string
}

type ApiEndpoint struct {
	Id            int
	User_id       int
	Project_id    int
	JsonFile_id   int
	Endpoint_name string // TBD:: should we store each endpoint seperately?
	Created_at    string
}

func AddJSON_DB(userId int, jsonData string, projectId int, fileName string, versionName string) error {
	fmt.Print("Filename: ", fileName)
	// insert JSON data into DB

	// EDIT :: keep version based on project
	// if version name already in db (in project) overwrite

	_, err := db.Exec(`
		INSERT INTO user_json_files (user_id, file_name, json_data, created_at, project_id, version_name) 
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (project_id, version_name) 
		DO UPDATE SET json_data = EXCLUDED.json_data, created_at = EXCLUDED.created_at;
	`, userId, fileName, jsonData, time.Now(), projectId, versionName)

	fmt.Print(err)
	return err
}

func getJSON_DB(userId int, jsonId int, projectId int) (string, error) {
	var jsonData string
	err := db.QueryRow("SELECT json_data FROM user_json_files WHERE id = $1 and user_id = $2 and project_id = $3)", jsonId, userId, projectId).Scan(&jsonData)

	if err != nil {
		return "Error Getting JSON From DB", err
	}
	return jsonData, nil
}

func AddProject_DB(userId int, projectName string, description string) error {
	_, err := db.Exec(
		"INSERT INTO projects (user_id, name, description, created_at) VALUES ($1, $2, $3, $4)", userId, projectName, description, time.Now())

	fmt.Print(err)
	return err
}

// get all the JSON data from a project
func GetAllJSON_DB(userId int, projectId int) ([]JsonDBData, error) {
	rows, err := db.Query("SELECT id, file_name, json_data, created_at, version_name FROM user_json_files WHERE user_id = $1 AND project_id = $2", userId, projectId)
	if err != nil {
		fmt.Print(err)
		return nil, err
	}
	defer rows.Close()

	var projectJSONData []JsonDBData
	for rows.Next() {
		var data JsonDBData
		var createdAt time.Time
		err := rows.Scan(&data.Id, &data.File_name, &data.JsonData, &createdAt, &data.Version_name)
		if err != nil {
			fmt.Print(err)
			return nil, err
		}
		data.Created_at = createdAt.Format("2006-01-02 15:04:05")

		projectJSONData = append(projectJSONData, data)
	}
	return projectJSONData, nil
}

func GetAllProjects_DB(userId int) ([]Project, error) {
	rows, err := db.Query("SELECT id, user_id, name, description, created_at FROM projects WHERE user_id = $1", userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var projects []Project
	// go through each returned project in db
	for rows.Next() {
		var p Project
		var createdAt time.Time
		err := rows.Scan(&p.Id, &p.User_id, &p.Name, &p.Description, &createdAt)
		if err != nil {
			return nil, err
		}
		p.Created_at = createdAt.Format("2006-01-02 15:04:05")

		projects = append(projects, p)
	}
	return projects, nil
}

// get all data from a project given project id
// json data, api

// get version
func GetVersionNames_DB(userId int, projectId int) ([]string, error) {
	rows, err := db.Query("SELECT version_name FROM user_json_files WHERE user_id = $1 and project_id = $2", userId, projectId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var versions []string
	for rows.Next() {
		var version string
		err := rows.Scan(&version)
		if err != nil {
			return nil, err
		}
		versions = append(versions, version)
	}
	return versions, nil
}

// func AddEndpoints_DB(da)
