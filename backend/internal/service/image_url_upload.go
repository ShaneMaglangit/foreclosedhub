package service

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"time"

	"cloud.google.com/go/storage"
)

type ImageUrlUploadService struct {
	urls []string
}

func NewImageUrlUploadService(urls []string) *ImageUrlUploadService {
	return &ImageUrlUploadService{
		urls: urls,
	}
}

func (s *ImageUrlUploadService) Execute() (string, error) {
	panic("Not implemented")
}

func (s *ImageUrlUploadService) ExecuteBatch() ([]string, error) {
	ctx := context.Background()

	client, err := storage.NewClient(ctx)
	if err != nil {
		return nil, err
	}
	defer client.Close()

	var uploadedURLs []string
	for _, url := range s.urls {
		object := createObject(client)

		if err := uploadImageFromURL(ctx, object, url); err != nil {
			return nil, err
		}

		publicURL := fmt.Sprintf("https://storage.googleapis.com/%s/%s", object.BucketName(), object.ObjectName())
		uploadedURLs = append(uploadedURLs, publicURL)
	}

	return uploadedURLs, nil
}

func uploadImageFromURL(ctx context.Context, object *storage.ObjectHandle, url string) error {
	userAgent := "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

	ctx, cancel := context.WithTimeout(ctx, time.Minute)
	defer cancel()

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return err
	}
	req.Header.Set("user-agent", userAgent)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("non-200 response code for URL %s: %d", url, resp.StatusCode)
	}

	writer := object.NewWriter(ctx)
	if _, err := io.Copy(writer, resp.Body); err != nil {
		return fmt.Errorf("failed to write image to GCS: %w", err)
	}

	if err := writer.Close(); err != nil {
		return fmt.Errorf("failed to close writer: %w", err)
	}

	return object.ACL().Set(ctx, storage.AllUsers, storage.RoleReader)
}
