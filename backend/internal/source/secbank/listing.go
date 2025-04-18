package secbank

import (
	"encoding/json"
	"github.com/jackc/pgx/v5/pgtype"
	"homagochi/internal/db"
	"homagochi/internal/utils"
	"io"
	"math/big"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"github.com/PuerkitoBio/goquery"
)

type Listing struct {
	Id             string
	Description    string
	SuggestedPrice int64
	FloorArea      float64
	ImageUrl       string
}

type Listings []Listing

func (listings Listings) toDbListings() ([]*db.Listing, error) {
	var dbListings []*db.Listing

	for _, listing := range listings {
		floorArea := pgtype.Numeric{Int: big.NewInt(int64(listing.FloorArea * 100)), Exp: -2, Valid: true}

		payload, err := json.Marshal(listing)
		if err != nil {
			return nil, err
		}

		dbListings = append(dbListings, &db.Listing{
			Source:          db.SourceSecbank,
			ExternalID:      listing.Id,
			Address:         listing.Description,
			FloorArea:       floorArea,
			Price:           listing.SuggestedPrice,
			OccupancyStatus: db.OccupancyStatusUnspecified,
			Payload:         payload,
		})
	}

	return dbListings, nil
}

func getListings() (Listings, error) {
	userAgent := "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

	req, err := http.NewRequest("GET", listingEndpoint, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("user-agent", userAgent)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	listings, err := extractListings(resp.Body)
	if err != nil {
		return nil, err
	}

	return listings, nil
}

// Listing description contains key information but is unstructed, so we need to do some
// string parsing to extract the data that we want.
// Example: 123 Street, Pasay, Manila (Residential Condominium Unit) (With documentation concerns)
func parseDescription(description string) (string, string) {
	parts := strings.SplitN(description, "(", 2)

	address := parts[0]
	leftover := parts[1]

	return address, leftover
}

func extractSQM(input string) (float64, error) {
	// Regex: match numbers like 1,070.00 or 120.5
	re := regexp.MustCompile(`([\d,]+\.\d+|\d+)`)
	matches := re.FindAllString(input, -1)

	if len(matches) == 0 {
		return 0, nil
	}

	// Use the first match, clean commas
	clean := strings.ReplaceAll(matches[0], ",", "")
	return strconv.ParseFloat(clean, 64)
}

func parseNumeric(raw string) (pgtype.Numeric, error) {
	if raw == "N/A" {
		return pgtype.Numeric{}, nil
	}

	floorArea, err := strconv.ParseFloat(raw, 64)
	if err != nil {
		return pgtype.Numeric{}, err
	}

	return pgtype.Numeric{Int: big.NewInt(int64(floorArea * 100)), Exp: -2, Valid: true}, nil
}

func extractListings(reader io.Reader) (Listings, error) {
	saleSep := "Sale Price:"

	doc, err := goquery.NewDocumentFromReader(reader)
	if err != nil {
		return nil, err
	}

	var parseErr error
	var listings Listings
	doc.Find("tbody tr").Each(func(_ int, s *goquery.Selection) {
		description := s.Find("td:nth-child(2)").Text()
		address, _ := parseDescription(description)

		floorArea, err := extractSQM(s.Find("td:nth-child(4)").Text())
		if err != nil {
			parseErr = err
			return
		}

		priceStr := s.Find("td:nth-child(5)").Text()
		if strings.Contains(priceStr, saleSep) {
			priceStr = strings.Split(priceStr, saleSep)[1]
		}

		priceStr = strings.TrimSpace(priceStr)
		priceStr = strings.ReplaceAll(priceStr, ",", "")
		price, err := strconv.ParseInt(priceStr, 10, 64)
		if err != nil {
			parseErr = err
			return
		}

		imageUrl := ""
		s.Find("td:nth-child(6) a").Each(func(_ int, a *goquery.Selection) {
			if strings.Contains(strings.ToLower(a.Text()), "image") {
				href, exists := a.Attr("href")
				if exists {
					imageUrl = href
				}
			}
		})

		listings = append(listings, Listing{
			Id:             utils.HashSHA256(address),
			Description:    address,
			SuggestedPrice: price,
			FloorArea:      floorArea,
			ImageUrl:       imageUrl,
		})
	})

	return listings, parseErr
}
