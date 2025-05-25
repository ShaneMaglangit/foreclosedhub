package geocode

import (
	"context"
	"fmt"
	"googlemaps.github.io/maps"
	"os"
)

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
