package pagibig

import (
	"fmt"
	"github.com/jackc/pgx/v5/pgtype"
	"homagochi/internal/db"
	"math/big"
	"strconv"
	"strings"
)

type Listing struct {
	ID        string `json:"ropa_id"`
	Location  string `json:"prop_location"`
	FloorArea string `json:"floor_area"`
	Remarks   string `json:"remarks"`
	Price     int64  `json:"min_sellprice"`
}

type Listings []Listing

func (listings Listings) toDbListings() ([]*db.Listing, error) {
	var dbListings []*db.Listing

	for _, listing := range listings {
		floorArea, err := parseNumeric(listing.FloorArea)
		if err != nil {
			return nil, err
		}

		dbListings = append(dbListings, &db.Listing{
			ExternalID: fmt.Sprintf("pagibig-%s", listing.ID),
			Address:    listing.Location,
			FloorArea:  floorArea,
			Price:      listing.Price,
			Occupied:   isOccupied(listing.Remarks),
		})
	}

	return dbListings, nil
}

func parseNumeric(raw string) (pgtype.Numeric, error) {
	floorArea, err := strconv.ParseFloat(raw, 64)
	if err != nil {
		return pgtype.Numeric{}, err
	}

	return pgtype.Numeric{Int: big.NewInt(int64(floorArea * 100)), Exp: -2, Valid: true}, nil
}

func isOccupied(remarks string) bool {
	return !strings.Contains(remarks, "UNOCCUPIED")
}
