// organize-imports-ignore
import './dayjsSetup'
import React from 'react'
import { render } from 'react-dom'
import App from './Application'
import { unregister } from './serviceWorker'

const appId = import.meta.env.VITE_ID || (window as any).APP_ID
const rootElement = document.getElementById('root')

if (!appId) {
  render(<div>Application cannot be loaded.</div>, rootElement)
} else {
  render(<App appId={appId} />, rootElement)
}
unregister()
