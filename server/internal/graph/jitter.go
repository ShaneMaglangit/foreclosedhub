package graph

import (
	"fmt"
	"math/rand/v2"
	"server/internal/graph/model"
)

const jitterDistance = 0.0001

func jitterCoordinates(listings []*model.Listing) {
	coordMap := make(map[string]int)

	for i, listing := range listings {
		key := fmt.Sprintf("%.8f,%.8f", listing.Longitude, listing.Latitude)

		count := coordMap[key]
		if count > 0 {
			rng := rand.New(rand.NewPCG(uint64(listing.ID), 0))

			newLng := listing.Longitude + (rng.Float64()*2-1)*jitterDistance
			newLat := listing.Latitude + (rng.Float64()*2-1)*jitterDistance

			listings[i].Longitude = newLng
			listings[i].Latitude = newLat

			key = fmt.Sprintf("%.8f,%.8f", newLng, newLat)
		}

		coordMap[key] = count + 1
	}
}
