import React from 'react'
import { hydrate, render } from 'react-dom'
import { hot } from 'react-hot-loader/root'
import App from './Application'
import { unregister } from './serviceWorker'

const appId = process.env.REACT_APP_ID || ''
const Application = process.env.NODE_ENV === 'development' ? hot(App) : App
const rootElement = document.getElementById('root')
if (rootElement && rootElement.hasChildNodes()) {
  hydrate(<Application appId={appId} />, rootElement)
} else {
  render(<Application appId={appId} />, rootElement)
}
unregister()
