import axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import OAuth2Page from './OAuth2Page'

jest.mock('axios')
const mockSocialLogin = jest.fn()
const mockRoute: { provider?: string; query: Record<string, string | undefined> } = { query: {} }
jest.mock('lodestar-app-element/src/contexts/AppContext', () => ({
  useApp: () => ({ id: 'app-id', settings: { 'auth.line_client_id': 'line-client' } }),
}))
jest.mock('lodestar-app-element/src/contexts/AuthContext', () => ({
  useAuth: () => ({ isAuthenticating: false, currentMemberId: null, socialLogin: mockSocialLogin }),
}))
jest.mock('lodestar-app-element/src/helpers/error', () => ({
  BackendServerError: class BackendServerError extends Error {},
  BindDeviceError: class BindDeviceError extends Error {},
  LoginDeviceError: class LoginDeviceError extends Error {},
}))
jest.mock('react-intl', () => ({ useIntl: () => ({ formatMessage: () => '' }) }))
jest.mock('react-router-dom', () => ({
  useHistory: () => ({}),
  useParams: () => ({ provider: mockRoute.provider }),
}))
jest.mock('use-query-params', () => ({
  StringParam: {},
  useQueryParam: (name: string) => [mockRoute.query[name]],
}))
jest.mock('antd', () => ({ message: { error: jest.fn() } }))
jest.mock('../components/auth/login/OverBindDeviceModal', () => () => null)
jest.mock('../components/auth/login/OverLoginDeviceModal', () => () => null)
jest.mock('../helpers', () => ({ handleError: jest.fn() }))
jest.mock('../helpers/translation', () => ({ codeMessages: {} }))
jest.mock('../pages/LoadingPage', () => () => null)

const mockedAxios = axios as jest.Mocked<typeof axios>
const COOKIE_NAME = '__Host-oauth_state_nonce'
const NONCE = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
const flush = () => act(() => new Promise<void>(resolve => setTimeout(resolve, 0)))
const telemetryCalls = () =>
  mockedAxios.post.mock.calls.filter(([url]) => String(url).endsWith('/auth/oauth-callback-check'))

describe('OAuth2Page callback check telemetry', () => {
  const originalLocation = window.location
  let cookieValue: string | null
  let cookieWrites: number
  let root: HTMLDivElement

  beforeEach(() => {
    mockedAxios.post.mockReset()
    mockSocialLogin.mockReset().mockResolvedValue(undefined)
    cookieValue = null
    cookieWrites = 0
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: () => (cookieValue === null ? '' : `${COOKIE_NAME}=${cookieValue}`),
      set: () => {
        cookieWrites += 1
      },
    })
    delete (window as any).location
    ;(window as any).location = {
      ...originalLocation,
      protocol: 'https:',
      host: 'example.test',
      origin: 'https://example.test',
      hash: '',
      href: 'https://example.test/oauth2',
    }
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

  const renderPage = () => {
    act(() => {
      ReactDOM.render(<OAuth2Page />, root)
    })
  }

  it('reports match once for an implicit-flow login and logs in normally', async () => {
    mockRoute.provider = undefined
    mockRoute.query = { state: btoa(JSON.stringify({ provider: 'google', redirect: '/programs/x', nonce: NONCE })) }
    window.location.hash = '#access_token=google-token'
    cookieValue = `bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.${NONCE}`
    mockedAxios.post.mockResolvedValue({ status: 204 })

    renderPage()
    renderPage()
    await flush()

    expect(telemetryCalls()).toHaveLength(1)
    expect(telemetryCalls()[0][1]).toEqual({ provider: 'google', result: 'match' })
    expect(telemetryCalls()[0][2]).toEqual({ withCredentials: true })
    expect(mockSocialLogin).toHaveBeenCalledWith({ provider: 'google', providerToken: 'google-token' })
    expect(window.location.href).toBe('/programs/x')
    expect(cookieWrites).toBe(0)
  })

  it.each([
    ['mismatch', 'cccccccccccccccccccccccccccccccc', { nonce: NONCE }],
    ['no_cookie', null, { nonce: NONCE }],
    ['no_state_nonce', NONCE, {}],
  ])('reports %s and still logs in when the telemetry call fails', async (result, cookie, extra) => {
    mockRoute.provider = undefined
    mockRoute.query = { state: btoa(JSON.stringify({ provider: 'facebook', redirect: '/p', ...extra })) }
    window.location.hash = '#access_token=fb-token'
    cookieValue = cookie
    mockedAxios.post.mockRejectedValue(new Error('network down'))

    renderPage()
    await flush()

    expect(telemetryCalls()).toHaveLength(1)
    expect(telemetryCalls()[0][1]).toEqual({ provider: 'facebook', result })
    expect(mockSocialLogin).toHaveBeenCalledWith({ provider: 'facebook', providerToken: 'fb-token' })
    expect(window.location.href).toBe('/p')
  })

  it('still exchanges a LINE code when the telemetry call throws synchronously', async () => {
    mockRoute.provider = undefined
    mockRoute.query = {
      code: 'line-code',
      state: btoa(JSON.stringify({ provider: 'line', redirect: '/l', nonce: NONCE })),
    }
    cookieValue = NONCE
    mockedAxios.post.mockImplementation(((url: string) => {
      if (url.endsWith('/auth/oauth-callback-check')) {
        throw new Error('boom')
      }
      return Promise.resolve({ data: { code: 'SUCCESS', result: { token: 'line-id-token' } } })
    }) as any)

    renderPage()
    await flush()

    expect(telemetryCalls()).toHaveLength(1)
    expect(telemetryCalls()[0][1]).toEqual({ provider: 'line', result: 'match' })
    expect(mockSocialLogin).toHaveBeenCalledWith({
      provider: 'line',
      providerToken: 'line-id-token',
      accountLinkToken: '',
    })
    expect(window.location.href).toBe('/l')
  })

  it('reports for the backend-exchanged providers using the route provider', async () => {
    mockRoute.provider = 'parenting'
    mockRoute.query = { code: 'p-code', state: btoa(JSON.stringify({ provider: 'parenting', redirect: '/pp' })) }
    cookieValue = NONCE
    mockedAxios.post.mockImplementation(((url: string) =>
      url.endsWith('/auth/oauth-callback-check')
        ? Promise.reject(new Error('rate limited'))
        : Promise.resolve({ data: { code: 'SUCCESS', result: { token: 'p-token' } } })) as any)

    renderPage()
    await flush()

    expect(telemetryCalls()).toHaveLength(1)
    expect(telemetryCalls()[0][1]).toEqual({ provider: 'parenting', result: 'no_state_nonce' })
    expect(mockSocialLogin).toHaveBeenCalledWith({
      provider: 'parenting',
      providerToken: 'p-token',
      accountLinkToken: '',
    })
    expect(window.location.href).toBe('/pp')
  })

  it('does not report when the state carries no known provider', async () => {
    mockRoute.provider = undefined
    mockRoute.query = { state: 'not-a-state' }
    mockedAxios.post.mockResolvedValue({})

    renderPage()
    await flush()

    expect(telemetryCalls()).toHaveLength(0)
  })
})
