import { ConfigProvider } from 'antd'
import zhTW from 'antd/lib/locale-provider/zh_TW'
import React, { Suspense } from 'react'
import { StyleSheetManager } from 'styled-components'
import AppRouter, { RouteProps } from './components/common/AppRouter'
import ErrorBoundary from './containers/common/ErrorBoundary'
import { AudioPlayerProvider } from './contexts/AudioPlayerContext'
import { CartProvider } from './contexts/CartContext'
import { CustomRendererProps, CustomRendererProvider } from './contexts/CustomRendererContext'
import { LocaleProvider } from './contexts/LocaleContext'
import { LodestarAppProvider } from './contexts/LodestarAppContext'
import { MediaPlayerProvider } from './contexts/MediaPlayerContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { PodcastPlayerProvider } from './contexts/PodcastPlayerContext'
import './styles.scss'

const SignupPropertyModal = React.lazy(() => import('./components/common/SignupPropertyModal'))
const InAppBrowserWarningModal = React.lazy(() => import('./components/common/InAppBrowserWarningModal'))
const GlobalPodcastPlayer = React.lazy(() => import('./components/podcast/GlobalPodcastPlayer'))
const GlobalAudioPlayer = React.lazy(() => import('./components/audio/GlobalAudioPlayer'))

const Application: React.FC<{
  appId: string
  extraRouteProps?: { [routeKey: string]: RouteProps }
  customRender?: CustomRendererProps
}> = ({ appId, extraRouteProps, customRender }) => {
  return (
    <StyleSheetManager disableCSSOMInjection>
      <ErrorBoundary>
        <LodestarAppProvider appId={appId}>
          <LocaleProvider>
            <CartProvider>
              <NotificationProvider>
                <AudioPlayerProvider>
                  <PodcastPlayerProvider>
                    <MediaPlayerProvider>
                      <ConfigProvider locale={zhTW}>
                        <CustomRendererProvider renderer={customRender}>
                          <AppRouter extra={extraRouteProps}>
                            <Suspense fallback={null}>
                              <GlobalPodcastPlayer />
                            </Suspense>
                            <Suspense fallback={null}>
                              <GlobalAudioPlayer />
                            </Suspense>
                            <Suspense fallback={null}>
                              <SignupPropertyModal key={document.location.href} />
                            </Suspense>
                            <Suspense fallback={null}>
                              <InAppBrowserWarningModal />
                            </Suspense>
                          </AppRouter>
                        </CustomRendererProvider>
                      </ConfigProvider>
                    </MediaPlayerProvider>
                  </PodcastPlayerProvider>
                </AudioPlayerProvider>
              </NotificationProvider>
            </CartProvider>
          </LocaleProvider>
        </LodestarAppProvider>
      </ErrorBoundary>
    </StyleSheetManager>
  )
}

export default Application
