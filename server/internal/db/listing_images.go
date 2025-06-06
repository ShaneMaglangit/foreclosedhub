package db

import (
	"context"
)

type ListingImagesRepository interface {
	GetListingImagesByListingIds(ctx context.Context, dbtx DBTX, listingIds []int64) ([]*ListingImage, error)
	GetListingImagesByListings(ctx context.Context, dbtx DBTX, listings []*Listing) ([]*ListingImage, error)
	InsertListingImages(ctx context.Context, dbtx DBTX, listingId int64, urls []string) error
}

type ListingImagesRepositoryImpl struct{}

func NewListingImagesRepository() ListingImagesRepository {
	return &ListingImagesRepositoryImpl{}
}

func (l ListingImagesRepositoryImpl) GetListingImagesByListingIds(ctx context.Context, dbtx DBTX, listingIds []int64) ([]*ListingImage, error) {
	return New(dbtx).GetListingImagesByListingIds(ctx, listingIds)
}

func (l ListingImagesRepositoryImpl) GetListingImagesByListings(ctx context.Context, dbtx DBTX, listings []*Listing) ([]*ListingImage, error) {
	listingIds := make([]int64, 0, len(listings))
	for _, listing := range listings {
		listingIds = append(listingIds, listing.ID)
	}

	return l.GetListingImagesByListingIds(ctx, dbtx, listingIds)
}

func (l ListingImagesRepositoryImpl) InsertListingImages(ctx context.Context, dbtx DBTX, listingId int64, urls []string) error {
	listingIds := make([]int64, len(urls))
	for i := range len(listingIds) {
		listingIds[i] = listingId
	}

	return New(dbtx).InsertListingImages(ctx, InsertListingImagesParams{
		ListingIds: listingIds,
		Urls:       urls,
	})
}
