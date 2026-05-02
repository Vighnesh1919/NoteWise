package repository

import (
	"database/sql"
	"strings"

	"github.com/Vighnesh1919/NoteWise/internal/models"
)

type UserRepo struct {
	db *sql.DB
}

func NewUserRepo(db *sql.DB) *UserRepo {
	return &UserRepo{db}
}

func (r *UserRepo) Create(user *models.User) error {

	query := `
		INSERT INTO users (email, password, role)
		VALUES ($1, $2, 'free')
		RETURNING id, created_at, updated_at
	`

	return r.db.QueryRow(
		query,
		user.Email,
		user.Password,
	).Scan(
		&user.ID,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
}

func (r *UserRepo) FindByEmail(email string) (*models.User, error) {
	user := &models.User{}
	query := `SELECT id, email, password, role, created_at, updated_at FROM users WHERE email=$1`
	err := r.db.QueryRow(query, email).
		Scan(&user.ID, &user.Email, &user.Password, &user.Role, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func IsDuplicateEmailError(err error) bool {
	return strings.Contains(err.Error(), "duplicate key") ||
		strings.Contains(err.Error(), "UNIQUE constraint")
}

func (r *UserRepo) FindByID(id string) (*models.User, error) {
	user := &models.User{}

	query := `SELECT id,email,password,role,created_at,updated_at FROM users WHERE id=$1`

	err := r.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.Email,
		&user.Password,
		&user.Role,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return user, nil
}