package pagibig

import (
	"context"
	"errors"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"server/internal/db"
	"server/internal/service"
)

// TODO: Extract hardcoded "5", which refers to the number of instances for this job declared in cron/cron.job
const skipCountAfterNoop = 24 * 60 * 5

type ScrapeListingJob struct {
	Pool *pgxpool.Pool
}

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

	listingsRepository := db.NewListingsRepository()
	if err = listingsRepository.InsertListings(ctx, j.Pool, dbListings); err != nil {
		return err
	}

	return listingsRepository.UnlistOldListings(ctx, j.Pool, db.SourcePagibig)
}

type ScrapeListingImageJob struct {
	Pool *pgxpool.Pool
}

var listingImageSkipCounter = 0

func (j *ScrapeListingImageJob) Run() error {
	if listingImageSkipCounter > 0 {
		listingImageSkipCounter--
		return nil
	}

	ctx := context.Background()

	listingsRepository := db.NewListingsRepository()
	listing, err := listingsRepository.GetListingByImageNotLoaded(ctx, j.Pool, db.SourcePagibig)
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
