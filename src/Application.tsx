import { ConfigProvider } from 'antd'
import zhTW from 'antd/lib/locale-provider/zh_TW'
import React, { Suspense } from 'react'
import { StyleSheetManager } from 'styled-components'
import AppRouter, { RouteProps } from './components/common/AppRouter'
import InAppBrowserWarningModal from './components/common/InAppBrowserWarningModal'
import SignupPropertyModal from './components/common/SignupPropertyModal'
import GlobalPodcastPlayer from './components/podcast/GlobalPodcastPlayer'
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
                            <GlobalPodcastPlayer />
                            <Suspense fallback={null}>
                              <GlobalAudioPlayer />
                            </Suspense>
                            <SignupPropertyModal key={document.location.href} />
                            <InAppBrowserWarningModal />
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
