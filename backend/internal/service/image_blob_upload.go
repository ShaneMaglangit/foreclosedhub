package service

import (
	"context"
	"encoding/base64"
	"fmt"
	"time"

	"cloud.google.com/go/storage"
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

	client, err := storage.NewClient(ctx)
	if err != nil {
		return nil, err
	}
	defer client.Close()

	var urls []string
	for _, blob := range s.blobs {
		object := createObject(client)
		if err = uploadImage(ctx, object, blob); err != nil {
			return nil, err
		}

		url := fmt.Sprintf("https://storage.googleapis.com/%s/%s", object.BucketName(), object.ObjectName())
		urls = append(urls, url)
	}

	return urls, nil
}

func uploadImage(ctx context.Context, object *storage.ObjectHandle, blob string) error {
	ctx, cancel := context.WithTimeout(ctx, time.Minute)
	defer cancel()

	writer := object.NewWriter(ctx)

	data, err := base64.StdEncoding.DecodeString(blob)
	if err != nil {
		return err
	}

	if _, err = writer.Write(data); err != nil {
		return err
	}

	if err = writer.Close(); err != nil {
		return err
	}

	return object.ACL().Set(ctx, storage.AllUsers, storage.RoleReader)
}
