import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import { equals } from 'ramda'
import React, { useContext, useEffect } from 'react'
import ReactPixel from 'react-facebook-pixel'
import ReactGA from 'react-ga'
import NotificationContext from './contexts/NotificationContext'

const Refresh: React.VFC<{
  pageName: string
}> = React.memo(({ pageName }) => {
  const { refreshToken, currentMemberId } = useAuth()

  useEffect(() => {
    refreshToken?.()
  }, [currentMemberId, pageName, refreshToken])
  return <></>
}, equals)

const LoadablePage: React.VFC<{ pageName: string }> = ({ pageName }) => {
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

  const PageComponent = React.lazy(() => import(`./pages/${pageName}`))
  return (
    <>
      <Refresh pageName={pageName} />
      <PageComponent />
    </>
  )
}

export default LoadablePage
