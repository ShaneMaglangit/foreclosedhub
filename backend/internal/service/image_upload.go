package service

type ImageUploadService interface {
	Execute() (string, error)
	ExecuteBatch() ([]string, error)
}
