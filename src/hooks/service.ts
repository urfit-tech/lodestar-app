import { gql, useQuery } from '@apollo/client'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import hasura from '../hasura'

export const useService = () => {
  const { id: appId } = useApp()
  const { loading, data } = useQuery<hasura.GetService, hasura.GetServiceVariables>(
    gql`
      query GetService($appId: String!) {
        service(where: { app_id: { _eq: $appId } }) {
          id
          gateway
        }
      }
    `,
    { variables: { appId } },
  )
  const services: { id: string; gateway: string }[] =
    data?.service.map(v => ({
      id: v.id,
      gateway: v.gateway,
    })) || []

  return {
    loading,
    services,
  }
}
