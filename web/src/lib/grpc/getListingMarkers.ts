import {z} from "zod";
import {listing} from "@web/lib/proto/listing";
import {client} from "@web/lib/grpc/client";
import GetListingMarkersRequest = listing.GetListingMarkersRequest;

export const listingMarkerSchema = z.object({
    id: z.number(),
    lat: z.number(),
    lng: z.number(),
})

const getListingMarkersResponseSchema = z.object({
    listingMarkers: z.array(listingMarkerSchema),
});

export type ListingMarker = z.infer<typeof listingMarkerSchema>;
export type GetListingMarkersResponse = z.infer<typeof getListingMarkersResponseSchema>;

export function getListingMarkers(params: {
    minLat: number,
    maxLat: number,
    minLng: number,
    maxLng: number
}): Promise<GetListingMarkersResponse | undefined> {
    const req = new GetListingMarkersRequest(params)

    return new Promise((resolve, reject) => {
        client.GetListingMarkers(req, (err, res) => {
            if (err) return reject(err)
            if (!res) return undefined
            resolve(getListingMarkersResponseSchema.parse(res.toObject()))
        })
    })
};