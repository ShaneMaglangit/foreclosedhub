// Original file: ../proto/listing_service.proto

import type { Listing as _listing_Listing, Listing__Output as _listing_Listing__Output } from '../listing/Listing';
import type { PageInfo as _common_PageInfo, PageInfo__Output as _common_PageInfo__Output } from '../common/PageInfo';

export interface GetListingsResponse {
  'listings'?: (_listing_Listing)[];
  'pageInfo'?: (_common_PageInfo | null);
}

export interface GetListingsResponse__Output {
  'listings': (_listing_Listing__Output)[];
  'pageInfo': (_common_PageInfo__Output | null);
}
