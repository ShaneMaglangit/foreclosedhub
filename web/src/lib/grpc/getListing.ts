import {client} from "@web/lib/grpc/client";
import {z} from "zod";
import {listing} from "@web/lib/proto/listing";
import GetListingRequest = listing.GetListingRequest;

const listingSchema = z.object({
    id: z.number(),
    address: z.string(),
    price: z.number(),
    floorArea: z.number(),
    lotArea: z.number()
})

export type Listing = z.infer<typeof listingSchema>

export function getListing(id: number): Promise<Listing | undefined> {
    const req = new GetListingRequest({id});

    return new Promise((resolve, reject) => {
        client.GetListing(req, (err, res) => {
            if (err) return reject(err);
            if (!res) return undefined;
            resolve(listingSchema.parse(res.toObject()))
        });
    });
}

