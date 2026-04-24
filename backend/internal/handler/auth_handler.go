package handler

import (
	"net/http"

	"github.com/Vighnesh1919/NoteWise/internal/dto/request"
	"github.com/Vighnesh1919/NoteWise/internal/dto/response"
	"github.com/Vighnesh1919/NoteWise/internal/service"
	"github.com/Vighnesh1919/NoteWise/internal/utils"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	svc *service.AuthService
}

func NewAuthHandler(s *service.AuthService) *AuthHandler {
	return &AuthHandler{svc: s}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req request.RegisterRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Fail(c, http.StatusBadRequest, err.Error())
		return
	}
	user, token, err := h.svc.Register(req.Email, req.Password)

	if err != nil {
		utils.Fail(c, http.StatusConflict, err.Error())
		return
	}
	utils.Success(c, http.StatusCreated, response.AuthResponse{Token: token, User: user})

}

func (h *AuthHandler) Login(c *gin.Context) {

	var req request.LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	user, token, err := h.svc.Login(req.Email, req.Password)

	if err != nil {
		utils.Fail(c, http.StatusUnauthorized, err.Error())
		return
	}

	utils.Success(c, http.StatusOK, response.AuthResponse{Token: token, User: user})
}

// func (h *AuthHandler) Refresh(c *gin.Context) {
//     var req request.RefreshRequest
//     if err := c.ShouldBindJSON(&req); err != nil {
//         utils.Fail(c, http.StatusBadRequest, err.Error())
//         return
//     }
//     user, tokens, err := h.svc.RefreshTokens(req.RefreshToken)

//     if err != nil {
//         utils.Fail(c, err)
//         return
//     }
//     utils.Success(c, http.StatusOK, response.AuthResponse{Tokens: tokens, User: user})
// }
