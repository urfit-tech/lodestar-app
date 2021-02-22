import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useApp } from '../containers/common/AppContext'
import types from '../types'

export type PageProps = { id: string; type: string; options: { [key: string]: any }; position: number | null }

export const usePage = () => {
  const { id: appId } = useApp()
  const { loading, error, data } = useQuery<types.GET_PAGE, types.GET_PAGEVariables>(
    gql`
      query GET_PAGE($id: String, $appId: String) {
        app_page(where: { id: { _eq: $id }, app_id: { _eq: $appId } }, order_by: { position: asc }) {
          id
          type
          options
          position
        }
      }
    `,
    {
      variables: {
        id: `Home_${appId}`,
        appId: `${appId}`,
      },
    },
  )

  const page: PageProps[] = data?.app_page || []

  return {
    loading,
    error,
    sections: page,
  }
}
