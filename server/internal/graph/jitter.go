package graph

import (
	"fmt"
	"math/rand/v2"
	"server/internal/db"

	"github.com/twpayne/go-geos"
)

const jitterDistance = 0.00001

func jitterCoordinates(listings []*db.Listing) {
	coordMap := make(map[string]int)

	for i, listing := range listings {
		key := fmt.Sprintf("%.8f,%.8f", listing.Coordinate.X(), listing.Coordinate.Y())

		count := coordMap[key]
		if count > 0 {
			newLng := listing.Coordinate.X() + (rand.Float64()*2-1)*jitterDistance
			newLat := listing.Coordinate.Y() + (rand.Float64()*2-1)*jitterDistance

			listings[i].Coordinate = geos.NewPointFromXY(newLng, newLat)

			key = fmt.Sprintf("%.8f,%.8f", newLng, newLat)
		}

		coordMap[key] = count + 1
	}
}