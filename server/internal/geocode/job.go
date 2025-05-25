package geocode

import (
	"context"
	"errors"
	"github.com/jackc/pgx/v5"
	"server/internal/db"
)

const skipCountAfterNoop = 24 * 60

var skipCounter = 0

type Job struct{}

func (job *Job) Run() error {
	if skipCounter > 0 {
		skipCounter--
		return nil
	}

	ctx := context.Background()

	pool, err := db.Connect(ctx)
	if err != nil {
		return err
	}
	defer pool.Close()

	listingsRepo := db.NewListingsRepository()

	listing, err := listingsRepo.GetListingNotGeocoded(ctx, pool)
	if errors.Is(err, pgx.ErrNoRows) {
		skipCounter = skipCountAfterNoop
		return err
	} else if err != nil {
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
