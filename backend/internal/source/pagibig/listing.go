package pagibig

import (
	"encoding/json"
	"github.com/jackc/pgx/v5/pgtype"
	"homagochi/internal/db"
	"math/big"
	"strconv"
	"strings"
)

type Listing struct {
	ID             string  `json:"ropa_id"`
	Location       string  `json:"prop_location"`
	FloorArea      string  `json:"floor_area"`
	Remarks        string  `json:"remarks"`
	Price          int64   `json:"min_sellprice"`
	PropType       string  `json:"prop_type"`
	TctCctNo       string  `json:"tct_cct_no"`
	LotArea        string  `json:"lot_area"`
	ApprDate       string  `json:"appr_date"`
	ReqGross       float64 `json:"req_gross"`
	Status         string  `json:"status"`
	CityMuni       string  `json:"city_muni"`
	InspectionDate string  `json:"inspection_date"`
	InsRemarks     string  `json:"ins_remarks"`
}

type Listings []Listing

func (listings Listings) toDbListings() ([]*db.Listing, error) {
	var dbListings []*db.Listing

	for _, listing := range listings {
		floorArea, err := parseNumeric(listing.FloorArea)
		if err != nil {
			return nil, err
		}

		payload, err := json.Marshal(listing)
		if err != nil {
			return nil, err
		}

		dbListings = append(dbListings, &db.Listing{
			Source:          db.SourcePagibig,
			ExternalID:      listing.ID,
			Address:         listing.Location,
			FloorArea:       floorArea,
			Price:           listing.Price,
			OccupancyStatus: getOccupancyStatus(listing.Remarks),
			Payload:         payload,
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

func getOccupancyStatus(remarks string) db.OccupancyStatus {
	if strings.Contains(remarks, "UNOCCUPIED") {
		return db.OccupancyStatusUnoccupied
	}
	return db.OccupancyStatusOccupied
}
