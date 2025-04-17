// Original file: ../proto/listing.proto

import type { Long } from '@grpc/proto-loader';

export interface Listing {
  'id'?: (number | string | Long);
  'source'?: (string);
  'externalId'?: (string);
  'address'?: (string);
  'floorArea'?: (number | string);
  'price'?: (number | string | Long);
  'occupancyStatus'?: (string);
  'imageUrls'?: (string)[];
  'payload'?: (string);
  'latitude'?: (number | string);
  'longitude'?: (number | string);
}

export interface Listing__Output {
  'id': (string);
  'source': (string);
  'externalId': (string);
  'address': (string);
  'floorArea': (number);
  'price': (string);
  'occupancyStatus': (string);
  'imageUrls': (string)[];
  'payload': (string);
  'latitude': (number);
  'longitude': (number);
}
