package main

import (
	"log"
	"time"

	"github.com/Vighnesh1919/NoteWise/internal/config"
	"github.com/Vighnesh1919/NoteWise/internal/handler"
	"github.com/Vighnesh1919/NoteWise/internal/repository"
	"github.com/Vighnesh1919/NoteWise/internal/routes"
	"github.com/Vighnesh1919/NoteWise/internal/service"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	cfg := config.Load()

	db := config.ConnectDB(cfg)
	defer db.Close()

	userRepo := repository.NewUserRepo(db)
	noteRepo := repository.NewNoteRepo(db)

	authSvc := service.NewAuthService(userRepo, cfg.JWTSecret)
	noteSvc := service.NewNoteService(noteRepo)

	authHandler := handler.NewAuthHandler(authSvc)
	noteHandler := handler.NewNoteHandler(noteSvc)

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.OPTIONS("/*path", func(c *gin.Context) {
		c.AbortWithStatus(204)
	})

	routes.Setup(r, authHandler, noteHandler, cfg.JWTSecret)

	log.Printf("Server is running on port %s", cfg.Port)
	r.Run(":" + cfg.Port)

}
