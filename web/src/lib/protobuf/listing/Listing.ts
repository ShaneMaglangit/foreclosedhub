// Original file: proto/listing.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../google/protobuf/Timestamp';
import type { Long } from '@grpc/proto-loader';

export interface Listing {
  'id'?: (number | string | Long);
  'source'?: (string);
  'externalId'?: (string);
  'address'?: (string);
  'floorArea'?: (number | string);
  'price'?: (number | string | Long);
  'occupancyStatus'?: (string);
  'imageLoaded'?: (boolean);
  'imageUrls'?: (string)[];
  'createdAt'?: (_google_protobuf_Timestamp | null);
  'updatedAt'?: (_google_protobuf_Timestamp | null);
  'payload'?: (string);
}

export interface Listing__Output {
  'id': (string);
  'source': (string);
  'externalId': (string);
  'address': (string);
  'floorArea': (number);
  'price': (string);
  'occupancyStatus': (string);
  'imageLoaded': (boolean);
  'imageUrls': (string)[];
  'createdAt': (_google_protobuf_Timestamp__Output | null);
  'updatedAt': (_google_protobuf_Timestamp__Output | null);
  'payload': (string);
}
