package service

import (
	"errors"
	

	"github.com/Vighnesh1919/NoteWise/internal/models"
	"github.com/Vighnesh1919/NoteWise/internal/repository"
	"github.com/Vighnesh1919/NoteWise/internal/utils"
)

type AuthService struct {
	userRepo  *repository.UserRepo
	jwtSecret string
}

func NewAuthService(r *repository.UserRepo, secret string) *AuthService {

	return &AuthService{userRepo: r, jwtSecret: secret}
}

func (s *AuthService) Register(email, password string) (*models.User, string, error) {

	hashed, err := utils.HashPassword(password)

	if err != nil {
		return nil, "", err
	}

	user := &models.User{Email: email, Password: hashed, Role: "free"}

	err = s.userRepo.Create(user)
	if err != nil {

	
		if repository.IsDuplicateEmailError(err) {
			return nil, "", errors.New("email already exists")
		}

	
		return nil, "", err
	}
	token, err := utils.GenerateToken(user.ID, user.Role, s.jwtSecret)

	return user, token, err

}



func (s *AuthService) Login(email, password string) (*models.User, string, error) {

	user, err := s.userRepo.FindByEmail(email)

	if err != nil {
		
		return nil, "", errors.New("invalid credentials")
	}

	

	match := utils.CheckPassword(password, user.Password)
	

	if !match {
		return nil, "", errors.New("invalid credentials")
	}

	token, err := utils.GenerateToken(user.ID, user.Role, s.jwtSecret)
	return user, token, err
}

func (s *AuthService) GetRole(userID string) (string, error) {

	user, err := s.userRepo.FindByID(userID)
	
	if err != nil {
		return "", err
	}
	return user.Role, nil
}