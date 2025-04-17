package geocode

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"os"
)

func geocodeAddress(rawAddress string) (lat, long float64, err error) {
	mapboxToken := os.Getenv("MAPBOX_API_KEY")
	if mapboxToken == "" {
		return 0, 0, errors.New("MAPBOX_API_KEY not set")
	}

	address := parsePhilippineAddress(rawAddress)
	endpoint := buildGeocodeURL(mapboxToken, address)

	resp, err := http.Get(endpoint)
	if err != nil {
		return 0, 0, fmt.Errorf("HTTP request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return 0, 0, fmt.Errorf("mapbox API returned status: %s", resp.Status)
	}

	var result struct {
		Features []struct {
			Geometry struct {
				Coordinates []float64 `json:"coordinates"`
			} `json:"geometry"`
		} `json:"features"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return 0, 0, fmt.Errorf("failed to decode response: %w", err)
	}

	if len(result.Features) == 0 || len(result.Features[0].Geometry.Coordinates) != 2 {
		return 0, 0, errors.New("no valid coordinates found in response")
	}

	long = result.Features[0].Geometry.Coordinates[0]
	lat = result.Features[0].Geometry.Coordinates[1]
	return lat, long, nil
}

func buildGeocodeURL(token string, address ParsedAddress) string {
	return fmt.Sprintf(
		"https://api.mapbox.com/search/geocode/v6/forward?access_token=%s&address_line1=%s&place=%s&region=%s&postcode=%s&country=%s",
		token,
		url.QueryEscape(address.AddressLine),
		url.QueryEscape(address.Place),
		url.QueryEscape(address.Region),
		url.QueryEscape(address.Postcode),
		url.QueryEscape(address.Country),
	)
}
