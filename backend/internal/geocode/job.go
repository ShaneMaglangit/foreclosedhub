package geocode

import (
	"context"
	"homagochi/internal/db"
)

type GeocodeListingJob struct{}

func (job *GeocodeListingJob) Run() error {
	ctx := context.Background()

	pool, err := db.Connect(ctx)
	if err != nil {
		return err
	}
	defer pool.Close()

	listingsRepo := db.NewListingsRepository()

	listing, err := listingsRepo.GetListingNotGeocoded(ctx, pool)
	if err != nil {
		return err
	}

	lat, long, err := geocodeAddress(ctx, listing.Address)
	if err != nil {
		return err
	}

	if err := listingsRepo.UpdateListingCoordinate(ctx, pool, listing.ID, lat, long); err != nil {
		return err
	}

	return nil
}
