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
import './styles.scss'

const Application: React.FC<{
  appId: string
  extraRouteProps?: { [routeKey: string]: RouteProps }
  customRender?: CustomRendererProps
}> = ({ appId, extraRouteProps, customRender }) => {
  return (
    <LodestarAppProvider appId={appId}>
      <LanguageProvider>
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
      </LanguageProvider>
    </LodestarAppProvider>
  )
}

export default Application
