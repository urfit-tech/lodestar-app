import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useApp } from '../containers/common/AppContext'
import types from '../types'

export type AppPageSectionProps = { id: string; options: any; type: string }

export type AppPageProps = {
  id: string
  path: string
  appPageSections: AppPageSectionProps[]
}

export const usePage = (path: string) => {
  const { id: appId } = useApp()
  const { loading, error, data } = useQuery<types.GET_PAGE, types.GET_PAGEVariables>(
    gql`
      query GET_PAGE($path: String, $appId: String) {
        app_page(where: { path: { _eq: $path }, app_id: { _eq: $appId } }) {
          id
          path
          app_page_sections(order_by: { position: asc }) {
            id
            options
            type
          }
        }
      }
    `,
    {
      variables: {
        appId,
        path,
      },
    },
  )

  const appPage: AppPageProps = {
    id: data?.app_page[0].id,
    path: data?.app_page[0].path || '',
    appPageSections:
      data?.app_page[0].app_page_sections.map((v: { id: string; options: any; type: string }) => ({
        id: v.id,
        options: v.options,
        type: v.type,
      })) || [],
  }
  return {
    loadingAppPage: loading,
    errorAppPage: error,
    appPage,
  }
}
