package secbank

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/jackc/pgx/v5"
	"server/internal/db"
	"server/internal/service"
)

// TODO: Extract hardcoded "5", which refers to the number of instances for this job declared in cron/cron.job
const skipCountAfterNoop = 24 * 60 * 5

type ScrapeListingJob struct{}

func (j *ScrapeListingJob) Run() error {
	listings, err := getListings()
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

	tx, err := pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	listingsRepository := db.NewListingsRepository()

	if err = listingsRepository.InsertListings(ctx, tx, dbListings); err != nil {
		return err
	}

	if err = listingsRepository.UnlistOldListings(ctx, tx, db.SourceSecbank); err != nil {
		return err
	}

	return tx.Commit(ctx)
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
	listing, err := listingsRepository.GetListingByImageNotLoaded(ctx, pool, db.SourceSecbank)
	if errors.Is(err, pgx.ErrNoRows) {
		listingImageSkipCounter = skipCountAfterNoop
		return err
	} else if err != nil {
		return err
	}

	var payload map[string]interface{}
	if err := json.Unmarshal(listing.Payload, &payload); err != nil {
		return fmt.Errorf("failed to unmarshal listing payload: %w", err)
	}

	var urls []string
	if imageURL, ok := payload["ImageUrl"].(string); ok && imageURL != "" {
		urls = []string{imageURL}
	}

	imageUrlUploadService := service.NewImageUrlUploadService(urls)
	listingImageService := service.NewListingImageService()

	return listingImageService.Create(imageUrlUploadService, listing.ID)
}
