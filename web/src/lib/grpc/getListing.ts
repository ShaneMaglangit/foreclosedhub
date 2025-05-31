import {client} from "@web/lib/grpc/client";
import {listing} from "@web/lib/proto/listing";
import {Listing, listingSchema} from "@web/lib/grpc/shared";
import GetListingRequest = listing.GetListingRequest;

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

