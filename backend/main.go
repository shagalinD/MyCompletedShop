package main

import (
	"kotoshop/handlers"
	"kotoshop/postgres"
	"log"
	"os"
	"time"

	_ "kotoshop/docs"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title           Kotoshop
// @version         2.0
// @description     This is the coolest kotoshop
// @host      localhost:8080
// @securityDefinitions.basic  BasicAuth
func main() {
	err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }
	postgres.Open(os.Getenv("POSTGRES_STRING"))
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, 
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.POST("/api/signup", handlers.Signup)
	r.POST("/api/login", handlers.Login)
	r.POST("/api/products/post", handlers.CreateProduct)
	r.GET("/api/products/get_all", handlers.GetAllProducts)
	r.GET("/api/profile", handlers.Profile)
	r.GET("/api/feedback/get_rating", handlers.GetRating)
	r.GET("/api/feedback/get_all", handlers.GetFeedbacks)
	r.POST("/api/feedback/post", handlers.PostFeedback)

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	r.Run()
}