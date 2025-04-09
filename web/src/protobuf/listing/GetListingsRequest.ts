// Original file: ../proto/listing_service.proto

import type { Long } from '@grpc/proto-loader';

export interface GetListingsRequest {
  'after'?: (number | string | Long);
  'before'?: (number | string | Long);
  'limit'?: (number);
  'search'?: (string);
  'sources'?: (string)[];
  'occupied'?: (boolean);
  '_after'?: "after";
  '_before'?: "before";
  '_occupied'?: "occupied";
}

export interface GetListingsRequest__Output {
  'after'?: (string);
  'before'?: (string);
  'limit': (number);
  'search': (string);
  'sources': (string)[];
  'occupied'?: (boolean);
  '_after': "after";
  '_before': "before";
  '_occupied': "occupied";
}
