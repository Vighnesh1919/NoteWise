package utils

import (
	"github.com/Vighnesh1919/NoteWise/internal/dto/response"
	"github.com/gin-gonic/gin"
)

func Success(c *gin.Context, code int, data interface{}) {
	c.JSON(code, response.APIResponse{Success: true, Data: data})
}

func Fail(c *gin.Context, code int, msg string) {
	c.JSON(code, response.APIResponse{Success: false, Error: msg})
}
