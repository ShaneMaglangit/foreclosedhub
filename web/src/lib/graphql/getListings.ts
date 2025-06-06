import { graphql } from "@web/lib/graphql/generated"

export const GetListingsQuery = graphql(`
    query GetListings($minLatitude: Float!, $maxLatitude: Float!, $minLongitude: Float!, $maxLongitude: Float!) {
        listings(minLatitude: $minLatitude, maxLatitude: $maxLatitude, minLongitude: $minLongitude, maxLongitude: $maxLongitude) {
            nodes {
                id
                address
                price
                lotArea
                floorArea
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