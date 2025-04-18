package db

import (
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/twpayne/go-geos"
)

type ListingWithImages struct {
	ID              int64
	Source          Source
	ExternalID      string
	Address         string
	FloorArea       pgtype.Numeric
	Price           int64
	OccupancyStatus OccupancyStatus
	ImageLoaded     bool
	Images          []*ListingImage
	CreatedAt       pgtype.Timestamptz
	UpdatedAt       pgtype.Timestamptz
	Payload         []byte
	Coordinate      *geos.Geom
}
