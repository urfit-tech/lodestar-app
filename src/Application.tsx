import { ConfigProvider } from 'antd'
import zhTW from 'antd/lib/locale-provider/zh_TW'
import 'braft-editor/dist/index.css'
import 'braft-editor/dist/output.css'
import React from 'react'
import { AuthProvider } from './components/auth/AuthContext'
import { ApiProvider } from './components/common/ApiContext'
import ApplicationHelmet from './components/common/ApplicationHelmet'
import AppRouter, { RouteProps } from './components/common/AppRouter'
import { AppThemeProvider } from './components/common/AppThemeContext'
import { AppProvider } from './containers/common/AppContext'
import ErrorBoundary from './containers/common/ErrorBoundary'
import { CartProvider } from './contexts/CartContext'
import { CustomRendererProps, CustomRendererProvider } from './contexts/CustomRendererContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { PodcastPlayerProvider } from './contexts/PodcastPlayerContext'

const LodestarAppProvider: React.FC<{ appId: string }> = ({ appId, children }) => {
  const LodestarAppContext = React.createContext({ appId })
  return (
    <LodestarAppContext.Provider value={{ appId }}>
      <AuthProvider appId={appId}>
        <ApiProvider appId={appId}>
          <AppProvider appId={appId}>
            <LanguageProvider>
              <AppThemeProvider>{children}</AppThemeProvider>
            </LanguageProvider>
          </AppProvider>
        </ApiProvider>
      </AuthProvider>
    </LodestarAppContext.Provider>
  )
}

const Application: React.FC<{
  appId: string
  extraRouteProps?: { [routeKey: string]: RouteProps }
  customRender?: CustomRendererProps
}> = ({ appId, extraRouteProps, customRender }) => {
  return (
    <LodestarAppProvider appId={appId}>
      <CartProvider>
        <NotificationProvider>
          <PodcastPlayerProvider>
            <ErrorBoundary>
              <ConfigProvider locale={zhTW}>
                <CustomRendererProvider renderer={customRender}>
                  <ApplicationHelmet />
                  <AppRouter extra={extraRouteProps} />
                </CustomRendererProvider>
              </ConfigProvider>
            </ErrorBoundary>
          </PodcastPlayerProvider>
        </NotificationProvider>
      </CartProvider>
    </LodestarAppProvider>
  )
}

export default Application
