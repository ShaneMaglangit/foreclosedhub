package upload

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"
	"time"

	"cloud.google.com/go/storage"
	"github.com/google/uuid"
)

type ImageBlobUploadService struct {
	listingId int64
	blob      string
}

func NewImageBlobUploadService(listingId int64, blob string) *ImageBlobUploadService {
	return &ImageBlobUploadService{
		listingId: listingId,
		blob:      blob,
	}
}

func (service *ImageBlobUploadService) Upload() (string, error) {
	ctx := context.Background()

	client, err := storage.NewClient(ctx)
	if err != nil {
		return "", err
	}
	defer client.Close()

	object := createObject(client)
	if err = uploadImage(ctx, object, service.blob); err != nil {
		return "", err
	}

	return fmt.Sprintf("https://storage.googleapis.com/%s/%s", object.BucketName(), object.ObjectName()), nil
}

func createObject(client *storage.Client) *storage.ObjectHandle {
	bucketName := os.Getenv("GCP_BUCKET_NAME")
	objectName := fmt.Sprintf("%v.jpg", uuid.New())

	return client.Bucket(bucketName).Object(objectName)
}

func uploadImage(ctx context.Context, object *storage.ObjectHandle, blob string) error {
	ctx, cancel := context.WithTimeout(ctx, time.Minute)
	defer cancel()

	writer := object.NewWriter(ctx)
	defer writer.Close()

	data, err := base64.StdEncoding.DecodeString(blob)
	if err != nil {
		return err
	}

	if _, err = writer.Write(data); err != nil {
		return err
	}

	return object.ACL().Set(ctx, storage.AllUsers, storage.RoleReader)
}
