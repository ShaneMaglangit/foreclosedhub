import * as grpc from '@grpc/grpc-js';
import {listing} from "@web/lib/proto/listing";
import ListingServiceClient = listing.ListingServiceClient;
import { env } from '@web/env';

export const client = new ListingServiceClient(env.GRPC_ADDRESS, grpc.credentials.createInsecure());
