package pagibig

import (
	"context"
	"homagochi/internal/db"
)

type Scraper struct{}

func New() Scraper {
	return Scraper{}
}

func (scraper Scraper) Start() error {
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

	return listingsRepository.InsertListings(ctx, dbListings)
}
