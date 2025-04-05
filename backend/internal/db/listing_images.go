package db

import (
	"context"
)

type ListingImagesRepository interface {
	GetListingImagesByListingIds(ctx context.Context, dbtx DBTX, listingIds []int64) ([]*GetListingImagesByListingIdsRow, error)
	InsertListingImages(ctx context.Context, dbtx DBTX, listingId int64, urls []string) error
}

type ListingImagesRepositoryImpl struct{}

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

func (l ListingImagesRepositoryImpl) GetListingImagesByListingIds(ctx context.Context, dbtx DBTX, listingIds []int64) ([]*GetListingImagesByListingIdsRow, error) {
	return New(dbtx).GetListingImagesByListingIds(ctx, listingIds)
}

func NewListingImagesRepository() ListingImagesRepository {
	return &ListingImagesRepositoryImpl{}
}
