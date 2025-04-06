// Original file: ../proto/listing.proto

import type { Long } from '@grpc/proto-loader';

export interface Listing {
  'id'?: (number | string | Long);
  'source'?: (string);
  'externalId'?: (string);
  'address'?: (string);
  'floorArea'?: (number | string);
  'price'?: (number | string | Long);
  'occupied'?: (boolean);
  'imageLoaded'?: (boolean);
  'imageUrls'?: (string)[];
}

export interface Listing__Output {
  'id': (string);
  'source': (string);
  'externalId': (string);
  'address': (string);
  'floorArea': (number);
  'price': (string);
  'occupied': (boolean);
  'imageLoaded': (boolean);
  'imageUrls': (string)[];
}
