import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useApp } from '../containers/common/AppContext'
import hasura from '../hasura'

type SectionType =
  | 'homeCover'
  | 'homeActivity'
  | 'homeCreator'
  | 'homePost'
  | 'homeProgram'
  | 'homeProgramCategory'
  | 'messenger'

type AppPageSectionProps = {
  id: string
  options: any
  type: SectionType
}

export type AppPageProps = {
  id: string | null
  path: string | null
  craftData: { [key: string]: string } | null
  options: { [key: string]: string } | null
  appPageSections: AppPageSectionProps[]
}

export const usePage = (path: string) => {
  const { id: appId } = useApp()
  const { loading, error, data } = useQuery<hasura.GET_PAGE, hasura.GET_PAGEVariables>(
    gql`
      query GET_PAGE($path: String, $appId: String) {
        app_page(
          where: {
            path: { _eq: $path }
            app_id: { _eq: $appId }
            published_at: { _is_null: false }
            is_deleted: { _eq: false }
          }
        ) {
          id
          path
          options
          craft_data
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
    craftData: data?.app_page[0] ? data.app_page[0].craft_data : null,
    options: data?.app_page[0]?.options || null,
    appPageSections: data?.app_page[0]
      ? data?.app_page[0].app_page_sections.map((v: { id: string; options: any; type: string }) => ({
          id: v.id,
          options: v.options,
          type: v.type as SectionType,
        }))
      : [],
  }
  return {
    loadingAppPage: loading,
    errorAppPage: error,
    appPage,
  }
}
