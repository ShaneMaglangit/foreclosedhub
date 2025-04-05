package pagibig

import (
	"context"
	"homagochi/internal/db"
)

type ScrapeListingJob struct{}

func (job *ScrapeListingJob) Run() error {
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

type ScrapeImageJob struct{}

func (job *ScrapeImageJob) Run() error {

}
