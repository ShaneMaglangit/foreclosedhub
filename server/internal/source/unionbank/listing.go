package unionbank

import (
	"encoding/json"
	"fmt"
	"log"
	"math/big"
	"net/http"
	"server/internal/db"
	"time"

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
	retryBudget := 50

	var listings Listings
	for {
		url := fmt.Sprintf(listingsEndpoint, page)
		resp, err := http.Get(url)
		if err != nil {
			return nil, err
		}
		defer resp.Body.Close()

		var pageResponse PageResponse
		if err := json.NewDecoder(resp.Body).Decode(&pageResponse); err != nil {
			log.Printf("Failed:%s | Retry Budget: %d", url, retryBudget)
			if retryBudget > 0 {
				retryBudget--
				continue
			}
			return nil, err
		}

		if len(pageResponse.Listings) == 0 {
			break
		}

		listings = append(listings, pageResponse.Listings...)
		page++

		time.Sleep(30 * time.Second)
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
