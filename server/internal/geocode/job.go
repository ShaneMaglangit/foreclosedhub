package geocode

import (
	"context"
	"errors"
	"fmt"
	"os"
	"server/internal/db"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"googlemaps.github.io/maps"
)

const skipCountAfterNoop = 24 * 60 * instance

var skipCounter = 0

type Job struct {
	pool *pgxpool.Pool
}

func NewJob(pool *pgxpool.Pool) *Job {
	return &Job{pool: pool}
}

func (j *Job) Run() error {
	if skipCounter > 0 {
		skipCounter--
		return nil
	}

	ctx := context.Background()

	listingsRepo := db.NewListingsRepository()

	listing, err := listingsRepo.GetListingNotGeocoded(ctx, j.pool)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			skipCounter = skipCountAfterNoop
		}
		return err
	}

	lat, long, err := geocodeAddress(ctx, listing.Address)
	if err != nil {
		return err
	}

	if err := listingsRepo.UpdateListingCoordinate(ctx, j.pool, listing.ID, lat, long); err != nil {
		return err
	}

	return nil
}

func geocodeAddress(ctx context.Context, address string) (lat, long float64, err error) {
	apiKey := maps.WithAPIKey(os.Getenv("MAPS_API_KEY"))
	client, err := maps.NewClient(apiKey)
	if err != nil {
		return 0, 0, fmt.Errorf("maps.NewClient(apiKey): %w", err)
	}

	request := maps.GeocodingRequest{Address: address}
	result, err := client.Geocode(ctx, &request)
	if err != nil {
		return 0, 0, fmt.Errorf("client.Geocode(ctx, &request): %w", err)
	}

	if len(result) == 0 {
		return 0, 0, nil
	}

	return result[0].Geometry.Location.Lat, result[0].Geometry.Location.Lng, nil
}
