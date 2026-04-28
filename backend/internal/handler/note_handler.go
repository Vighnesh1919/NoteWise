package handler

import (
	"log"
	"net/http"

	"github.com/Vighnesh1919/NoteWise/internal/dto/request"
	"github.com/Vighnesh1919/NoteWise/internal/service"
	"github.com/Vighnesh1919/NoteWise/internal/utils"
	"github.com/gin-gonic/gin"
)

type NoteHandler struct {
	svc *service.NoteService
}

func NewNoteHandler(s *service.NoteService) *NoteHandler {

	return &NoteHandler{svc: s}
}

func (h *NoteHandler) Create(c *gin.Context) {

	var req request.CreateNoteRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	userID := c.GetString("user_id")

	note, err := h.svc.Create(userID, req.Title, req.Content)

	if err != nil {
		utils.Fail(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, http.StatusCreated, note)

}

func (h *NoteHandler) GetOne(c *gin.Context) {

	id := c.Param("id")
	userID := c.GetString("user_id")

	log.Println("DEBUG NOTE ID:", id)
	log.Println("DEBUG USER ID:", userID)

	note, err := h.svc.GetOne(id, userID)

	if err != nil {
		log.Println("FULL ERROR:", err)
		utils.Fail(c, http.StatusNotFound, "note not found")
		return
	}

	utils.Success(c, http.StatusOK, note)
}

func (h *NoteHandler) GetAll(c *gin.Context) {

	userID := c.GetString("user_id")

	notes, err := h.svc.GetAll(userID)

	if err != nil {
		utils.Fail(c, http.StatusInternalServerError, err.Error())
		return
	}
	utils.Success(c, http.StatusOK, notes)

}

func (h *NoteHandler) Update(c *gin.Context) {

	var req request.UpdatedNoteRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Fail(c, http.StatusBadRequest, err.Error())
		return
	}

	note, err := h.svc.Update(c.Param("id"), c.GetString("user_id"), req.Title, req.Content)

	if err != nil {
		utils.Fail(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, http.StatusOK, note)

}

func (h *NoteHandler) Delete(c *gin.Context) {
	id := c.Param("id")
	userID := c.GetString("user_id")

	if err := h.svc.Delete(id, userID); err != nil {
		utils.Fail(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, http.StatusOK, "deleted")
}


func (h *NoteHandler) ToggleFavorite(c *gin.Context) {
	id := c.Param("id")
	userID := c.GetString("user_id")

	isFav, err := h.svc.ToggleFavorite(id, userID)
	if err != nil {
		utils.Fail(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, http.StatusOK, gin.H{"is_favorite": isFav})
}

func (h *NoteHandler) Restore(c *gin.Context) {
	id := c.Param("id")
	userID := c.GetString("user_id")

	if err := h.svc.Restore(id, userID); err != nil {
		utils.Fail(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, http.StatusOK, "restored")
}