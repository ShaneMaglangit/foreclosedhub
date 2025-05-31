import * as grpc from '@grpc/grpc-js';
import {listing} from "@web/lib/proto/listing";
import ListingServiceClient = listing.ListingServiceClient;
import GetListingResponse = listing.GetListingResponse;
import GetListingRequest = listing.GetListingRequest;
import GetListingMarkersRequest = listing.GetListingMarkersRequest;
import ProtoGetListingMarkersResponse = listing.GetListingMarkersResponse;

const address = process.env.GRPC_ADDRESS || 'localhost:50051';
const client = new ListingServiceClient(address, grpc.credentials.createInsecure());

export type GetListingMarkersResponse = ReturnType<ProtoGetListingMarkersResponse['toObject']>
export type ListingMarker = NonNullable<GetListingMarkersResponse['listingMarkers']>[number]

export function getListing(id: number): Promise<ReturnType<GetListingResponse['toObject']> | undefined> {
    const req = new GetListingRequest({id});

    return new Promise((resolve, reject) => {
        client.GetListing(req, (err, res) => {
            if (err) return reject(err);
            resolve(res?.toObject());
        });
    });
}

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
            resolve(res?.toObject())
        })
    })
}