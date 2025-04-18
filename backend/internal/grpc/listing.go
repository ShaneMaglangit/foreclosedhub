package grpc

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5/pgtype"
	"homagochi/internal/db"
	"homagochi/internal/protobuf"
	"homagochi/internal/service"
)

const defaultLimit = 30
const defaultNearbyLimit = 100

type ListingServiceServer struct {
	protobuf.UnimplementedListingServiceServer
	listingService *service.ListingService
}

func NewListingServiceServer() *ListingServiceServer {
	return &ListingServiceServer{
		listingService: service.NewListingService(),
	}
}

func (s *ListingServiceServer) GetNearbyListings(ctx context.Context, request *protobuf.GetNearbyListingsRequest) (*protobuf.GetNearbyListingsResponse, error) {
	setDefaultNearbyRequestParams(request)

	sources, err := db.ParseSources(request.Sources)
	if err != nil {
		return nil, err
	}

	occupancyStatuses, err := db.ParseOccupancyStatuses(request.OccupancyStatuses)
	if err != nil {
		return nil, err
	}

	listingStatuses, err := db.ParseListingStatuses(request.Statuses)
	if err != nil {
		return nil, err
	}

	var maxPrice pgtype.Int8
	if request.MaxPrice != nil {
		maxPrice = pgtype.Int8{
			Int64: *request.MaxPrice,
			Valid: true,
		}
	}

	listings, err := s.listingService.GetNearbyListingsWithImages(ctx, db.GetNearbyListingsParams{
		Lng:               request.Longitude,
		Lat:               request.Latitude,
		Search:            request.Search,
		OccupancyStatuses: occupancyStatuses,
		Statuses:          listingStatuses,
		Sources:           sources,
		MinPrice:          request.MinPrice,
		MaxPrice:          maxPrice,
		RowLimit:          request.Limit,
	})

	if err != nil {
		return nil, err
	}

	return buildGetNearbyListingsResponse(listings)
}

func setDefaultNearbyRequestParams(request *protobuf.GetNearbyListingsRequest) {
	if len(request.Sources) == 0 {
		defaultSources := []string{string(db.SourcePagibig)}
		request.Sources = defaultSources
	}

	if len(request.OccupancyStatuses) == 0 {
		defaultOccupancyStatuses := []string{
			string(db.OccupancyStatusOccupied),
			string(db.OccupancyStatusUnoccupied),
			string(db.OccupancyStatusUnspecified),
		}
		request.OccupancyStatuses = defaultOccupancyStatuses
	}

	if len(request.Statuses) == 0 {
		defaultStatuses := []string{string(db.ListingStatusActive), string(db.ListingStatusUnlisted)}
		request.Statuses = defaultStatuses
	}

	if request.Limit <= 0 {
		request.Limit = defaultNearbyLimit
	}
}

func buildGetNearbyListingsResponse(listings []*db.ListingWithImages) (*protobuf.GetNearbyListingsResponse, error) {
	listingsResponse := make([]*protobuf.Listing, 0, len(listings))

	for _, listing := range listings {
		listing, err := convertListing(listing)
		if err != nil {
			return nil, err
		}

		listingsResponse = append(listingsResponse, listing)
	}

	return &protobuf.GetNearbyListingsResponse{Listings: listingsResponse}, nil
}

func (s *ListingServiceServer) GetListings(ctx context.Context, request *protobuf.GetListingsRequest) (*protobuf.GetListingsResponse, error) {
	setDefaultRequestParams(request)

	hasNextParameter := request.After != nil
	hasPrevParameter := request.Before != nil
	if hasNextParameter && hasPrevParameter {
		return nil, fmt.Errorf("after and before are mutually exclusive parameters")
	}

	sources, err := db.ParseSources(request.Sources)
	if err != nil {
		return nil, err
	}

	occupancyStatuses, err := db.ParseOccupancyStatuses(request.OccupancyStatuses)
	if err != nil {
		return nil, err
	}

	listingStatuses, err := db.ParseListingStatuses(request.Statuses)
	if err != nil {
		return nil, err
	}

	var maxPrice pgtype.Int8
	if request.MaxPrice != nil {
		maxPrice = pgtype.Int8{
			Int64: *request.MaxPrice,
			Valid: true,
		}
	}

	var listings []*db.ListingWithImages
	var pageInfo *protobuf.PageInfo

	if hasPrevParameter {
		listings, pageInfo, err = s.listingService.GetPrevWithImages(ctx, db.GetListingsPrevPageParams{
			Search:            request.Search,
			OccupancyStatuses: occupancyStatuses,
			Statuses:          listingStatuses,
			Sources:           sources,
			MinPrice:          request.MinPrice,
			MaxPrice:          maxPrice,
			Before:            request.GetBefore(),
			RowLimit:          request.Limit,
		})
	} else {
		listings, pageInfo, err = s.listingService.GetNextWithImages(ctx, db.GetListingsNextPageParams{
			Search:            request.Search,
			OccupancyStatuses: occupancyStatuses,
			Statuses:          listingStatuses,
			Sources:           sources,
			MinPrice:          request.MinPrice,
			MaxPrice:          maxPrice,
			After:             request.GetAfter(),
			RowLimit:          request.Limit,
		})
	}

	if err != nil {
		return nil, err
	}

	return buildGetListingsResponse(listings, pageInfo)
}

func setDefaultRequestParams(request *protobuf.GetListingsRequest) {
	if len(request.Sources) == 0 {
		defaultSources := []string{string(db.SourcePagibig)}
		request.Sources = defaultSources
	}

	if len(request.OccupancyStatuses) == 0 {
		defaultOccupancyStatuses := []string{
			string(db.OccupancyStatusOccupied),
			string(db.OccupancyStatusUnoccupied),
			string(db.OccupancyStatusUnspecified),
		}
		request.OccupancyStatuses = defaultOccupancyStatuses
	}

	if len(request.Statuses) == 0 {
		defaultStatuses := []string{string(db.ListingStatusActive), string(db.ListingStatusUnlisted)}
		request.Statuses = defaultStatuses
	}

	if request.Limit <= 0 {
		request.Limit = defaultLimit
	}
}

func buildGetListingsResponse(listings []*db.ListingWithImages, pageInfo *protobuf.PageInfo) (*protobuf.GetListingsResponse, error) {
	listingsResponse := make([]*protobuf.Listing, 0, len(listings))

	for _, listing := range listings {
		listing, err := convertListing(listing)
		if err != nil {
			return nil, err
		}

		listingsResponse = append(listingsResponse, listing)
	}

	return &protobuf.GetListingsResponse{
		Listings: listingsResponse,
		PageInfo: pageInfo,
	}, nil
}

func convertListing(listing *db.ListingWithImages) (*protobuf.Listing, error) {
	floorArea, err := listing.FloorArea.Float64Value()
	if err != nil {
		return nil, err
	}

	imageUrls := make([]string, 0, len(listing.Images))
	for _, image := range listing.Images {
		imageUrls = append(imageUrls, image.Url)
	}

	return &protobuf.Listing{
		Id:              listing.ID,
		Source:          string(listing.Source),
		ExternalId:      listing.ExternalID,
		Address:         listing.Address,
		FloorArea:       floorArea.Float64,
		Price:           listing.Price,
		OccupancyStatus: string(listing.OccupancyStatus),
		ImageUrls:       imageUrls,
		Payload:         string(listing.Payload),
		Longitude:       listing.Coordinate.X(),
		Latitude:        listing.Coordinate.Y(),
	}, nil
}
