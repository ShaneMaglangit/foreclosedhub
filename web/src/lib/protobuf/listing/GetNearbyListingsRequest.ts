// Original file: ../proto/listing_service.proto

import type { Long } from '@grpc/proto-loader';

export interface GetNearbyListingsRequest {
  'latitude'?: (number | string);
  'longitude'?: (number | string);
  'limit'?: (number);
  'search'?: (string);
  'sources'?: (string)[];
  'occupancyStatuses'?: (string)[];
  'statuses'?: (string)[];
  'minPrice'?: (number | string | Long);
  'maxPrice'?: (number | string | Long);
  '_maxPrice'?: "maxPrice";
}

export interface GetNearbyListingsRequest__Output {
  'latitude': (number);
  'longitude': (number);
  'limit': (number);
  'search': (string);
  'sources': (string)[];
  'occupancyStatuses': (string)[];
  'statuses': (string)[];
  'minPrice': (string);
  'maxPrice'?: (string);
  '_maxPrice': "maxPrice";
}
