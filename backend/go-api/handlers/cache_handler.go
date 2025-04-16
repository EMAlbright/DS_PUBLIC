// send to redis cache
package handlers

import (
	"datasmith/services"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// post json data and filename to redis cache
func JSONcachePOST(c *gin.Context) {
	userId, err := services.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var payload JSONPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}
	fmt.Print("Filename Sent To Reids From GO: ", payload.FileName)
	fmt.Print("Json Data Sent To Redis From GO: ", payload.JsonData)

	jsonCacheKey := fmt.Sprintf("cache-json-key:%d", userId)
	//err = services.RedisClient.Set(services.Ctx, jsonCacheKey, payload.JsonData, time.Hour).Err()

	err = services.RedisClient.HSet(
		services.Ctx,
		jsonCacheKey,
		map[string]interface{}{
			"jsonData": payload.JsonData,
			"fileName": payload.FileName,
		},
	).Err()

	if err != nil {
		fmt.Print(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store JSON in Redis"})
		return
	}
	// cached data expires in 1 hour
	services.RedisClient.Expire(services.Ctx, jsonCacheKey, time.Hour)

	c.JSON(http.StatusOK, gin.H{"message": "Temporary JSON saved"})
}

// get filename and json data from cache
func JSONcacheGET(c *gin.Context) {
	userId, err := services.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	jsonCacheKey := fmt.Sprintf("cache-json-key:%d", userId)
	cachedData, err := services.RedisClient.HGetAll(services.Ctx, jsonCacheKey).Result()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve JSON from Redis"})
		return
	}

	if len(cachedData) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No data found in cache"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"jsonData": cachedData["jsonData"],
		"fileName": cachedData["fileName"],
	})
}
