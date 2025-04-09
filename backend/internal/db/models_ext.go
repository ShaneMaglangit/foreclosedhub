package db

import "github.com/jackc/pgx/v5/pgtype"

type ListingWithImages struct {
	ID          int64
	Source      Source
	ExternalID  string
	Address     string
	FloorArea   pgtype.Numeric
	Price       int64
	Occupied    bool
	ImageLoaded bool
	Images      []*ListingImage
}
