package services

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func GetUserID(c *gin.Context) (int, error) {
	userId, exists := c.Get("userID")
	fmt.Printf("Get User got this UserID: %v (type: %T)\n", userId, userId)

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No User ID Found"})
		return 0, fmt.Errorf("no user id found")
	}

	// Handle different possible types from JWT
	var userIdStr string

	switch v := userId.(type) {
	case string:
		userIdStr = v
	case float64: // JWT numbers often come as float64
		userIdStr = fmt.Sprintf("%.0f", v)
	default:
		fmt.Printf("Unexpected type for userID: %T\n", userId)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID is not a valid type"})
		return 0, fmt.Errorf("invalid user id type")
	}

	// Convert string to int
	userIdInt, err := strconv.Atoi(userIdStr)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to convert User ID to int"})
		return 0, err
	}

	return userIdInt, nil
}
