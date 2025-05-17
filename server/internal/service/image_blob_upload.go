package service

import (
	"context"
	"server/internal/storage"
)

type ImageBlobUploadService struct {
	blobs []string
}

func NewImageBlobUploadService(blobs []string) *ImageBlobUploadService {
	return &ImageBlobUploadService{
		blobs: blobs,
	}
}

func (s *ImageBlobUploadService) Execute() (string, error) {
	panic("Not implemented")
}

func (s *ImageBlobUploadService) ExecuteBatch() ([]string, error) {
	ctx := context.Background()

	r2, err := storage.NewR2Storage(ctx)
	if err != nil {
		return nil, err
	}

	var urls []string
	for _, blob := range s.blobs {
		url, err := r2.UploadImageBlobString(ctx, blob)
		if err != nil {
			return nil, err
		}

		urls = append(urls, url)
	}

	return urls, nil
}
