package unionbank

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
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
		req.Header.Set("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7")
		req.Header.Set("accept-language", "en-US,en;q=0.9,ja;q=0.8,pt;q=0.7,es;q=0.6")
		req.Header.Set("cache-control", "max-age=0")
		req.Header.Set("priority", "u=0, i")
		req.Header.Set("sec-ch-ua", `"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"`)
		req.Header.Set("sec-ch-ua-mobile", "?0")
		req.Header.Set("sec-ch-ua-platform", `"macOS"`)
		req.Header.Set("sec-fetch-dest", "document")
		req.Header.Set("sec-fetch-mode", "navigate")
		req.Header.Set("sec-fetch-site", "none")
		req.Header.Set("sec-fetch-user", "?1")
		req.Header.Set("upgrade-insecure-requests", "1")
		req.Header.Set("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36")
		req.Header.Set("cookie", `ubStaticIsNotExpired=valid; ai_user=la+WH|2025-06-17T14:46:16.588Z; _gcl_au=1.1.478314111.1750171577; _fbp=fb.1.1750171577753.512123794663761968; _ga=GA1.2.2028691344.1750171577; _ga_B3GVNS6514=GS2.1.s1750476109$o4$g1$t1750477872$j57$l0$h0; AKA_A2=A; ak_bmsc=62ED1BA6DDF15D6D99299CEABFABF2E5~000000000000000000000000000000~YAAQT5ZUaISZV6qXAQAAgZ0GthzMbur6pWwkNhn89QV7ylwXO6vfNsoXMkK7r8U/V9OZN+LSZtwUmv3ZsB1w2yS+iTTCh79a7IAT+0J1TupJkqJ2gR2r2HVJ0LXPCPKkCATY01FmAI40v6ck6+/NpWGbNOcM7IiEcboU2zKnqJJnyUqMtOSrEB+1dkLldf6w5fYsmGvoQvpNKW42JOjiCEfnp2Ky2w9spKMBipdqD76fKt8FvHTMzhEwsEPKyMgQY4Er/Gy6t8YS4XXcCULO+04fvFgTAYQeuXYVC9BjjIl9NDiDfC21IfX4JIvHFZ86XofzU5jvOODI+xdkn5aPrlO/5lvqGzPFO0Lz7ONLbuYPPZLrM3Bt0daNQ1LP7BNhhnUh+qExKoZnqBSKKTX9rg==; _unionbankph=6721709fc6e75ae0a2f18f38b28d97e724696e167faebf7aefece4154af5511b; bm_sv=8F71E103EC121077385E90AD43B0230F~YAAQT5ZUaKuhV6qXAQAAgAYHthy+jCVoCnjc5ZuqApSzWSn0tJK1BsnTckelXnxolO1QcdnVTt4iSYhUoK3I7bb9STtkfgt+utpDl7TIb3VTCl6bpz1JYMG3HN9/UmqIQznAVFUtQqZpFArVk/fdW0SoI+ymeehG/MNDrx/LW2SsyRnFdvZLZ5EEhbtrJtV8qy9lwBNzoYYmngOi4fobSNgqeSNJ5ZE+mQfILBXZ+R5VSxoKr+xlNq3yW7cBzS18kE1F/w2X~1`)

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
