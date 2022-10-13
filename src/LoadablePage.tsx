import Cookies from 'js-cookie'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import React, { useContext, useEffect } from 'react'
import ReactPixel from 'react-facebook-pixel'
import ReactGA from 'react-ga'
import { StringParam, useQueryParams } from 'use-query-params'
import NotificationContext from './contexts/NotificationContext'

const LoadablePage: React.VFC<{ pageName: string }> = ({ pageName }) => {
  const tracking = useTracking()
  const { settings } = useApp()
  const { currentMemberId } = useAuth()

  const { refetchNotifications } = useContext(NotificationContext)

  const [utmQuery] = useQueryParams({
    utm_medium: StringParam,
    utm_source: StringParam,
    utm_term: StringParam,
    vtm_channel: StringParam,
    vtm_stat_id: StringParam,
    vtmz: StringParam,
  })
  if (utmQuery.utm_source) {
    utmQuery.utm_medium &&
      Cookies.set('utm_medium', utmQuery.utm_medium, { expires: Number(settings['utm.expires']) || 30 })
    utmQuery.utm_source &&
      Cookies.set('utm_source', utmQuery.utm_source, { expires: Number(settings['utm.expires']) || 30 })
    utmQuery.utm_term && Cookies.set('utm_term', utmQuery.utm_term, { expires: Number(settings['utm.expires']) || 30 })
  }

  useEffect(() => {
    settings['tracking.ga_id'] && ReactGA.pageview(window.location.pathname + window.location.search)
    settings['tracking.fb_pixel_id'] && ReactPixel.pageView()
  }, [settings, tracking])

  useEffect(() => {
    currentMemberId && refetchNotifications && refetchNotifications()
  }, [currentMemberId, pageName, refetchNotifications])

  const PageComponent = React.lazy(() => import(`./pages/${pageName}`))
  return <PageComponent />
}

export default LoadablePage
