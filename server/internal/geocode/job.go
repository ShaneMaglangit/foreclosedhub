package geocode

import (
	"context"
	"errors"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"server/internal/db"
)

const skipCountAfterNoop = 24 * 60

var skipCounter = 0

type Job struct {
	Pool *pgxpool.Pool
}

func (j *Job) Run() error {
	if skipCounter > 0 {
		skipCounter--
		return nil
	}

	ctx := context.Background()

	listingsRepo := db.NewListingsRepository()

	listing, err := listingsRepo.GetListingNotGeocoded(ctx, j.Pool)
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

	if err := listingsRepo.UpdateListingCoordinate(ctx, j.Pool, listing.ID, lat, long); err != nil {
		return err
	}

	return nil
}
