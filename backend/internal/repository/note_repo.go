package repository

import (
	"database/sql"
	"fmt"

	"github.com/Vighnesh1919/NoteWise/internal/models"
)

type NoteRepo struct {
	db *sql.DB
}

func NewNoteRepo(db *sql.DB) *NoteRepo {

	return &NoteRepo{db}
}

func (r *NoteRepo) Create(note *models.Note) error {
	query := `INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING id, created_at, updated_at`
	return r.db.QueryRow(query, note.UserID, note.Title, note.Content).
		Scan(&note.ID, &note.CreatedAt, &note.UpdatedAt)
}

func (r *NoteRepo) GetAllByUser(userID string) ([]models.Note, error) {

	query := `SELECT id,user_id,title,content,created_at,updated_at
	          FROM notes
			  WHERE user_id=$1 AND is_deleted=false
			  ORDER BY updated_at DESC`

	rows, err := r.db.Query(query, userID)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var notes []models.Note

	for rows.Next() {

		var n models.Note

		if err := rows.Scan(&n.ID, &n.UserID, &n.Title, &n.Content, &n.CreatedAt, &n.UpdatedAt); err != nil {
			return nil, err
		}

		notes = append(notes, n)

	}

	return notes, nil

}

func (r *NoteRepo) GetByID(id, userID string) (*models.Note, error) {

	note := &models.Note{}

	query := `SELECT id,user_id,title,content,created_at,updated_at 
	          FROM notes
			  WHERE id=$1 AND user_id=$2 AND is_deleted=false`

	err := r.db.QueryRow(query, id, userID).Scan(&note.ID,
		&note.UserID,
		&note.Title,
		&note.Content,
		&note.CreatedAt,
		&note.UpdatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, err
		}
		return nil, fmt.Errorf("db error: %w", err)
	}

	return note, nil
}

func (r *NoteRepo) Update(note *models.Note) error {
	query := `UPDATE notes SET title=$1 ,content=$2,updated_at=NOW() WHERE id=$3 AND user_id=$4`
	_, err := r.db.Exec(query, note.Title, note.Content, note.ID, note.UserID)

	return err

}

func (r *NoteRepo) Delete(id, userID string) error {
	query := `UPDATE notes SET is_deleted=true
	             WHERE id=$1 AND user_id=$2`
	_, err := r.db.Exec(query, id, userID)

	return err
}
