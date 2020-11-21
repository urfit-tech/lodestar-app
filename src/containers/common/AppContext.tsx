import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import React, { createContext, useContext, useEffect } from 'react'
import { useAuth } from '../../components/auth/AuthContext'
import ApplicationHelmet from '../../components/common/ApplicationHelmet'
import types from '../../types'
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
  const { authToken, refreshToken, backendEndpoint, setBackendEndpoint } = useAuth()
  const { loading, error, data } = useQuery<types.GET_APP, types.GET_APPVariables>(
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
        app_admin(where: { app_id: { _eq: $appId } }, order_by: { position: asc_nulls_last }, limit: 1) {
          api_host
        }
      }
    `,
    { variables: { appId } },
  )

  const settings =
    data?.app_by_pk?.app_settings?.reduce((accumulator, appSetting, index) => {
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

  // after getting app, fetch the auth token
  const apiHost = data?.app_admin[0]?.api_host

  useEffect(() => {
    if (!backendEndpoint) {
      if (apiHost) {
        setBackendEndpoint?.(`https://${apiHost}`)
      } else {
        setBackendEndpoint?.(process.env.REACT_APP_BACKEND_ENDPOINT || '')
      }
    } else if (!authToken) {
      refreshToken?.({ appId })
    }
  }, [apiHost, appId, authToken, backendEndpoint, refreshToken, setBackendEndpoint])

  return (
    <AppContext.Provider value={app}>
      <ApplicationHelmet />
      {children}
    </AppContext.Provider>
  )
}
