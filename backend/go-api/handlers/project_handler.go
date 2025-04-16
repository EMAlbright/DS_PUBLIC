package handlers

import (
	"datasmith/services"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ProjectPayload struct {
	Name        string `json:"projectName"`
	Description string `jsoin:"projectDescription"`
}

func AddProject(c *gin.Context) {
	userId, err := services.GetUserID(c)

	if err != nil {
		fmt.Print("Error getting user id")
	}

	var payload ProjectPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format"})
		return
	}

	err = services.AddProject_DB(userId, payload.Name, payload.Description)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store project"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project successfully added to DB"})
}

func GrabProjectJSON(c *gin.Context) {
	userId, err := services.GetUserID(c)

	if err != nil {
		fmt.Print("Error getting user id")
	}

	projectId := c.DefaultQuery("project_id", "")
	if projectId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing projectId"})
		return
	}

	// Convert projectId to int
	projectIdInt, err := strconv.Atoi(projectId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid projectId format"})
		return
	}

	projectJson, err := services.GetAllJSON_DB(userId, projectIdInt)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Error getting json data for project from DB"})
		return
	}

	c.JSON(http.StatusOK, projectJson)
}

func GetAllProjects(c *gin.Context) {

	userId, err := services.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	projects, err := services.GetAllProjects_DB(userId)
	if err != nil {
		fmt.Print(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch projects"})
		return
	}

	c.JSON(http.StatusOK, projects)
}

// get version names to display to user
func GetVersions(c *gin.Context) {
	userId, err := services.GetUserID(c)

	if err != nil {
		fmt.Print("Error getting user id")
	}

	projectId := c.DefaultQuery("project_id", "")
	if projectId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing projectId"})
		return
	}

	// Convert projectId to int
	projectIdInt, err := strconv.Atoi(projectId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid projectId format"})
		return
	}

	versionNames, err := services.GetVersionNames_DB(userId, projectIdInt)

	c.JSON(http.StatusOK, versionNames)
}
