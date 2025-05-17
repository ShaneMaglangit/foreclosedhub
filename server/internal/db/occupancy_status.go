package db

func ParseOccupancyStatuses(items []string) ([]OccupancyStatus, error) {
	occupancyStatuses := make([]OccupancyStatus, 0, len(items))

	for _, item := range items {
		occupancyStatus, err := ParseOccupancyStatus(item)
		if err != nil {
			return nil, err
		}
		occupancyStatuses = append(occupancyStatuses, occupancyStatus)
	}

	return occupancyStatuses, nil
}

func ParseOccupancyStatus(item string) (OccupancyStatus, error) {
	var occupancyStatus OccupancyStatus
	err := occupancyStatus.Scan(item)
	return occupancyStatus, err
}
