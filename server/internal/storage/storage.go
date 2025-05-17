package storage

import (
	"context"
)

type Storage interface {
	UploadImageBlobString(ctx context.Context, base64Image string) (string, error)
}
