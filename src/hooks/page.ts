import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useApp } from '../containers/common/AppContext'
import hasura from '../hasura'

type AppPageSectionProps = { id: string; options: any; type: string }

export type AppPageProps = {
  id: string | null
  path: string | null
  appPageSections: AppPageSectionProps[]
}

export const usePage = (path: string) => {
  const { id: appId } = useApp()
  const { loading, error, data } = useQuery<hasura.GET_PAGE, hasura.GET_PAGEVariables>(
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

  const appPage: AppPageProps | null = {
    id: data?.app_page[0] ? data.app_page[0].id : null,
    path: data?.app_page[0] ? data.app_page[0].path : null,
    appPageSections: data?.app_page[0]
      ? data?.app_page[0].app_page_sections.map((v: { id: string; options: any; type: string }) => ({
          id: v.id,
          options: v.options,
          type: v.type,
        }))
      : [],
  }
  return {
    loadingAppPage: loading,
    errorAppPage: error,
    appPage,
  }
}
