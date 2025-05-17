package service

import (
	"bytes"
	"context"
	"io"
	"net/http"
	"net/http/cookiejar"
	"server/internal/storage"
	"time"
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

	r2, err := storage.NewR2Storage(ctx)
	if err != nil {
		return nil, err
	}

	var uploadedURLs []string
	for _, imageURL := range s.urls {
		blobBytes, err := loadImageBlob(ctx, imageURL)
		if err != nil {
			return nil, err
		}

		uploadedURL, err := r2.UploadImageBlob(ctx, bytes.NewReader(blobBytes))
		if err != nil {
			return nil, err
		}

		uploadedURLs = append(uploadedURLs, uploadedURL)
	}

	return uploadedURLs, nil
}

func loadImageBlob(ctx context.Context, url string) ([]byte, error) {
	userAgent := "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

	ctx, cancel := context.WithTimeout(ctx, time.Minute)
	defer cancel()

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("user-agent", userAgent)

	jar, err := cookiejar.New(nil)
	if err != nil {
		return nil, err
	}

	client := &http.Client{
		Jar: jar,
	}

	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, err
	}

	return io.ReadAll(resp.Body)
}
