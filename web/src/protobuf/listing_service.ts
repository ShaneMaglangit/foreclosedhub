import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { ListingServiceClient as _listing_ListingServiceClient, ListingServiceDefinition as _listing_ListingServiceDefinition } from './listing/ListingService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  common: {
    PageInfo: MessageTypeDefinition
  }
  google: {
    protobuf: {
      Timestamp: MessageTypeDefinition
    }
  }
  listing: {
    GetListingsRequest: MessageTypeDefinition
    GetListingsResponse: MessageTypeDefinition
    Listing: MessageTypeDefinition
    ListingService: SubtypeConstructor<typeof grpc.Client, _listing_ListingServiceClient> & { service: _listing_ListingServiceDefinition }
  }
}

