// Original file: ../proto/listing_service.proto

import type { Long } from '@grpc/proto-loader';

export interface GetListingsRequest {
  'after'?: (number | string | Long);
  'before'?: (number | string | Long);
  'limit'?: (number);
  'search'?: (string);
  'sources'?: (string)[];
  'occupancyStatuses'?: (string)[];
  'statuses'?: (string)[];
  'minPrice'?: (number | string | Long);
  'maxPrice'?: (number | string | Long);
  '_after'?: "after";
  '_before'?: "before";
  '_maxPrice'?: "maxPrice";
}

export interface GetListingsRequest__Output {
  'after'?: (string);
  'before'?: (string);
  'limit': (number);
  'search': (string);
  'sources': (string)[];
  'occupancyStatuses': (string)[];
  'statuses': (string)[];
  'minPrice': (string);
  'maxPrice'?: (string);
  '_after': "after";
  '_before': "before";
  '_maxPrice': "maxPrice";
}
