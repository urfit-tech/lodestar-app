import { ApolloProvider } from '@apollo/client'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { ApolloClientOptions, createApolloClient } from 'lodestar-app-element/src/helpers/apollo'
import React from 'react'
import { createStableApolloClientFactory } from './stableApolloClient.mjs'

const getStableApolloClient = createStableApolloClientFactory(createApolloClient)

export const ApiProvider: React.FC<{ appId: string }> = ({ appId, children }) => {
  const { authToken } = useAuth()
  const graphQLRetryCallbacks: ApolloClientOptions['graphQLRetryCallbacks'] = [
    (count, operation, errors) =>
      operation.operationName === 'GET_PROGRAM_COLLECTION' &&
      count < 3 &&
      (errors || []).some(error => error.extensions?.code === 'validation-failed'),
  ]

  const apolloClient = getStableApolloClient(
    { appId, authToken, graphQLRetryCallbacks },
    {
      'invalid-jwt': window.location.reload,
    },
  )

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}
