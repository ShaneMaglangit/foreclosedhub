package pagibig

import (
	"context"
	"errors"
	"github.com/jackc/pgx/v5"
	"homagochi/internal/db"
	"homagochi/internal/service"
)

const skipCountAfterNoop = 24 * 60

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
	if err = listingsRepository.InsertListings(ctx, pool, dbListings); err != nil {
		return err
	}

	return listingsRepository.UnlistOldListings(ctx, pool, db.SourcePagibig)
}

type ScrapeListingImageJob struct{}

var listingImageSkipCounter = 0

func (j *ScrapeListingImageJob) Run() error {
	if listingImageSkipCounter > 0 {
		listingImageSkipCounter--
		return nil
	}

	ctx := context.Background()

	pool, err := db.Connect(ctx)
	if err != nil {
		return err
	}
	defer pool.Close()

	listingsRepository := db.NewListingsRepository()
	listing, err := listingsRepository.GetListingByImageNotLoaded(ctx, pool, db.SourcePagibig)
	if errors.Is(err, pgx.ErrNoRows) {
		listingImageSkipCounter = skipCountAfterNoop
		return err
	} else if err != nil {
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
