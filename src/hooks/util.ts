import Axios from 'axios'
import { filter } from 'ramda'
import { useContext, useEffect, useRef, useState } from 'react'
import ReactPixel from 'react-facebook-pixel'
import ReactGA from 'react-ga'
import TagManager from 'react-gtm-module'
import { hotjar } from 'react-hotjar'
import { useIntl } from 'react-intl'
import { useLocation } from 'react-router-dom'
import { ThemeContext } from 'styled-components'
import { useAuth } from '../components/auth/AuthContext'
import { useApp } from '../containers/common/AppContext'
import { productMessages } from '../helpers/translation'
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
    ReactGA.initialize(settings['tracking.ga_id'])
    ReactGA.plugin.require('ecommerce')
    ReactGA.plugin.require('ec')
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

export const useApiHost = (appId: string) => {
  const [apiHost, setApiHost] = useState<string | null>(null)

  useEffect(() => {
    if (apiHost) {
      return
    }
    Axios.post(
      `https://${process.env.REACT_APP_GRAPHQL_HOST}/v1/graphql`,
      {},
      {
        data: {
          operationName: 'GET_API_HOST',
          query:
            'query GET_API_HOST($appId: String!) { app_admin(where: { app_id: { _eq: $appId } }, order_by: { position: asc_nulls_last }, limit: 1) { api_host } }',
          variables: { appId },
        },
      },
    )
      .then(({ data }) => {
        setApiHost(data?.data?.app_admin[0]?.api_host || process.env.REACT_APP_API_HOST || null)
      })
      .catch(() => {
        setApiHost(process.env.REACT_APP_API_HOST || null)
      })
  }, [apiHost, appId])

  return apiHost
}

export const useSwarmify = () => {
  const { formatMessage } = useIntl()
  const theme = useContext(ThemeContext)
  const { settings } = useApp()
  const { currentMember, isAuthenticating } = useAuth()
  const swarmcdnkey = settings['swarmify.cdn_key']
  if (theme && !isAuthenticating && swarmcdnkey) {
    const swarmoptions = {
      swarmcdnkey,
      theme: {
        button: 'circle',
        primaryColor: theme ? theme['@primary-color'] : '#000',
      },
      plugins: {},
    }
    if (currentMember) {
      const text = `${formatMessage(productMessages.program.content.provide)} ${currentMember.name}-${
        currentMember.email
      } ${formatMessage(productMessages.program.content.watch)}`
      const canvas = document.createElement('canvas')
      canvas.width = text.length * 10
      canvas.height = 40
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.font = '16px sans-serif'
        ctx.fillStyle = 'black'
        ctx.fillText(text, 8, canvas.height / 2)
      }
      const dataUri = canvas.toDataURL()
      ;(swarmoptions.plugins as any).watermark = {
        file: dataUri,
        xpos: 100,
        ypos: 0,
        opacity: 0.6,
      }
    }
    ;(window as any).swarmoptions = swarmoptions
    var is_Custom_Video = 'undefined' != typeof (window as any).swarmvcustomvideo && (window as any).swarmvcustomvideo
    if ('undefined' == typeof (window as any).SWARMIFY_LOADED)
      if (is_Custom_Video) {
        document.write(
          '<script type="text/javascript" src="https://assets.swarmcdn.com/cross/swarmcdn-custom.js"></script>',
        )
        document.write(
          '<link rel="stylesheet" href="https://assets.swarmcdn.com/cross/css/swarmify-custom.css?v=0f237668">',
        )
      } else {
        var currentScriptTag = document.currentScript,
          isAsyncLoad = currentScriptTag && (currentScriptTag as any).async
        if ('loading' !== document.readyState || isAsyncLoad) {
          var scriptElem = document.createElement('script')
          scriptElem.src = 'https://assets.swarmcdn.com/cross/swarmcdn.js?v=e46ab80c'
          var firstScript = document.getElementsByTagName('script')[0]
          firstScript.parentNode?.insertBefore(scriptElem, firstScript)
          window.console && console.log('Swarmify - swarmdetect.js: Script Append Succeeded')
        } else {
          document.write(
            '<script type="text/javascript" id="swarm_script" src="https://assets.swarmcdn.com/cross/swarmcdn.js?v=e46ab80c"></script>',
          )
          process.env.NODE_ENV === 'development' &&
            window.console &&
            console.log('Swarmify - swarmdetect.js: Document Write Succeeded')
        }
      }
    ;(window as any).SWARMIFY_LOADED = !0
  }
}
