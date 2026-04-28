package service

import (
	"github.com/Vighnesh1919/NoteWise/internal/models"
	"github.com/Vighnesh1919/NoteWise/internal/repository"
)

type NoteService struct{
	repo *repository.NoteRepo
}

func NewNoteService( r *repository.NoteRepo) *NoteService{

	return &NoteService{repo: r}
}

func ( s *NoteService) Create( userID,title string,content []byte) ( *models.Note,error){

	if title == "" {

		title="Untitled"
	}
	note := &models.Note{UserID:userID,Title:title,Content:content}

	err := s.repo.Create(note)

	return note,err 
}

func ( s *NoteService) GetAll(userID string ) ([]models.Note,error){
	return s.repo.GetAllByUser(userID)
}


func ( s *NoteService) GetOne(id,userID string ) (*models.Note,error){
	return s.repo.GetByID(id,userID)  
}

func ( s *NoteService) Update(id,userID,title string ,content []byte) ( *models.Note,error){

	note := &models.Note{ID:id,UserID: userID ,Title: title,Content: content}
	err := s.repo.Update(note)

	return note,err 
}




func (s *NoteService) ToggleFavorite(noteID, userID string) (bool, error) {
	return s.repo.ToggleFavorite(noteID, userID)
}

func (s *NoteService) Delete(noteID, userID string) error {
	return s.repo.SoftDelete(noteID, userID)
}

func (s *NoteService) Restore(noteID, userID string) error {
	return s.repo.Restore(noteID, userID)
}