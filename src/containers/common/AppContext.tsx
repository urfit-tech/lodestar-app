import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import React, { createContext, useContext, useEffect } from 'react'
import { useAuth } from '../../components/auth/AuthContext'
import ApplicationHelmet from '../../components/common/ApplicationHelmet'
import hasura from '../../hasura'
import { Module } from '../../types/general'

type AppProps = {
  loading: boolean
  id: string
  name: string
  title: string | null
  description: string | null
  enabledModules: {
    [key in Module]?: boolean
  }
  navs: {
    block: string
    position: number
    label: string
    icon: string | null
    href: string
    external: boolean
    locale: string
    tag: string | null
  }[]
  settings: { [key: string]: string }
  currencyId: string
  currencies: { [currencyId: string]: { id: string; label: string | null; unit: string | null } }
}

const defaultAppProps: AppProps = {
  loading: true,
  id: '',
  name: '',
  title: null,
  description: null,
  enabledModules: {},
  navs: [],
  settings: {},
  currencyId: 'TWD',
  currencies: {},
}

const AppContext = createContext<AppProps>(defaultAppProps)
export const useApp = () => useContext(AppContext)

export const AppProvider: React.FC<{ appId: string }> = ({ appId, children }) => {
  const { authToken, refreshToken } = useAuth()
  const { loading, error, data } = useQuery<hasura.GET_APP, hasura.GET_APPVariables>(
    gql`
      query GET_APP($appId: String!) {
        currency {
          id
          label
          unit
        }
        app_by_pk(id: $appId) {
          id
          name
          title
          description
          app_modules {
            id
            module_id
          }
          app_navs(order_by: { position: asc }) {
            block
            position
            label
            icon
            href
            external
            locale
            tag
          }
          app_settings {
            key
            value
          }
        }
      }
    `,
    { variables: { appId } },
  )

  const settings =
    data?.app_by_pk?.app_settings?.reduce((accumulator, appSetting) => {
      accumulator[appSetting.key] = appSetting.value
      return accumulator
    }, {} as { [key: string]: string }) || {}

  const app: AppProps =
    loading || error || !data || !data.app_by_pk
      ? defaultAppProps
      : (() => {
          const enabledModules: { [key in Module]?: boolean } = {}
          data.app_by_pk &&
            data.app_by_pk.app_modules.forEach(appModule => {
              enabledModules[appModule.module_id as Module] = true
            })

          return {
            loading: false,
            id: data.app_by_pk.id,
            name: data.app_by_pk.name || '',
            title: data.app_by_pk.title,
            description: data.app_by_pk.description,
            enabledModules,
            navs: data.app_by_pk.app_navs.map(appNav => ({
              block: appNav.block,
              position: appNav.position,
              label: appNav.label,
              icon: appNav.icon,
              href: appNav.href,
              external: appNav.external,
              locale: appNav.locale,
              tag: appNav.tag,
            })),
            settings,
            currencyId: settings['currency_id'] || 'TWD',
            currencies: data.currency.reduce((accumulation, currency) => {
              accumulation[currency.id] = currency
              return accumulation
            }, {} as AppProps['currencies']),
          }
        })()

  useEffect(() => {
    if (!authToken) {
      refreshToken?.()
    }
  }, [appId, authToken, refreshToken])

  return (
    <AppContext.Provider value={app}>
      <ApplicationHelmet />
      {children}
    </AppContext.Provider>
  )
}
