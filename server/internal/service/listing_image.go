package service

import (
	"context"
	"server/internal/db"
)

type ListingImageService struct {
}

func NewListingImageService() *ListingImageService {
	return &ListingImageService{}
}

func (s *ListingImageService) Create(uploadService ImageUploadService, listingId int64) error {
	ctx := context.Background()

	urls, err := uploadService.ExecuteBatch()
	if err != nil {
		return err
	}

	pool, err := db.NewPool(ctx)
	if err != nil {
		return err
	}
	defer pool.Close()

	tx, err := pool.Begin(ctx)
	if err != nil {
		return err
	}

	listingImagesRepository := db.NewListingImagesRepository()
	if err = listingImagesRepository.InsertListingImages(ctx, tx, listingId, urls); err != nil {
		tx.Rollback(ctx)
		return err
	}

	listingsRepository := db.NewListingsRepository()
	if err = listingsRepository.UpdateListingsImageLoaded(ctx, tx, listingId, true); err != nil {
		tx.Rollback(ctx)
		return err
	}

	return tx.Commit(ctx)
}
