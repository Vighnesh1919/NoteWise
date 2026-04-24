package routes

import (
	"github.com/Vighnesh1919/NoteWise/internal/handler"
	"github.com/Vighnesh1919/NoteWise/internal/middleware"
	"github.com/gin-gonic/gin"
)

func Setup(r *gin.Engine, auth *handler.AuthHandler, note *handler.NoteHandler, secret string) {

	api := r.Group("/api/v1")

	// Auth routes
	authRoutes := api.Group("/auth")
	{
		authRoutes.POST("/register", auth.Register)
		authRoutes.POST("/login", auth.Login)
		// authRoutes.POST("/auth/refresh", auth.Refresh)
	}

	// Protected routes
	protected := api.Group("/")
	protected.Use(middleware.AuthRequired(secret))
	{
		protected.POST("/notes", note.Create)
		protected.GET("/notes", note.GetAll)
		protected.GET("/notes/:id", note.GetOne)
		protected.PUT("/notes/:id", note.Update)
		protected.DELETE("/notes/:id", note.Delete)
	}
}
