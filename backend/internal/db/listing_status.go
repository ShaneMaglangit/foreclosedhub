package db

func ParseListingStatuses(items []string) ([]ListingStatus, error) {
	listingStatuses := make([]ListingStatus, 0, len(items))

	for _, item := range items {
		listingStatus, err := ParseListingStatus(item)
		if err != nil {
			return nil, err
		}
		listingStatuses = append(listingStatuses, listingStatus)
	}

	return listingStatuses, nil
}

func ParseListingStatus(item string) (ListingStatus, error) {
	var listingStatus ListingStatus
	err := listingStatus.Scan(item)
	return listingStatus, err
}
