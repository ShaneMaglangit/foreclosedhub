import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import {ServiceError} from "@grpc/grpc-js";
import {ProtoGrpcType} from "@web/protobuf/listing_service";
import {GetListingsResponse__Output} from "@web/protobuf/listing/GetListingsResponse";
import {env} from "@web/env";
import {GetListingsRequest} from "@web/protobuf/listing/GetListingsRequest";

const PROTO_PATH = path.join(process.cwd(), '../proto/listing_service.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

const client = new proto.listing.ListingService(env.GRPC_ADDRESS, grpc.credentials.createInsecure());

export function getListings(request: GetListingsRequest): Promise<GetListingsResponse__Output> {
    return new Promise((resolve, reject) => {
        client.GetListings(request, (err: ServiceError | null, response: GetListingsResponse__Output | undefined) => {
            if (err) return reject(err);
            if (!response) return reject({reason: 'Empty response'})
            resolve(response)
        });
    });
}