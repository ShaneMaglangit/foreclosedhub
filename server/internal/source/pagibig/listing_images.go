package pagibig

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type ListingImages []struct {
	Blob string `json:"file_blob"`
}

func getListingImagesBlobs(id string) ([]string, error) {
	url := fmt.Sprintf(pagibigListingsImageEndpoint, id)

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var listingImages ListingImages
	if err := json.NewDecoder(resp.Body).Decode(&listingImages); err != nil {
		return nil, err
	}

	blobs := make([]string, len(listingImages))
	for i, image := range listingImages {
		blobs[i] = image.Blob
	}

	return blobs, nil
}
