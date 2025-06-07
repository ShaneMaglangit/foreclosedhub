import { print } from 'graphql'
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { env } from '@web/env';
 
export async function execute<TResult, TVariables>(
  query: TypedDocumentNode<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  const response = await fetch(env.NEXT_PUBLIC_GRAPHQL_URI, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/graphql-response+json'
    },
    body: JSON.stringify({
      query: print(query),
      variables
    })
  })
 
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  const { data } = await response.json()

  return data as TResult
}