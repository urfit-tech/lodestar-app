import React from 'react'
import { hydrate, render } from 'react-dom'
import { hot } from 'react-hot-loader/root'
import App from './Application'
import { unregister } from './serviceWorker'

const appId = process.env.REACT_APP_ID || (window as any).APP_ID
const Application = process.env.NODE_ENV === 'production' ? App : hot(App)
const rootElement = document.getElementById('root')
if (rootElement && rootElement.hasChildNodes()) {
  hydrate(<Application appId={appId} />, rootElement)
} else {
  render(<Application appId={appId} />, rootElement)
}
unregister()
