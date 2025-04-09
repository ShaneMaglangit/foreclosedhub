package grpc

import (
	"context"
	"fmt"
	"google.golang.org/protobuf/types/known/timestamppb"
	"homagochi/internal/db"
	"homagochi/internal/protobuf"
	"homagochi/internal/service"
)

type ListingServiceServer struct {
	protobuf.UnimplementedListingServiceServer
	listingService *service.ListingService
}

func NewListingServiceServer() *ListingServiceServer {
	return &ListingServiceServer{
		listingService: service.NewListingService(),
	}
}

func (s *ListingServiceServer) GetListings(ctx context.Context, request *protobuf.GetListingsRequest) (*protobuf.GetListingsResponse, error) {
	var (
		listings []*db.ListingWithImages
		pageInfo *protobuf.PageInfo
		err      error
	)

	hasNextParameter := request.After != nil
	hasPrevParameter := request.Before != nil
	if hasNextParameter && hasPrevParameter {
		return nil, fmt.Errorf("after and before are mutually exclusive parameters")
	}

	sources := make([]db.Source, 0, len(request.Sources))
	for _, source := range request.Sources {
		sources = append(sources, db.Source(source))
	}

	occupancyStatuses := make([]db.OccupancyStatus, 0, len(request.OccupancyStatuses))
	for _, occupancyStatus := range request.OccupancyStatuses {
		occupancyStatuses = append(occupancyStatuses, db.OccupancyStatus(occupancyStatus))
	}

	if hasPrevParameter {
		listings, pageInfo, err = s.listingService.GetPrevWithImages(ctx, db.GetListingsPrevPageParams{
			Search:          request.Search,
			OccupancyStatus: occupancyStatuses,
			Sources:         sources,
			Before:          request.GetBefore(),
			RowLimit:        request.Limit,
		})
	} else {
		listings, pageInfo, err = s.listingService.GetNextWithImages(ctx, db.GetListingsNextPageParams{
			Search:          request.Search,
			OccupancyStatus: occupancyStatuses,
			Sources:         sources,
			After:           request.GetAfter(),
			RowLimit:        request.Limit,
		})
	}

	if err != nil {
		return nil, err
	}

	return buildGetListingsResponse(listings, pageInfo)
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
		ImageLoaded:     listing.ImageLoaded,
		ImageUrls:       imageUrls,
		CreatedAt:       timestamppb.New(listing.CreatedAt.Time),
		UpdatedAt:       timestamppb.New(listing.UpdatedAt.Time),
		Payload:         string(listing.Payload),
	}, nil
}
