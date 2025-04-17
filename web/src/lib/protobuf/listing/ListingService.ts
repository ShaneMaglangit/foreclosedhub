// Original file: ../proto/listing_service.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GetListingsRequest as _listing_GetListingsRequest, GetListingsRequest__Output as _listing_GetListingsRequest__Output } from '../listing/GetListingsRequest';
import type { GetListingsResponse as _listing_GetListingsResponse, GetListingsResponse__Output as _listing_GetListingsResponse__Output } from '../listing/GetListingsResponse';
import type { GetNearbyListingsRequest as _listing_GetNearbyListingsRequest, GetNearbyListingsRequest__Output as _listing_GetNearbyListingsRequest__Output } from '../listing/GetNearbyListingsRequest';
import type { GetNearbyListingsResponse as _listing_GetNearbyListingsResponse, GetNearbyListingsResponse__Output as _listing_GetNearbyListingsResponse__Output } from '../listing/GetNearbyListingsResponse';

export interface ListingServiceClient extends grpc.Client {
  GetListings(argument: _listing_GetListingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_listing_GetListingsResponse__Output>): grpc.ClientUnaryCall;
  GetListings(argument: _listing_GetListingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_listing_GetListingsResponse__Output>): grpc.ClientUnaryCall;
  GetListings(argument: _listing_GetListingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_listing_GetListingsResponse__Output>): grpc.ClientUnaryCall;
  GetListings(argument: _listing_GetListingsRequest, callback: grpc.requestCallback<_listing_GetListingsResponse__Output>): grpc.ClientUnaryCall;
  getListings(argument: _listing_GetListingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_listing_GetListingsResponse__Output>): grpc.ClientUnaryCall;
  getListings(argument: _listing_GetListingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_listing_GetListingsResponse__Output>): grpc.ClientUnaryCall;
  getListings(argument: _listing_GetListingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_listing_GetListingsResponse__Output>): grpc.ClientUnaryCall;
  getListings(argument: _listing_GetListingsRequest, callback: grpc.requestCallback<_listing_GetListingsResponse__Output>): grpc.ClientUnaryCall;
  
  GetNearbyListings(argument: _listing_GetNearbyListingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_listing_GetNearbyListingsResponse__Output>): grpc.ClientUnaryCall;
  GetNearbyListings(argument: _listing_GetNearbyListingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_listing_GetNearbyListingsResponse__Output>): grpc.ClientUnaryCall;
  GetNearbyListings(argument: _listing_GetNearbyListingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_listing_GetNearbyListingsResponse__Output>): grpc.ClientUnaryCall;
  GetNearbyListings(argument: _listing_GetNearbyListingsRequest, callback: grpc.requestCallback<_listing_GetNearbyListingsResponse__Output>): grpc.ClientUnaryCall;
  getNearbyListings(argument: _listing_GetNearbyListingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_listing_GetNearbyListingsResponse__Output>): grpc.ClientUnaryCall;
  getNearbyListings(argument: _listing_GetNearbyListingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_listing_GetNearbyListingsResponse__Output>): grpc.ClientUnaryCall;
  getNearbyListings(argument: _listing_GetNearbyListingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_listing_GetNearbyListingsResponse__Output>): grpc.ClientUnaryCall;
  getNearbyListings(argument: _listing_GetNearbyListingsRequest, callback: grpc.requestCallback<_listing_GetNearbyListingsResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface ListingServiceHandlers extends grpc.UntypedServiceImplementation {
  GetListings: grpc.handleUnaryCall<_listing_GetListingsRequest__Output, _listing_GetListingsResponse>;
  
  GetNearbyListings: grpc.handleUnaryCall<_listing_GetNearbyListingsRequest__Output, _listing_GetNearbyListingsResponse>;
  
}

export interface ListingServiceDefinition extends grpc.ServiceDefinition {
  GetListings: MethodDefinition<_listing_GetListingsRequest, _listing_GetListingsResponse, _listing_GetListingsRequest__Output, _listing_GetListingsResponse__Output>
  GetNearbyListings: MethodDefinition<_listing_GetNearbyListingsRequest, _listing_GetNearbyListingsResponse, _listing_GetNearbyListingsRequest__Output, _listing_GetNearbyListingsResponse__Output>
}
