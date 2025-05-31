import * as grpc from '@grpc/grpc-js';
import {listing} from "@web/lib/proto/listing";
import ListingServiceClient = listing.ListingServiceClient;

const address = process.env.GRPC_ADDRESS || 'localhost:50051';
export const client = new ListingServiceClient(address, grpc.credentials.createInsecure());
