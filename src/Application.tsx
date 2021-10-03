import { ConfigProvider } from 'antd'
import zhTW from 'antd/lib/locale-provider/zh_TW'
import 'braft-editor/dist/index.css'
import 'braft-editor/dist/output.css'
import { LodestarAppProvider } from 'lodestar-app-element/src/contexts/LodestarAppContext'
import React from 'react'
import ApplicationHelmet from './components/common/ApplicationHelmet'
import AppRouter, { RouteProps } from './components/common/AppRouter'
import ErrorBoundary from './containers/common/ErrorBoundary'
import { CartProvider } from './contexts/CartContext'
import { CustomRendererProps, CustomRendererProvider } from './contexts/CustomRendererContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { PodcastPlayerProvider } from './contexts/PodcastPlayerContext'

const Application: React.FC<{
  appId: string
  extraRouteProps?: { [routeKey: string]: RouteProps }
  customRender?: CustomRendererProps
}> = ({ appId, extraRouteProps, customRender }) => {
  return (
    <ErrorBoundary>
      <LodestarAppProvider appId={appId}>
        <LanguageProvider>
          <CartProvider>
            <NotificationProvider>
              <PodcastPlayerProvider>
                <ConfigProvider locale={zhTW}>
                  <CustomRendererProvider renderer={customRender}>
                    <ApplicationHelmet />
                    <AppRouter extra={extraRouteProps} />
                  </CustomRendererProvider>
                </ConfigProvider>
              </PodcastPlayerProvider>
            </NotificationProvider>
          </CartProvider>
        </LanguageProvider>
      </LodestarAppProvider>
    </ErrorBoundary>
  )
}

export default Application
