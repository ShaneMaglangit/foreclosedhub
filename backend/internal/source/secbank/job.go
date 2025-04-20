package secbank

import (
	"context"
	"homagochi/internal/db"
)

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

	if err = db.New(tx).InsertListingImagesSecbank(ctx); err != nil {
		return err
	}

	if err = listingsRepository.UnlistOldListings(ctx, tx, db.SourceSecbank); err != nil {
		return err
	}

	return tx.Commit(ctx)
}
