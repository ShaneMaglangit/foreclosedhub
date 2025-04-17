package geocode

import (
	"context"
	"fmt"
	"homagochi/internal/db"
)

type GeocodeListingJob struct{}

func (job *GeocodeListingJob) Run() error {
	ctx := context.Background()

	pool, err := db.Connect(ctx)
	if err != nil {
		return fmt.Errorf("failed to connect to DB: %w", err)
	}
	defer pool.Close()

	listingsRepo := db.NewListingsRepository()

	listing, err := listingsRepo.GetListingNotGeocoded(ctx, pool)
	if err != nil {
		return fmt.Errorf("failed to fetch listing: %w", err)
	}

	lat, long, err := geocodeAddress(listing.Address)
	if err != nil {
		return fmt.Errorf("geocoding failed: %w", err)
	}

	if err := listingsRepo.UpdateListingCoordinate(ctx, pool, listing.ID, lat, long); err != nil {
		return fmt.Errorf("failed to update listing coordinates: %w", err)
	}

	return nil
}
