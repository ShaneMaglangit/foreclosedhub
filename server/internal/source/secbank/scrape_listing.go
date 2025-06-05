package secbank

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"server/internal/db"
)

const scrapeListingJobInstance = 1

type ScrapeListingJob struct {
	pool *pgxpool.Pool
}

func NewScrapeListingJob(pool *pgxpool.Pool) *ScrapeListingJob {
	return &ScrapeListingJob{pool: pool}
}

func (j *ScrapeListingJob) InstanceCount() int {
	return scrapeListingJobInstance
}

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

	tx, err := j.pool.Begin(ctx)
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