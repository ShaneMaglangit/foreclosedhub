// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var listing_pb = require('./listing_pb.js');

function serialize_listing_GetListingMarkersRequest(arg) {
  if (!(arg instanceof listing_pb.GetListingMarkersRequest)) {
    throw new Error('Expected argument of type listing.GetListingMarkersRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_listing_GetListingMarkersRequest(buffer_arg) {
  return listing_pb.GetListingMarkersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_listing_GetListingMarkersResponse(arg) {
  if (!(arg instanceof listing_pb.GetListingMarkersResponse)) {
    throw new Error('Expected argument of type listing.GetListingMarkersResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_listing_GetListingMarkersResponse(buffer_arg) {
  return listing_pb.GetListingMarkersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

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
  getListingMarkers: {
    path: '/listing.ListingService/GetListingMarkers',
    requestStream: false,
    responseStream: false,
    requestType: listing_pb.GetListingMarkersRequest,
    responseType: listing_pb.GetListingMarkersResponse,
    requestSerialize: serialize_listing_GetListingMarkersRequest,
    requestDeserialize: deserialize_listing_GetListingMarkersRequest,
    responseSerialize: serialize_listing_GetListingMarkersResponse,
    responseDeserialize: deserialize_listing_GetListingMarkersResponse,
  },
};

exports.ListingServiceClient = grpc.makeGenericClientConstructor(ListingServiceService, 'ListingService');
