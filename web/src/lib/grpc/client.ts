import * as grpc from '@grpc/grpc-js';
import {hello} from "@web/lib/proto/hello";
import ListingServiceClient = hello.ListingServiceClient;
import GetListingResponse = hello.GetListingResponse;
import GetListingRequest = hello.GetListingRequest;

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