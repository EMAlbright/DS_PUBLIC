package main

import (
	"datasmith/handlers"
	"datasmith/middleware"
	"datasmith/services"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// load env
	if err := godotenv.Load("../.env"); err != nil {
		log.Fatal("Error loading .env")
	}

	// postgres instance
	dbURL := os.Getenv("DATABASE_URL")
	if err := services.InitDB(dbURL); err != nil {
		log.Fatalf("Could not connect to database: %v", err)
	}

	// redis instance
	if err := services.InitRedis(); err != nil {
		log.Fatalf("Could not connec to redis: %v", err)
	}

	r := gin.Default()
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})
	// file upload route for creating json/EPs
	r.POST("/api/upload", middleware.AuthMiddleware(), handlers.FileUpload)

	// add project to postgres DB
	r.POST("/api/add_project", middleware.AuthMiddleware(), handlers.AddProject)

	// get all projects user has from postgres DB
	r.GET("/api/get_all_projects", middleware.AuthMiddleware(), handlers.GetAllProjects)

	// add JSON to postgres DB
	r.POST("/api/add_json", middleware.AuthMiddleware(), handlers.AddJSON)

	// get project JSON from postgres DB
	r.GET("/api/get_project_json", middleware.AuthMiddleware(), handlers.GrabProjectJSON)

	// get files versions of project from postgres DB
	r.GET("/api/get_versions", middleware.AuthMiddleware(), handlers.GetVersions)

	// redis cache POST (send json to cache)
	r.POST("/api/post_redis_json_cache", middleware.AuthMiddleware(), handlers.JSONcachePOST)
	// redis cache GET (get json from cache)
	r.GET("/api/get_redis_json_cache", middleware.AuthMiddleware(), handlers.JSONcacheGET)

	// send json to API creation
	r.POST("/api/json_to_api", middleware.AuthMiddleware(), handlers.JSONtoAPI)

	// refresh token
	r.POST("/api/refresh", handlers.Refresh)

	// authorization routes
	r.POST("/api/signup", handlers.Signup)
	r.POST("/api/login", handlers.Login)
	r.POST("/api/logout", handlers.Logout)

	r.Run(":8080")
}
