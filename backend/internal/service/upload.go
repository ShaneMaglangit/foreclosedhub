package service

type UploadService interface {
	Execute() (string, error)
	ExecuteBatch() ([]string, error)
}
