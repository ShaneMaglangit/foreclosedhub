package pagibig

import (
	"context"
	"errors"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"server/internal/db"
	"server/internal/service"
)

const scrapeListingImageJobInstance = 5
const skipCountAfterNoop = 24 * 60 * scrapeListingImageJobInstance

var listingImageSkipCounter = 0

type ScrapeListingImageJob struct {
	pool *pgxpool.Pool
}

func NewScrapeListingImageJob(pool *pgxpool.Pool) *ScrapeListingImageJob {
	return &ScrapeListingImageJob{pool: pool}
}

func (j *ScrapeListingImageJob) InstanceCount() int {
	return scrapeListingImageJobInstance
}

func (j *ScrapeListingImageJob) Run() error {
	if listingImageSkipCounter > 0 {
		listingImageSkipCounter--
		return nil
	}

	ctx := context.Background()

	listingsRepository := db.NewListingsRepository()
	listing, err := listingsRepository.GetListingByImageNotLoaded(ctx, j.pool, db.SourcePagibig)
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
