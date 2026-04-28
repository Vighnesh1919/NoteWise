package response

import (
	"encoding/json"
	"time"
)

type NoteResponse struct {
	ID         string          `json:"id"`
	Title      string          `json:"title"`
	Content    json.RawMessage `json:"content"`
	IsDeleted  bool            `json:"is_deleted"`
	IsFavorite bool            `json:"is_favorite"`
	CreatedAt  time.Time       `json:"created_at"`
	UpdatedAt  time.Time       `json:"updated_at"`
}
