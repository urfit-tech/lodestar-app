import React from 'react'
import { hydrate, render } from 'react-dom'
import { hot } from 'react-hot-loader/root'
import App from './Application'
import { unregister } from './serviceWorker'

const appId = process.env.REACT_APP_ID || (window as any).APP_ID
const Application = process.env.NODE_ENV === 'production' ? App : hot(App)
const rootElement = document.getElementById('root')
const renderAuthModal = (visible: boolean) =>
  visible ? (
    (() => {
      // const state = btoa(JSON.stringify({ provider: 'cw', redirect: window.location.pathname }))
      const state = btoa(JSON.stringify({ provider: 'cw', redirect: '/settings/learning-achievement' }))
      const redirectUri = encodeURIComponent(`${window.location.origin}/oauth2/cw`)
      const oauthRoot = process.env.REACT_APP_CW_OAUTH_BASE_ROOT || 'https://dev-account.cwg.tw'
      const oauthClientId = process.env.REACT_APP_CW_OAUTH_CLIENT_ID || '89'
      const oauthLink = `${oauthRoot}/oauth/v1.0/authorize?response_type=code&client_id=${oauthClientId}&redirect_uri=${redirectUri}&state=${state}&scope=social`
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({
        event: 'login',
      })
      window.location.assign(oauthLink)
      return <></>
    })()
  ) : (
    <></>
  )
if (!appId) {
  render(<div>Application cannot be loaded.</div>, rootElement)
} else if (rootElement && rootElement.hasChildNodes()) {
  hydrate(<Application appId={appId} customRender={{ renderAuthModal }} />, rootElement)
} else {
  render(<Application appId={appId} customRender={{ renderAuthModal }} />, rootElement)
}
unregister()
