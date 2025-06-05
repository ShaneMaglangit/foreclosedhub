package storage

import (
	"context"
	"encoding/base64"
	"fmt"
	"io"
	"os"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
	"github.com/google/uuid"
)

type R2 struct {
	client *s3.Client
	bucket string
}

func NewR2(ctx context.Context) (*R2, error) {
	accountId := os.Getenv("CLOUDFLARE_ACCOUNT_ID")
	accessKeyId := os.Getenv("CLOUDFLARE_R2_ACCESS_KEY_ID")
	accessSecretKey := os.Getenv("CLOUDFLARE_R2_ACCESS_SECRET_KEY")
	bucket := os.Getenv("CLOUDFLARE_BUCKET")

	cfg, err := config.LoadDefaultConfig(ctx,
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(accessKeyId, accessSecretKey, "")),
		config.WithRegion("auto"),
	)
	if err != nil {
		return nil, err
	}

	client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(fmt.Sprintf("https://%s.r2.cloudflarestorage.com", accountId))
	})

	return &R2{
		client: client,
		bucket: bucket,
	}, nil
}

func (s *R2) UploadImageBlobString(ctx context.Context, base64Image string) (string, error) {
	imageData, err := base64.StdEncoding.DecodeString(base64Image)
	if err != nil {
		return "", fmt.Errorf("failed to decode base64 image: %w", err)
	}

	objectKey := fmt.Sprintf("%s.jpg", uuid.New().String())

	_, err = s.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(s.bucket),
		Key:         aws.String(objectKey),
		Body:        strings.NewReader(string(imageData)),
		ContentType: aws.String("image/jpeg"),
		ACL:         types.ObjectCannedACLPublicRead,
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload image: %w", err)
	}

	url := fmt.Sprintf("https://storage.foreclosedhub.com/%s", objectKey)
	return url, nil
}

func (s *R2) UploadImageBlob(ctx context.Context, reader io.Reader) (string, error) {
	objectKey := fmt.Sprintf("%s.jpg", uuid.New().String())

	_, err := s.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(s.bucket),
		Key:         aws.String(objectKey),
		Body:        reader,
		ContentType: aws.String("image/jpeg"),
		ACL:         types.ObjectCannedACLPublicRead,
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload image: %w", err)
	}

	url := fmt.Sprintf("https://storage.foreclosedhub.com/%s", objectKey)
	return url, nil
}
