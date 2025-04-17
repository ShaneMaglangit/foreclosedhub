package geocode

import (
	"context"
	"errors"
	"github.com/alexliesenfeld/opencage"
	"homagochi/internal/db"
	"os"
)

type GeocodePropertyJob struct{}

func (job *GeocodePropertyJob) Run() error {
	ctx := context.Background()

	pool, err := db.Connect(ctx)
	if err != nil {
		return err
	}
	defer pool.Close()

	listingsRepository := db.NewListingsRepository()
	listing, err := listingsRepository.GetListingNotGeocoded(ctx, pool)
	if err != nil {
		return err
	}

	client := opencage.New(os.Getenv("OPENCAGE_API_KEY"))
	response, err := client.Geocode(ctx, listing.Address, &opencage.GeocodingParams{})
	if err != nil {
		return err
	} else if response.Status.Code != 200 {
		return errors.New(response.Status.Message)
	}

	var lat float64
	var long float64

	if len(response.Results) > 0 {
		result := response.Results[0]
		lat = result.Geometry.Lat
		long = result.Geometry.Lng
	}

	return listingsRepository.UpdateListingCoordinate(ctx, pool, listing.ID, lat, long)
}
