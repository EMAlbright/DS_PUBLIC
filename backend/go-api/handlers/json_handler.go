// grab json data from user, update json, add json, delete
package handlers

import (
	"bytes"
	"datasmith/services"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"reflect"

	"github.com/gin-gonic/gin"
)

type APIResponseData struct {
	EndPoints []string `json:"endpoints"`
}

type JSONPayload struct {
	JsonData    string `json:"jsonData"`
	ProjectId   int    `json:"projectId"`
	FileName    string `json: "fileName"`
	VersionName string `json: "versionName"`
}

func AddJSON(c *gin.Context) {

	var payload JSONPayload

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format"})
		return
	}
	fmt.Print(payload.JsonData)
	fmt.Print(payload.ProjectId)
	userId, err := services.GetUserID(c)
	fmt.Print("User ID Received: ", userId)

	if err != nil {
		fmt.Print("Error getting user id")
	}

	fmt.Println("User ID DT in Handler:", reflect.TypeOf(userId))

	err = services.AddJSON_DB(userId, payload.JsonData, payload.ProjectId, payload.FileName, payload.VersionName)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store JSON"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "JSON successfully added to DB"})
}

func UpdateJSON() {

}

// fix later
func DeleteJSON() {

}

// turn json to API endpoints
func JSONtoAPI(c *gin.Context) {
	var payload JSONPayload
	var apiEndpoints APIResponseData

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON format"})
		return
	}
	fmt.Print(payload)
	fastAPIendpoint := "http://localhost:5000/api/process"

	// receive json response and send raw json
	jsonBytes := []byte(payload.JsonData)
	req, err := http.NewRequest("POST", fastAPIendpoint, bytes.NewBuffer(jsonBytes))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error creating request"})
		return
	}

	req.Header.Set("Content-Type", "application/json")
	client := &http.Client{}
	resp, err := client.Do(req)

	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error sending request to Python"})
		return
	}

	defer resp.Body.Close()

	// get response back of endpoints from data
	body, err := io.ReadAll(resp.Body)

	fmt.Print("Response Received Back From Python Generated Endpoints: ", string(body))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error reading response"})
		return
	}

	if err := json.Unmarshal(body, &apiEndpoints); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error unmarshaling"})
		return
	}

	// send to DB to store endpoints

	c.JSON(http.StatusOK, apiEndpoints)
}
