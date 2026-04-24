package models

import (
    "encoding/json"
    "time"
)

type Note struct {
    ID        string          `json:"id"`
    UserID    string          `json:"user_id"`
    Title     string          `json:"title"`
    Content   json.RawMessage `json:"content"`
    IsDeleted bool            `json:"is_deleted"`
    CreatedAt time.Time       `json:"created_at"`
    UpdatedAt time.Time       `json:"updated_at"`
}