import * as nodeCrypto from 'crypto'
import React from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { TextDecoder as NodeTextDecoder, TextEncoder as NodeTextEncoder } from 'util'
import { decodeOauthState } from '../../helpers/oauthState'
import { FacebookLoginButton, GoogleLoginButton, LineLoginButton, ParentingLoginButton } from './SocialLoginButton'

jest.mock('lodestar-app-element/src/contexts/AppContext', () => ({
  useApp: () => ({
    loading: false,
    settings: {
      'auth.facebook_app_id': 'fb-app',
      'auth.google_client_id': 'google-client',
      'auth.line_client_id': 'line-client',
      'auth.parenting.client_id': 'parenting-client',
    },
  }),
}))
jest.mock('react-intl', () => ({
  defineMessages: (messages: unknown) => messages,
  useIntl: () => ({ formatMessage: (message: { id?: string }) => message?.id || '' }),
}))
jest.mock('use-query-params', () => ({ StringParam: {}, useQueryParam: () => [undefined] }))
jest.mock('@chakra-ui/react', () => {
  const React = require('react')
  return {
    Button: ({ children }: { children: React.ReactNode }) => React.createElement('button', null, children),
    Icon: () => null,
    Spinner: () => null,
  }
})
jest.mock('../../helpers/translation', () => ({
  authMessages: { ui: { facebookLogin: {}, googleLogin: {}, lineLogin: {}, parentingLogin: {} } },
}))

const globalObject = global as any
if (typeof globalObject.TextEncoder === 'undefined') {
  globalObject.TextEncoder = NodeTextEncoder
}
if (typeof globalObject.TextDecoder === 'undefined') {
  globalObject.TextDecoder = NodeTextDecoder
}
Object.defineProperty(window, 'crypto', {
  configurable: true,
  value: { getRandomValues: (array: Uint8Array) => (nodeCrypto as any).webcrypto.getRandomValues(array) },
})

const COOKIE_NAME = '__Host-oauth_state_nonce'

describe('social login buttons', () => {
  const originalLocation = window.location
  let writes: string[]
  let cookieValue: string | null
  let root: HTMLDivElement

  beforeEach(() => {
    writes = []
    cookieValue = null
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: () => (cookieValue === null ? '' : `${COOKIE_NAME}=${cookieValue}`),
      set: (value: string) => {
        writes.push(value)
        const [pair] = value.split('; ')
        cookieValue = pair.slice(pair.indexOf('=') + 1)
      },
    })
    delete (window as any).location
    ;(window as any).location = { ...originalLocation, protocol: 'https:', origin: 'https://example.test' }
    root = document.createElement('div')
    document.body.appendChild(root)
  })

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(root)
    root.remove()
    delete (document as any).cookie
    delete (window as any).location
    ;(window as any).location = originalLocation
  })

  it.each([
    ['facebook', FacebookLoginButton],
    ['google', GoogleLoginButton],
    ['line', LineLoginButton],
    ['parenting', ParentingLoginButton],
  ])('%s: remembers the state nonce on mount and again on click', (provider: string, Component: React.FC) => {
    act(() => {
      ReactDOM.render(<Component />, root)
    })
    const link = root.querySelector('a')!
    const state = decodeOauthState(new URL(link.getAttribute('href')!).searchParams.get('state'))
    expect(state?.provider).toBe(provider)
    expect(state?.nonce).toMatch(/^[0-9a-f]{32}$/)
    // mount-time write: the cookie list already holds the nonce carried in the link
    expect(writes).toHaveLength(1)
    expect(cookieValue!.split('.')).toContain(state?.nonce)

    let notPrevented = false
    act(() => {
      notPrevented = link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })
    // native <a href> navigation is kept
    expect(notPrevented).toBe(true)
    expect(writes).toHaveLength(2)
    expect(cookieValue).toBe(state?.nonce)
  })
})
