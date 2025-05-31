// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var listing_pb = require('./listing_pb.js');

function serialize_listing_GetListingRequest(arg) {
  if (!(arg instanceof listing_pb.GetListingRequest)) {
    throw new Error('Expected argument of type listing.GetListingRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_listing_GetListingRequest(buffer_arg) {
  return listing_pb.GetListingRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_listing_GetListingResponse(arg) {
  if (!(arg instanceof listing_pb.GetListingResponse)) {
    throw new Error('Expected argument of type listing.GetListingResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_listing_GetListingResponse(buffer_arg) {
  return listing_pb.GetListingResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_listing_GetListingsInBoundaryRequest(arg) {
  if (!(arg instanceof listing_pb.GetListingsInBoundaryRequest)) {
    throw new Error('Expected argument of type listing.GetListingsInBoundaryRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_listing_GetListingsInBoundaryRequest(buffer_arg) {
  return listing_pb.GetListingsInBoundaryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_listing_GetListingsInBoundaryResponse(arg) {
  if (!(arg instanceof listing_pb.GetListingsInBoundaryResponse)) {
    throw new Error('Expected argument of type listing.GetListingsInBoundaryResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_listing_GetListingsInBoundaryResponse(buffer_arg) {
  return listing_pb.GetListingsInBoundaryResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var ListingServiceService = exports.ListingServiceService = {
  getListing: {
    path: '/listing.ListingService/GetListing',
    requestStream: false,
    responseStream: false,
    requestType: listing_pb.GetListingRequest,
    responseType: listing_pb.GetListingResponse,
    requestSerialize: serialize_listing_GetListingRequest,
    requestDeserialize: deserialize_listing_GetListingRequest,
    responseSerialize: serialize_listing_GetListingResponse,
    responseDeserialize: deserialize_listing_GetListingResponse,
  },
  getListingsInBoundary: {
    path: '/listing.ListingService/GetListingsInBoundary',
    requestStream: false,
    responseStream: false,
    requestType: listing_pb.GetListingsInBoundaryRequest,
    responseType: listing_pb.GetListingsInBoundaryResponse,
    requestSerialize: serialize_listing_GetListingsInBoundaryRequest,
    requestDeserialize: deserialize_listing_GetListingsInBoundaryRequest,
    responseSerialize: serialize_listing_GetListingsInBoundaryResponse,
    responseDeserialize: deserialize_listing_GetListingsInBoundaryResponse,
  },
};

exports.ListingServiceClient = grpc.makeGenericClientConstructor(ListingServiceService, 'ListingService');
