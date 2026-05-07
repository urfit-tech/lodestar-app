import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import React, { useContext, useEffect } from 'react'
import ReactPixel from 'react-facebook-pixel'
import ReactGA from 'react-ga'
import NotificationContext from './contexts/NotificationContext'

const folderModules = import.meta.glob('./pages/**/index.{ts,tsx}')
const flatModules = import.meta.glob('./pages/**/*.{ts,tsx}')
const pageComponentCache = new Map<string, React.LazyExoticComponent<React.ComponentType>>()

const loadPageModule = (pageName: string) => {
  const pageLoaders = [
    folderModules[`./pages/${pageName}/index.tsx`],
    folderModules[`./pages/${pageName}/index.ts`],
    flatModules[`./pages/${pageName}.tsx`],
    flatModules[`./pages/${pageName}.ts`],
  ]
  const loader = pageLoaders.find(Boolean)
  if (!loader) {
    throw new Error(`Unknown page: ${pageName}`)
  }
  return loader() as Promise<{ default: React.ComponentType }>
}

const getPageComponent = (pageName: string) => {
  const cachedComponent = pageComponentCache.get(pageName)
  if (cachedComponent) {
    return cachedComponent
  }

  const PageComponent = React.lazy(() => loadPageModule(pageName))
  pageComponentCache.set(pageName, PageComponent)
  return PageComponent
}

const LoadablePage: React.FC<{ pageName: string }> = ({ pageName }) => {
  const tracking = useTracking()
  const { settings } = useApp()
  const { currentMemberId } = useAuth()

  const { refetchNotifications } = useContext(NotificationContext)

  useEffect(() => {
    settings['tracking.ga_id'] && ReactGA.pageview(window.location.pathname + window.location.search)
    settings['tracking.fb_pixel_id'] && ReactPixel.pageView()
  }, [settings, tracking])

  useEffect(() => {
    currentMemberId && refetchNotifications && refetchNotifications()
  }, [currentMemberId, pageName, refetchNotifications])

  const PageComponent = getPageComponent(pageName)
  return <PageComponent />
}

export default LoadablePage
