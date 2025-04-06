import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import {ServiceError} from "@grpc/grpc-js";
import {ProtoGrpcType} from "web/protobuf/listing_service";
import {Listing__Output} from "web/protobuf/listing/Listing";
import {GetListingsResponse__Output} from "web/protobuf/listing/GetListingsResponse";

const PROTO_PATH = path.join(process.cwd(), '../proto/listing_service.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

const client = new proto.listing.ListingService(
    'localhost:8080',
    grpc.credentials.createInsecure()
);

export function getListings(): Promise<Listing__Output[]> {
    return new Promise((resolve, reject) => {
        client.GetListings({}, (err: ServiceError | null, response: GetListingsResponse__Output | undefined) => {
            if (err) return reject(err);
            if (!response) return reject({reason: 'Empty response'})
            resolve(response.listings);
        });
    });
}