// handle file uploads
package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"path/filepath"

	"datasmith/services"

	"github.com/gin-gonic/gin"
)

type JsonResponseData struct {
	Message        json.RawMessage `json:"message"`
	StructuredData json.RawMessage `json:"structured_data"`
	Filename       string          `json:"filename"`
}

func FileUpload(c *gin.Context) {
	file, header, err := c.Request.FormFile("file")

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file upload failure"})
		return
	}
	// wait to close until everything else done
	defer file.Close()

	fileType := header.Header.Get("Content-Type")

	fmt.Println("Uploaded File:", header.Filename)
	fmt.Println("File Type:", fileType)

	pythonPath := services.GetPythonEndpoints(fileType)

	// buffer in mem to store file for transfer
	var buf bytes.Buffer
	writer := multipart.NewWriter(&buf)
	part, err := writer.CreateFormFile("file", header.Filename)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error creating form file"})
		return
	}

	// # of bytes successfully copied & err
	copyBytes, err := io.Copy(part, file)
	fmt.Printf("Num of bytes: %v", copyBytes)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error copying file"})
		return
	}
	writer.Close()

	fmt.Printf("File Path %v", pythonPath)
	// send request file to correct python endpoints for processing to json
	req, err := http.NewRequest("POST", pythonPath, &buf)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error creating request"})
		return
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())

	// new client instance
	client := &http.Client{}
	// send request
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error sending request to Python"})
		return
	}
	defer resp.Body.Close()

	// get response back of json from data
	body, err := io.ReadAll(resp.Body)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error reading response"})
		return
	}

	// unmarshal to json
	var jsonResponse JsonResponseData
	if err := json.Unmarshal(body, &jsonResponse); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error unmarshaling"})
		return
	}
	// TODO:
	// send json to endpoint to store in db?

	// get full file
	name := filepath.Base(header.Filename)
	// remove extension
	ext := filepath.Ext(name)
	fileNameWithoutExt := name[:len(name)-len(ext)]

	// store filename
	jsonResponse.Filename = fileNameWithoutExt

	// data received already raw json, send directly to api creator

	c.JSON(http.StatusOK,
		jsonResponse)
}
