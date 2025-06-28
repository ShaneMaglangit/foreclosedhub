package pagibig

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"server/internal/db"
)

type ScrapeListingJob struct {
	pool *pgxpool.Pool
}

func NewScrapeListingJob(pool *pgxpool.Pool) *ScrapeListingJob {
	return &ScrapeListingJob{pool: pool}
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
	if err = listingsRepository.InsertListings(ctx, j.pool, dbListings); err != nil {
		return err
	}

	return listingsRepository.UnlistOldListings(ctx, j.pool, db.SourcePagibig)
}
