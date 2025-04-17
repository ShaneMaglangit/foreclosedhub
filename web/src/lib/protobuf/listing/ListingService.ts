// Original file: ../proto/listing_service.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GetListingsRequest as _listing_GetListingsRequest, GetListingsRequest__Output as _listing_GetListingsRequest__Output } from '../listing/GetListingsRequest';
import type { GetListingsResponse as _listing_GetListingsResponse, GetListingsResponse__Output as _listing_GetListingsResponse__Output } from '../listing/GetListingsResponse';

export interface ListingServiceClient extends grpc.Client {
  GetListings(argument: _listing_GetListingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_listing_GetListingsResponse__Output>): grpc.ClientUnaryCall;
  GetListings(argument: _listing_GetListingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_listing_GetListingsResponse__Output>): grpc.ClientUnaryCall;
  GetListings(argument: _listing_GetListingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_listing_GetListingsResponse__Output>): grpc.ClientUnaryCall;
  GetListings(argument: _listing_GetListingsRequest, callback: grpc.requestCallback<_listing_GetListingsResponse__Output>): grpc.ClientUnaryCall;
  getListings(argument: _listing_GetListingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_listing_GetListingsResponse__Output>): grpc.ClientUnaryCall;
  getListings(argument: _listing_GetListingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_listing_GetListingsResponse__Output>): grpc.ClientUnaryCall;
  getListings(argument: _listing_GetListingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_listing_GetListingsResponse__Output>): grpc.ClientUnaryCall;
  getListings(argument: _listing_GetListingsRequest, callback: grpc.requestCallback<_listing_GetListingsResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface ListingServiceHandlers extends grpc.UntypedServiceImplementation {
  GetListings: grpc.handleUnaryCall<_listing_GetListingsRequest__Output, _listing_GetListingsResponse>;
  
}

export interface ListingServiceDefinition extends grpc.ServiceDefinition {
  GetListings: MethodDefinition<_listing_GetListingsRequest, _listing_GetListingsResponse, _listing_GetListingsRequest__Output, _listing_GetListingsResponse__Output>
}
