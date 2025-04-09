package pagibig

import (
	"context"
	"homagochi/internal/db"
	"homagochi/internal/service"
)

type ScrapeListingJob struct{}

func (j *ScrapeListingJob) Run() error {
	batches, err := getBatches()
	if err != nil {
		return err
	}

	listings, err := batches.getListings()
	if err != nil {
		return err
	}

	dbListings, err := listings.toDbListings()
	if err != nil {
		return err
	}

	ctx := context.Background()
	pool, err := db.Connect(ctx)
	if err != nil {
		return err
	}
	defer pool.Close()

	listingsRepository := db.NewListingsRepository()

	return listingsRepository.InsertListings(ctx, pool, dbListings)
}

type ScrapeListingImageJob struct{}

func (j *ScrapeListingImageJob) Run() error {
	ctx := context.Background()

	pool, err := db.Connect(ctx)
	if err != nil {
		return err
	}
	defer pool.Close()

	listingsRepository := db.NewListingsRepository()
	listing, err := listingsRepository.GetListingByImageNotLoaded(ctx, pool, db.SourcePagibig)
	if err != nil {
		return err
	}

	blobs, err := getListingImagesBlobs(listing.ExternalID)
	if err != nil {
		return err
	}

	imageBlobUploadService := service.NewImageBlobUploadService(blobs)
	listingImageService := service.NewListingImageService()

	return listingImageService.Create(imageBlobUploadService, listing.ID)
}
