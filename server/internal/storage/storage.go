package storage

import (
	"context"
)

type Storage interface {
	UploadImage(ctx context.Context, base64Image string) (string, error)
}
