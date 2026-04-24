package middleware

import (
	"net/http"
	"strings"

	"github.com/Vighnesh1919/NoteWise/internal/utils"
	"github.com/gin-gonic/gin"
)

func AuthRequired(secret string) gin.HandlerFunc {

	return func(c *gin.Context) {

		header := c.GetHeader("Authorization")

		if !strings.HasPrefix(header, "Bearer ") {

			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing token "})
			return

		}

		claims, err := utils.ParseToken(strings.TrimPrefix(header, "Bearer "), secret)

		if err != nil {

			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token "})
			return

		}

		c.Set("user_id", claims.UserId)
		c.Set("role", claims.Role)

		c.Next()

	}

}
