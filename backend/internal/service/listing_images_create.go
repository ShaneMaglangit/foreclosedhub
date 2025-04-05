package service

import (
	"context"
	"homagochi/internal/db"
)

type ListingImagesCreateServices struct {
	uploadService UploadService
}

func NewListingImagesCreateService(uploadService UploadService) *ListingImagesCreateServices {
	return &ListingImagesCreateServices{
		uploadService: uploadService,
	}
}

func (service *ListingImagesCreateServices) ExecuteBatch(listingId int64) error {
	ctx := context.Background()

	urls, err := service.uploadService.ExecuteBatch()
	if err != nil {
		return err
	}

	pool, err := db.Connect(ctx)
	if err != nil {
		return err
	}
	defer pool.Close()

	tx, err := pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	listingImagesRepository := db.NewListingImagesRepository()
	if err = listingImagesRepository.InsertListingImages(ctx, tx, listingId, urls); err != nil {
		return err
	}

	listingsRepository := db.NewListingsRepository()
	if err = listingsRepository.UpdateListingsImageLoaded(ctx, tx, listingId, true); err != nil {
		return err
	}

	return tx.Commit(ctx)
}
