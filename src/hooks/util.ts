import { filter } from 'ramda'
import { useEffect, useRef } from 'react'
import ReactPixel from 'react-facebook-pixel'
import ReactGA from 'react-ga'
import TagManager from 'react-gtm-module'
import { hotjar } from 'react-hotjar'
import { useLocation } from 'react-router-dom'
import { useApp } from '../containers/common/AppContext'
import { routesProps } from '../Routes'

export const useRouteKeys = () => {
  const location = useLocation()
  return Object.keys(filter(routeProps => routeProps.path === location.pathname, routesProps))
}

export const useInterval = (callback: Function, delay: number | null, immediately?: boolean) => {
  const savedCallback = useRef<Function>()

  // 保存新回调
  useEffect(() => {
    savedCallback.current = callback
  })

  // 建立 interval
  useEffect(() => {
    const tick = () => {
      savedCallback.current && savedCallback.current()
    }
    if (delay !== null) {
      immediately && tick()
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay, immediately])
}

// TODO: should be context
export const useTappay = () => {
  const TPDirect = (window as any)['TPDirect']
  const { settings } = useApp()

  settings['tappay.app_id'] &&
    settings['tappay.app_key'] &&
    TPDirect &&
    TPDirect.setupSDK(
      settings['tappay.app_id'],
      settings['tappay.app_key'],
      settings['tappay.dry_run'] === 'true' ? 'sandbox' : 'production',
    )

  return { TPDirect }
}

export const useGA = () => {
  const { settings } = useApp()

  if (settings['tracking.ga_id']) {
    ReactGA.initialize(settings['tracking.ga_id'], { debug: process.env.NODE_ENV === 'development' })
    ReactGA.plugin.require('ecommerce', { debug: process.env.NODE_ENV === 'development' })
    ReactGA.plugin.require('ec', { debug: process.env.NODE_ENV === 'development' })
  }
}

export const useGAPageView = () => {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search)
  }, [])
}

export const usePixel = () => {
  const { settings } = useApp()

  settings['tracking.fb_pixel_id'] && ReactPixel.init(settings['tracking.fb_pixel_id'])
}

export const useHotjar = () => {
  const { settings } = useApp()

  try {
    settings['tracking.hotjar_id'] &&
      settings['tracking.hotjar_sv'] &&
      hotjar.initialize(parseInt(settings['tracking.hotjar_id']), parseInt(settings['tracking.hotjar_sv']))
  } catch (error) {
    process.env.NODE_ENV === 'development' && console.error(error)
  }
}

export const useGTM = () => {
  const { settings } = useApp()

  try {
    if (settings['tracking.gtm_id']) {
      TagManager.initialize({
        gtmId: settings['tracking.gtm_id'],
      })
    }
  } catch (error) {
    process.env.NODE_ENV === 'development' && console.error(error)
  }
}
