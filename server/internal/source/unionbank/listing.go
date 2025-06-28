package unionbank

import (
	"encoding/json"
	"fmt"
	"math/big"
	"net/http"
	"server/internal/db"

	"github.com/jackc/pgx/v5/pgtype"
)

type PageResponse struct {
	PageSize          int      `json:"page_size"`
	PropertiesPerPage int      `json:"properties_per_page"`
	TotalProperties   int      `json:"total_properties"`
	Listings          Listings `json:"properties"`
}

type Listing struct {
	ID                string  `json:"id"`
	BidID             string  `json:"bid_id"`
	Thumbnail         string  `json:"thumbnail"`
	ThumbnailAlt      string  `json:"thumbnail_alt"`
	TypeOfProperty    string  `json:"type_of_property"`
	TypeOfResidential string  `json:"type_of_residential"`
	Province          string  `json:"province"`
	City              string  `json:"city"`
	MinBidPrice       int     `json:"min_bid_price"`
	LotArea           float64 `json:"lot_area"`
	FloorArea         float64 `json:"floor_area"`
	WithImprovement   string  `json:"with_improvement"`
}

type Listings []Listing

func (listings Listings) toDbListings() ([]*db.Listing, error) {
	var dbListings []*db.Listing

	for _, listing := range listings {
		payload, err := json.Marshal(listing)
		if err != nil {
			return nil, err
		}

		dbListings = append(dbListings, &db.Listing{
			Source:          db.SourceUnionbank,
			ExternalID:      listing.ID,
			Address:         listing.ThumbnailAlt,
			FloorArea:       floatToNumeric(listing.FloorArea),
			LotArea:         floatToNumeric(listing.LotArea),
			Price:           int64(listing.MinBidPrice),
			OccupancyStatus: db.OccupancyStatusUnspecified,
			Payload:         payload,
		})
	}

	return dbListings, nil
}

func getListings() (Listings, error) {
	page := 1

	var listings Listings
	for {
		url := fmt.Sprintf(listingsEndpoint, page)

		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			return nil, err
		}
		req.Header.Set("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36")
		req.Header.Set("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7")
		req.Header.Set("accept-language", "en-US,en;q=0.9,ja;q=0.8,pt;q=0.7,es;q=0.6")

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			return nil, err
		}
		defer resp.Body.Close()

		var pageResponse PageResponse
		if err := json.NewDecoder(resp.Body).Decode(&pageResponse); err != nil {
			return nil, fmt.Errorf("failed to decode JSON: %w", err)
		}

		if len(pageResponse.Listings) == 0 {
			break
		}

		listings = append(listings, pageResponse.Listings...)
		page++
	}

	var dedupedListings Listings
	listingKeys := map[string]bool{}

	for _, listing := range listings {
		if listingKeys[listing.ID] {
			continue
		}

		listingKeys[listing.ID] = true
		dedupedListings = append(dedupedListings, listing)
	}

	return dedupedListings, nil
}

func floatToNumeric(raw float64) pgtype.Numeric {
	intPart := big.NewInt(int64(raw * 100))
	return pgtype.Numeric{
		Int:   intPart,
		Exp:   -2,
		Valid: true,
	}
}
