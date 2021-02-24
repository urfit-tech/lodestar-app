import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import types from '../types'

export type AppPageSectionProps = { id: string; options: { [key: string]: any }; type: string }

export type AppPageProps = {
  id: string
  path: string
  appPageSections: AppPageSectionProps[]
}

export const usePage = (path: string) => {
  const { loading, error, data } = useQuery<types.GET_PAGE, types.GET_PAGEVariables>(
    gql`
      query GET_PAGE($path: String) {
        app_page(where: { path: { _eq: $path } }) {
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
        path,
      },
    },
  )

  const appPage: AppPageProps[] =
    data?.app_page.map(v => ({
      id: v.id,
      path: v.path,
      appPageSections: v.app_page_sections.map(section => ({
        id: section.id,
        options: section.options,
        type: section.type,
      })),
    })) || []

  return {
    loadingAppPage: loading,
    errorAppPage: error,
    appPage,
  }
}
