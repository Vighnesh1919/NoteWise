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

/* ================= CREATE ================= */

func (r *NoteRepo) Create(note *models.Note) error {
	query := `
	INSERT INTO notes (user_id, title, content)
	VALUES ($1, $2, $3)
	RETURNING id, created_at, updated_at
	`

	return r.db.QueryRow(query, note.UserID, note.Title, note.Content).
		Scan(&note.ID, &note.CreatedAt, &note.UpdatedAt)
}

/* ================= GET ALL ================= */

func (r *NoteRepo) GetAllByUser(userID string) ([]models.Note, error) {

	query := `
	SELECT id, user_id, title, content, parent_id, is_favorite, is_deleted, created_at, updated_at
	FROM notes
	WHERE user_id=$1
	ORDER BY updated_at DESC
	`

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notes []models.Note

	for rows.Next() {
		var n models.Note

		if err := rows.Scan(
			&n.ID,
			&n.UserID,
			&n.Title,
			&n.Content,
			&n.ParentID,
			&n.IsFavorite,
			&n.IsDeleted,
			&n.CreatedAt,
			&n.UpdatedAt,
		); err != nil {
			return nil, err
		}

		notes = append(notes, n)
	}

	return notes, nil
}

/* ================= GET ONE ================= */

func (r *NoteRepo) GetByID(id, userID string) (*models.Note, error) {

	note := &models.Note{}

	query := `
	SELECT id, user_id, title, content, parent_id, is_favorite, is_deleted, created_at, updated_at
	FROM notes
	WHERE id=$1 AND user_id=$2
	`

	err := r.db.QueryRow(query, id, userID).Scan(
		&note.ID,
		&note.UserID,
		&note.Title,
		&note.Content,
		&note.ParentID,
		&note.IsFavorite,
		&note.IsDeleted,
		&note.CreatedAt,
		&note.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, err
		}
		return nil, fmt.Errorf("db error: %w", err)
	}

	return note, nil
}

/* ================= UPDATE ================= */

func (r *NoteRepo) Update(note *models.Note) error {
	query := `
	UPDATE notes 
	SET title=$1, content=$2, updated_at=NOW() 
	WHERE id=$3 AND user_id=$4
	`

	_, err := r.db.Exec(query, note.Title, note.Content, note.ID, note.UserID)
	return err
}

/* ================= DELETE ================= */

func (r *NoteRepo) SoftDelete(noteID, userID string) error {
	query := `
	UPDATE notes 
	SET is_deleted = true 
	WHERE id=$1 AND user_id=$2
	`
	_, err := r.db.Exec(query, noteID, userID)
	return err
}

/* ================= FAVORITE ================= */

func (r *NoteRepo) ToggleFavorite(noteID, userID string) (bool, error) {
	query := `
	UPDATE notes 
	SET is_favorite = NOT is_favorite
	WHERE id=$1 AND user_id=$2
	RETURNING is_favorite
	`

	var isFav bool
	err := r.db.QueryRow(query, noteID, userID).Scan(&isFav)
	return isFav, err
}

/* ================= RESTORE ================= */

func (r *NoteRepo) Restore(noteID, userID string) error {
	query := `
	UPDATE notes 
	SET is_deleted = false 
	WHERE id=$1 AND user_id=$2
	`
	_, err := r.db.Exec(query, noteID, userID)
	return err
}

func ( r *NoteRepo) HardDelete(noteID,userID string) error{

	query:=`DELETE FROM notes
	WHERE id=$1 AND user_id=$2`

	_,err:= r.db.Exec(query,noteID,userID)

	return err
}



func ( r *NoteRepo) DeleteOldTrash() error{
	query := `DELETE FROM notes
	          WHERE is_deleted=true AND deleted_at<NOW()-INTERVAL'30 days'`

			  _,err:= r.db.Exec(query)
			  return err 
}


func ( r *NoteRepo) CountByUser(userID string) ( int ,error){
	var count int

	query := `SELECT COUNT(*) FROM notes WHERE user_id=$1  `
	err:=r.db.QueryRow(query,userID).Scan(&count)

	if err!=nil{
		return 0,err
	}
return count,err
}