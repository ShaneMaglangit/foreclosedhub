import { graphql } from "@web/lib/graphql/generated"

export const GetListingsQuery = graphql(`
    query GetListings($minLatitude: Float!, $maxLatitude: Float!, $minLongitude: Float!, $maxLongitude: Float!, $address: String, $minPrice: Int64, $maxPrice: Int64, $occupancyStatuses: [OccupancyStatus!]) {
        listings(minLatitude: $minLatitude, maxLatitude: $maxLatitude, minLongitude: $minLongitude, maxLongitude: $maxLongitude, address: $address, minPrice: $minPrice, maxPrice: $maxPrice, occupancyStatuses: $occupancyStatuses) {
            nodes {
                id
                externalId
                address
                price
                lotArea
                floorArea
                occupancyStatus
                source
                payload
                latitude
                longitude
                images {
                    id
                    url
                }
            }
        }
    }
`)