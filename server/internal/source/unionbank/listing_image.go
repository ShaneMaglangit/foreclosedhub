package unionbank

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type ListingInfo struct {
	ID           string `json:"id"`
	BidID        string `json:"bid_id"`
	Title        string `json:"title"`
	Description  string `json:"description"`
	Thumbnail    string `json:"thumbnail"`
	ThumbnailAlt string `json:"thumbnail_alt"`
	Gallery      []struct {
		ID         string `json:"id"`
		Picture    string `json:"picture"`
		PictureAlt string `json:"picture_alt"`
	} `json:"gallery"`
	TypeOfProperty    string      `json:"type_of_property"`
	TypeOfResidential string      `json:"type_of_residential"`
	Province          string      `json:"province"`
	City              string      `json:"city"`
	Barangay          string      `json:"barangay"`
	MinBidPrice       int         `json:"min_bid_price"`
	LotArea           float64         `json:"lot_area"`
	FloorArea         float64         `json:"floor_area"`
	AdditionalInfo    string      `json:"additional_info"`
	WithImprovement   interface{} `json:"with_improvement"`
}

func getListingImages(id string) ([]string, error) {
	url := fmt.Sprintf(listingEndpoint, id)

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var listingInfo ListingInfo
	if err := json.NewDecoder(resp.Body).Decode(&listingInfo); err != nil {
		return nil, err
	}

	imageUrls := make([]string, len(listingInfo.Gallery))
	for i, image := range listingInfo.Gallery {
		imageUrls[i] = image.Picture
	}

	return imageUrls, nil
}

