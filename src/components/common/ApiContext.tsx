import { ApolloProvider } from '@apollo/react-hooks'
import React from 'react'
import { createApolloClient } from '../../helpers/apollo'
import { useAuth } from '../auth/AuthContext'

export const ApiProvider: React.FC<{ appId: string }> = ({ appId, children }) => {
  const { authToken } = useAuth()
  const apolloClient = createApolloClient({ appId, authToken })

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}
