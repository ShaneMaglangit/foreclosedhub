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
	LotArea           float64     `json:"lot_area"`
	FloorArea         float64     `json:"floor_area"`
	AdditionalInfo    string      `json:"additional_info"`
	WithImprovement   interface{} `json:"with_improvement"`
}

func getListingImages(id string) ([]string, error) {
	url := fmt.Sprintf(listingEndpoint, id)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36")
	req.Header.Set("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7")
	req.Header.Set("accept-language", "en-US,en;q=0.9,ja;q=0.8,pt;q=0.7,es;q=0.6")

	client := &http.Client{}
	resp, err := client.Do(req)
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
