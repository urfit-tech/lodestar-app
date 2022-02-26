import { ConfigProvider } from 'antd'
import zhTW from 'antd/lib/locale-provider/zh_TW'
import 'braft-editor/dist/index.css'
import 'braft-editor/dist/output.css'
import { LodestarAppProvider } from 'lodestar-app-element/src/contexts/LodestarAppContext'
import React from 'react'
import { StyleSheetManager } from 'styled-components'
import AppRouter, { RouteProps } from './components/common/AppRouter'
import GlobalPodcastPlayer from './components/podcast/GlobalPodcastPlayer'
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
    <StyleSheetManager disableCSSOMInjection>
      <ErrorBoundary>
        <LodestarAppProvider appId={appId}>
          <LanguageProvider>
            <CartProvider>
              <NotificationProvider>
                <PodcastPlayerProvider>
                  <ConfigProvider locale={zhTW}>
                    <CustomRendererProvider renderer={customRender}>
                      <AppRouter extra={extraRouteProps}>
                        <GlobalPodcastPlayer />
                      </AppRouter>
                    </CustomRendererProvider>
                  </ConfigProvider>
                </PodcastPlayerProvider>
              </NotificationProvider>
            </CartProvider>
          </LanguageProvider>
        </LodestarAppProvider>
      </ErrorBoundary>
    </StyleSheetManager>
  )
}

export default Application
