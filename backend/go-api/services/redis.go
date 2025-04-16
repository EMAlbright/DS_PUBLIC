package services

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
)

// Redis client
var RedisClient *redis.Client
var Ctx = context.Background()

// Initialize Redis connection
func InitRedis() error {

	if err := godotenv.Load("../.env"); err != nil {
		log.Fatal("Error loading .env")
	}

	// redis add
	redisADD := os.Getenv("REDISADD")
	//redis pass
	redisPASS := os.Getenv("REDISPASS")

	RedisClient = redis.NewClient(&redis.Options{
		Addr:     redisADD,
		Password: redisPASS,
		DB:       0,
	})

	// Test connection
	_, err := RedisClient.Ping(Ctx).Result()
	if err != nil {
		panic(fmt.Sprintf("Failed to connect to Redis: %v", err))
	}

	fmt.Println("Connected to Redis")
	return nil
}
