import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import React, { createContext, useContext, useEffect } from 'react'
import { useAuth } from '../../components/auth/AuthContext'
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
  settings: {
    [key: string]: string
  } & {
    'payment.perpetual.default_gateway'?: undefined
    'payment.perpetual.default_gateway_method'?: undefined
    'payment.subscription.default_gateway'?: undefined
  }
  currencyId: string
  currencies: {
    [currencyId: string]: { id: string; label: string | null; unit: string | null; minorUnits: number | null }
  }
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
  const { data } = useQuery<hasura.GET_APP, hasura.GET_APPVariables>(
    gql`
      query GET_APP($appId: String!) {
        currency {
          id
          label
          unit
          minor_units
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
    {
      variables: { appId },
      context: { important: true },
    },
  )

  const settings = Object.fromEntries(data?.app_by_pk?.app_settings.map(v => [v.key, v.value]) || [])

  const app: AppProps = data?.app_by_pk
    ? {
        loading: false,
        id: data.app_by_pk.id,
        name: data.app_by_pk.name || '',
        title: data.app_by_pk.title,
        description: data.app_by_pk.description,
        enabledModules: Object.fromEntries(data.app_by_pk.app_modules.map(v => [v.module_id, true]) || []),
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
        currencies: Object.fromEntries(
          data.currency.map(v => [v.id, { id: v.id, label: v.label, unit: v.unit, minorUnits: v.minor_units }]),
        ),
      }
    : defaultAppProps

  useEffect(() => {
    if (!authToken) {
      refreshToken?.()
    }
  }, [appId, authToken, refreshToken])

  return <AppContext.Provider value={app}>{children}</AppContext.Provider>
}
