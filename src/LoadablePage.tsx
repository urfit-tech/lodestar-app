import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import React, { useContext, useEffect } from 'react'
import ReactPixel from 'react-facebook-pixel'
import ReactGA from 'react-ga'
import NotificationContext from './contexts/NotificationContext'

const LoadablePage: React.VFC<{ pageName: string }> = ({ pageName }) => {
  const tracking = useTracking()
  const { settings } = useApp()
  const { refetchNotifications } = useContext(NotificationContext)

  useEffect(() => {
    settings['tracking.ga_id'] && ReactGA.pageview(window.location.pathname + window.location.search)
    settings['tracking.fb_pixel_id'] && ReactPixel.pageView()
  }, [settings, tracking])

  useEffect(() => {
    refetchNotifications && refetchNotifications()
  }, [pageName, refetchNotifications])

  const PageComponent = React.lazy(() => import(`./pages/${pageName}`))
  return <PageComponent />
}

export default LoadablePage
