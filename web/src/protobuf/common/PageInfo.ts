// Original file: ../proto/common.proto

import type { Long } from "@grpc/proto-loader";

export interface PageInfo {
  count?: number;
  startCursor?: number | string | Long;
  endCursor?: number | string | Long;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface PageInfo__Output {
  count: number;
  startCursor: string;
  endCursor: string;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
