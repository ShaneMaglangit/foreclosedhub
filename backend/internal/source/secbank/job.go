package secbank

import (
	"context"
	"homagochi/internal/db"
)

const skipCountAfterNoop = 24 * 60

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

	listingsRepository := db.NewListingsRepository()
	return listingsRepository.InsertListings(ctx, pool, dbListings)
}
