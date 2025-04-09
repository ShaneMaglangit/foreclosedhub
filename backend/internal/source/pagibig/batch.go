package pagibig

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Batch struct {
	Number            string `json:"batch_no"`
	Branch            string `json:"hbc_name"`
	BidStartDate      string `json:"start_datetime"`
	BidEndDate        string `json:"end_datetime"`
	OfferOpeningDate  string `json:"opening_datetime"`
	OfferOpeningPlace string `json:"opening_place"`
	DeadlineDate      any    `json:"deadline_date"`
	Status            string `json:"status"`
	DisposalFlag      string `json:"disposal_flag"`
	Areas             string `json:"areas"`
}

func (b Batch) getListings() (Listings, error) {
	url := fmt.Sprintf(pagibigListingsEndpoint, b.Number)

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var listings Listings
	if err := json.NewDecoder(resp.Body).Decode(&listings); err != nil {
		return nil, err
	}

	return listings, nil
}

type Batches []Batch

func (b Batches) getListings() (Listings, error) {
	listings := make(Listings, 0)

	for _, batch := range b {
		batchListings, err := batch.getListings()
		if err != nil {
			return nil, err
		}

		listings = append(listings, batchListings...)
	}

	return listings, nil
}

func getBatches() (Batches, error) {
	resp, err := http.Get(pagibigBatchEndpoint)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var batches []Batch
	if err := json.NewDecoder(resp.Body).Decode(&batches); err != nil {
		return nil, err
	}

	return batches, nil
}
