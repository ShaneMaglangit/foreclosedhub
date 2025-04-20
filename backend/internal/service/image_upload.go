package service

import (
	"cloud.google.com/go/storage"
	"fmt"
	"github.com/google/uuid"
	"os"
)

type ImageUploadService interface {
	Execute() (string, error)
	ExecuteBatch() ([]string, error)
}

func createObject(client *storage.Client) *storage.ObjectHandle {
	bucketName := os.Getenv("GCP_BUCKET_NAME")
	objectName := fmt.Sprintf("%v.jpg", uuid.New())
	return client.Bucket(bucketName).Object(objectName)
}
