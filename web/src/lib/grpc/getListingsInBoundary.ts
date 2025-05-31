import {z} from "zod";
import {listing} from "@web/lib/proto/listing";
import {client} from "@web/lib/grpc/client";

import {listingSchema} from "@web/lib/grpc/shared";
import GetListingsInBoundaryRequest = listing.GetListingsInBoundaryRequest;

const getListingsResponseSchema = z.object({
    listings: z.array(listingSchema)
});

export type GetListingsInBoundaryResponse = z.infer<typeof getListingsResponseSchema>;

export function getListingsInBoundary(params: {
    minLat: number,
    maxLat: number,
    minLng: number,
    maxLng: number
}): Promise<GetListingsInBoundaryResponse | undefined> {
    const req = new GetListingsInBoundaryRequest(params)

    return new Promise((resolve, reject) => {
        client.GetListingsInBoundary(req, (err, res) => {
            if (err) return reject(err)
            if (!res) return undefined
            resolve(getListingsResponseSchema.parse(res.toObject()))
        })
    })
};