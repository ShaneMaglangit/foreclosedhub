package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

type ListingsRepository interface {
	GetListing(ctx context.Context, dbtx DBTX, id int64) (*Listing, error)
	GetListingsInBoundary(ctx context.Context, dbtx DBTX, params GetListingsInBoundaryParams) ([]*Listing, error)
	GetListingByImageNotLoaded(ctx context.Context, dbtx DBTX, source Source) (*GetListingByImageNotLoadedRow, error)
	InsertListings(ctx context.Context, dbtx DBTX, listings []*Listing) error
	UpdateListingsImageLoaded(ctx context.Context, dbtx DBTX, id int64, imageLoaded bool) error
	UnlistOldListings(ctx context.Context, dbtx DBTX, source Source) error
	GetListingNotGeocoded(ctx context.Context, dbtx DBTX) (*GetListingNotGeocodedRow, error)
	UpdateListingCoordinate(ctx context.Context, dbtx DBTX, id int64, lat float64, long float64) error
}

type ListingsRepositoryImpl struct{}

func NewListingsRepository() ListingsRepository {
	return &ListingsRepositoryImpl{}
}

func (l ListingsRepositoryImpl) GetListing(ctx context.Context, dbtx DBTX, id int64) (*Listing, error) {
	return New(dbtx).GetListing(ctx, id)
}

func (l ListingsRepositoryImpl) GetListingsInBoundary(ctx context.Context, dbtx DBTX, params GetListingsInBoundaryParams) ([]*Listing, error) {
	if params.CenterLng == 0 && params.CenterLat == 0 {
		params.CenterLng = (params.MinLng + params.MaxLng) / 2.0
		params.CenterLat = (params.MinLat + params.MaxLat) / 2.0
	}
	return New(dbtx).GetListingsInBoundary(ctx, params)
}

func (l ListingsRepositoryImpl) GetListingByImageNotLoaded(ctx context.Context, dbtx DBTX, source Source) (*GetListingByImageNotLoadedRow, error) {
	return New(dbtx).GetListingByImageNotLoaded(ctx, source)
}

func (l ListingsRepositoryImpl) InsertListings(ctx context.Context, dbtx DBTX, listings []*Listing) error {
	sources := make([]Source, 0, len(listings))
	externalIDs := make([]string, 0, len(listings))
	addresses := make([]string, 0, len(listings))
	floorAreas := make([]pgtype.Numeric, 0, len(listings))
	lotAreas := make([]pgtype.Numeric, 0, len(listings))
	prices := make([]int64, 0, len(listings))
	occupancyStatuses := make([]OccupancyStatus, 0, len(listings))
	payloads := make([][]byte, 0, len(listings))

	for _, listing := range listings {
		sources = append(sources, listing.Source)
		externalIDs = append(externalIDs, listing.ExternalID)
		addresses = append(addresses, listing.Address)
		prices = append(prices, listing.Price)
		floorAreas = append(floorAreas, listing.FloorArea)
		lotAreas = append(lotAreas, listing.LotArea)
		occupancyStatuses = append(occupancyStatuses, listing.OccupancyStatus)
		payloads = append(payloads, listing.Payload)
	}

	return New(dbtx).InsertListings(ctx, InsertListingsParams{
		Sources:           sources,
		ExternalIds:       externalIDs,
		Addresses:         addresses,
		FloorAreas:        floorAreas,
		LotAreas:          lotAreas,
		Prices:            prices,
		OccupancyStatuses: occupancyStatuses,
		Payloads:          payloads,
	})
}

func (l ListingsRepositoryImpl) UpdateListingsImageLoaded(ctx context.Context, dbtx DBTX, id int64, imageLoaded bool) error {
	params := UpdateListingsImageLoadedParams{
		ID:          id,
		ImageLoaded: imageLoaded,
	}

	return New(dbtx).UpdateListingsImageLoaded(ctx, params)
}

func (l ListingsRepositoryImpl) UnlistOldListings(ctx context.Context, dbtx DBTX, source Source) error {
	return New(dbtx).UnlistOldListings(ctx, source)
}

func (l ListingsRepositoryImpl) GetListingNotGeocoded(ctx context.Context, dbtx DBTX) (*GetListingNotGeocodedRow, error) {
	return New(dbtx).GetListingNotGeocoded(ctx)
}

func (l ListingsRepositoryImpl) UpdateListingCoordinate(ctx context.Context, dbtx DBTX, id int64, lat float64, long float64) error {
	return New(dbtx).UpdateListingCoordinate(ctx, UpdateListingCoordinateParams{
		ID:  id,
		Lat: lat,
		Lng: long,
	})
}
