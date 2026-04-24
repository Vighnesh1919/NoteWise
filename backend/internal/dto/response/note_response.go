package response

import (
	"encoding/json"
	"time"
)

type NoteResponse struct {
	ID      string `json:"id"`
	Title   string `json:"title"`
	Content json.RawMessage `json:"content"`
	CreatedAt time.Time   `json:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at"`
}

