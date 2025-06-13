/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Int64: { input: any; output: any; }
};

export type Listing = {
  __typename?: 'Listing';
  address: Scalars['String']['output'];
  floorArea: Scalars['Float']['output'];
  id: Scalars['Int64']['output'];
  images: Array<ListingImage>;
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  lotArea: Scalars['Float']['output'];
  price: Scalars['Int64']['output'];
};

export type ListingConnection = {
  __typename?: 'ListingConnection';
  edges: Array<ListingEdge>;
  nodes: Array<Listing>;
};

export type ListingEdge = {
  __typename?: 'ListingEdge';
  cursor: Scalars['String']['output'];
  node: Listing;
};

export type ListingImage = {
  __typename?: 'ListingImage';
  id: Scalars['Int64']['output'];
  listingId: Scalars['Int64']['output'];
  url: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  listings: ListingConnection;
};


export type QueryListingsArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  maxLatitude: Scalars['Float']['input'];
  maxLongitude: Scalars['Float']['input'];
  maxPrice?: InputMaybe<Scalars['Int64']['input']>;
  minLatitude: Scalars['Float']['input'];
  minLongitude: Scalars['Float']['input'];
  minPrice?: InputMaybe<Scalars['Int64']['input']>;
};

export type GetListingsQueryVariables = Exact<{
  minLatitude: Scalars['Float']['input'];
  maxLatitude: Scalars['Float']['input'];
  minLongitude: Scalars['Float']['input'];
  maxLongitude: Scalars['Float']['input'];
  address?: InputMaybe<Scalars['String']['input']>;
  minPrice?: InputMaybe<Scalars['Int64']['input']>;
  maxPrice?: InputMaybe<Scalars['Int64']['input']>;
}>;


export type GetListingsQuery = { __typename?: 'Query', listings: { __typename?: 'ListingConnection', nodes: Array<{ __typename?: 'Listing', id: any, address: string, price: any, lotArea: number, floorArea: number, latitude: number, longitude: number, images: Array<{ __typename?: 'ListingImage', id: any, url: string }> }> } };


export const GetListingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetListings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"minLatitude"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"maxLatitude"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"minLongitude"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"maxLongitude"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"minPrice"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int64"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"maxPrice"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int64"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"minLatitude"},"value":{"kind":"Variable","name":{"kind":"Name","value":"minLatitude"}}},{"kind":"Argument","name":{"kind":"Name","value":"maxLatitude"},"value":{"kind":"Variable","name":{"kind":"Name","value":"maxLatitude"}}},{"kind":"Argument","name":{"kind":"Name","value":"minLongitude"},"value":{"kind":"Variable","name":{"kind":"Name","value":"minLongitude"}}},{"kind":"Argument","name":{"kind":"Name","value":"maxLongitude"},"value":{"kind":"Variable","name":{"kind":"Name","value":"maxLongitude"}}},{"kind":"Argument","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}},{"kind":"Argument","name":{"kind":"Name","value":"minPrice"},"value":{"kind":"Variable","name":{"kind":"Name","value":"minPrice"}}},{"kind":"Argument","name":{"kind":"Name","value":"maxPrice"},"value":{"kind":"Variable","name":{"kind":"Name","value":"maxPrice"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"lotArea"}},{"kind":"Field","name":{"kind":"Name","value":"floorArea"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetListingsQuery, GetListingsQueryVariables>;