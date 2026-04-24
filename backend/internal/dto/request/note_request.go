package request

import "encoding/json"

type CreateNoteRequest struct{
	Title string `json:"title"`
	Content json.RawMessage `json:"content"`
}


type UpdatedNoteRequest struct{
	Title string `json:"title"`
	Content json.RawMessage `json:"content"`
}