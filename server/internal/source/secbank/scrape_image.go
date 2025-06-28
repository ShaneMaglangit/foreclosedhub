package secbank

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"server/internal/db"
	"server/internal/service"
)

const skipCountAfterNoop = 24 * 60

var listingImageSkipCounter = 0

type ScrapeListingImageJob struct {
	pool *pgxpool.Pool
}

func NewScrapeListingImageJob(pool *pgxpool.Pool) *ScrapeListingImageJob {
	return &ScrapeListingImageJob{pool: pool}
}

func (j *ScrapeListingImageJob) Run() error {
	if listingImageSkipCounter > 0 {
		listingImageSkipCounter--
		return nil
	}

	ctx := context.Background()

	listingsRepository := db.NewListingsRepository()
	listing, err := listingsRepository.GetListingByImageNotLoaded(ctx, j.pool, db.SourceSecbank)
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
