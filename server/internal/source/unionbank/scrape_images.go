package unionbank

import (
	"context"
	"encoding/json"
	"errors"
	"server/internal/db"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
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
	listing, err := listingsRepository.GetListingByImageNotLoaded(ctx, j.pool, db.SourceUnionbank)
	if errors.Is(err, pgx.ErrNoRows) {
		listingImageSkipCounter = skipCountAfterNoop
		return err
	} else if err != nil {
		return err
	}

	var payload struct {
		Thumbnail string `json:"thumbnail"`
	}

	if err := json.Unmarshal(listing.Payload, &payload); err != nil {
		return err
	}

	if payload.Thumbnail == "" {
		return listingsRepository.UpdateListingsImageLoaded(ctx, j.pool, listing.ID, true)
	}

	imageUrls := []string{payload.Thumbnail}

	tx, err := j.pool.Begin(ctx)
	if err != nil {
		return err
	}

	listingImagesRepository := db.NewListingImagesRepository()
	if err = listingImagesRepository.InsertListingImages(ctx, tx, listing.ID, imageUrls); err != nil {
		tx.Rollback(ctx)
		return err
	}

	if err = listingsRepository.UpdateListingsImageLoaded(ctx, tx, listing.ID, true); err != nil {
		tx.Rollback(ctx)
		return err
	}

	return tx.Commit(ctx)
}
