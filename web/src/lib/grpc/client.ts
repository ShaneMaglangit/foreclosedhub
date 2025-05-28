import * as grpc from '@grpc/grpc-js';
import {listing} from "@web/lib/proto/listing";
import ListingServiceClient = listing.ListingServiceClient;
import GetListingResponse = listing.GetListingResponse;
import GetListingRequest = listing.GetListingRequest;

const address = process.env.GRPC_ADDRESS || 'localhost:50051';
const client = new ListingServiceClient(address, grpc.credentials.createInsecure());

export function getListing(id: number): Promise<GetListingResponse | undefined> {
    const req = new GetListingRequest({id});

    return new Promise((resolve, reject) => {
        client.GetListing(req, (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
}