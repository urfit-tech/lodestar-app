import axios from 'axios'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAppTheme } from 'lodestar-app-element/src/contexts/AppThemeContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useContext, useEffect, useRef } from 'react'
import { useIntl } from 'react-intl'
import LocaleContext from '../contexts/LocaleContext'
import { productMessages } from '../helpers/translation'
import { IpApiResponseFail, IpApiResponseSuccess } from '../types/general'

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

export const useSwarmify = () => {
  const { formatMessage } = useIntl()
  const theme = useAppTheme()
  const { settings } = useApp()
  const { currentMember, isAuthenticating } = useAuth()
  const swarmcdnkey = settings['swarmify.cdn_key']

  if (theme && !isAuthenticating && swarmcdnkey && settings['feature.swarmify.enabled'] === '1') {
    const swarmoptions = {
      swarmcdnkey,
      theme: {
        button: 'circle',
        primaryColor: theme ? theme.colors.primary?.[500] : '#000',
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
        ctx.fillText(text, 8, canvas.height / 2 + 4, canvas.width)
      }
      const dataUri = canvas.toDataURL()
      ;(swarmoptions.plugins as any).watermark = {
        file: dataUri,
        xpos: 100,
        ypos: 0,
        opacity: 0.4,
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

export const useCurrency = (currencyId?: string, coinUnit?: string) => {
  const { currentLocale } = useContext(LocaleContext)
  const { currencies, settings } = useApp()

  const formatCurrency = (value: number) => {
    const currentCurrencyId = currencyId || settings['currency_id'] || 'TWD'
    const currency = currencies[currentCurrencyId]

    if (currentCurrencyId === 'LSC') {
      return value + ' ' + settings['coin.unit'] || coinUnit || 'Coins'
    }

    return (
      value.toLocaleString(currentLocale || navigator.language, {
        style: 'currency',
        currency: currentCurrencyId,
        maximumFractionDigits: currency?.['minorUnits'] || 0,
        minimumFractionDigits: 0,
      }) || ''
    )
  }

  return {
    formatCurrency,
  }
}

export async function sleep(time: number): Promise<void> {
  return new Promise<void>((res, rej) => {
    setTimeout(res, time)
  })
}

export async function fetchCurrentGeolocation() {
  try {
    const { data: currentIp } = await axios.get<string>('https://api.ipify.org/')
    const getGeolocationRequest = await axios.get<IpApiResponseSuccess | IpApiResponseFail>(
      `http://ip-api.com/json/${currentIp}?fields=58175`,
    )
    if (getGeolocationRequest.data.status === 'fail') {
      throw new Error(getGeolocationRequest.data.message)
    }
    return {
      ip: currentIp,
      country: getGeolocationRequest.data.country,
      countryCode: getGeolocationRequest.data.countryCode,
      error: null,
    }
  } catch (error) {
    return { ip: null, country: null, countryCode: null, error }
  }
}
