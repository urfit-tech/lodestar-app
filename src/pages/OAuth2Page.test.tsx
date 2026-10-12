import { message } from 'antd'
import axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import OAuth2Page from './OAuth2Page'

jest.mock('axios')
const mockSocialLogin = jest.fn()
const mockRoute: { provider?: string; query: Record<string, string | undefined> } = { query: {} }
const mockHistory = {}
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
jest.mock('react-intl', () => ({ useIntl: () => ({ formatMessage: (descriptor: { id?: string }) => descriptor?.id }) }))
jest.mock('react-router-dom', () => ({
  useHistory: () => mockHistory,
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
jest.mock('../helpers/translation', () => ({
  codeMessages: { E_OAUTH_STATE: { id: 'code.E_OAUTH_STATE', defaultMessage: '登入驗證已失效，請重新登入' } },
}))
jest.mock('../pages/LoadingPage', () => () => null)

const mockedAxios = axios as jest.Mocked<typeof axios>
const mockedMessageError = message.error as jest.Mock
const COOKIE_NAME = '__Host-oauth_state_nonce'
const NONCE = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
const OTHER_NONCE = 'cccccccccccccccccccccccccccccccc'
const flush = () => act(() => new Promise<void>(resolve => setTimeout(resolve, 0)))
// works under fake timers: lets promise chains started by effects settle without advancing time
const flushMicrotasks = () =>
  act(async () => {
    for (let i = 0; i < 10; i++) {
      await Promise.resolve()
    }
  })
const postsTo = (path: string) => mockedAxios.post.mock.calls.filter(([url]) => String(url).endsWith(path))
const telemetryCalls = () => postsTo('/auth/oauth-callback-check')
const tokenCalls = () => postsTo('/auth/get-oauth-token')
const encodeState = (state: Record<string, unknown>) => btoa(JSON.stringify(state))

// cookie value / state nonce pairs for every non-match result
const REJECTED_CASES: [string, string | null, Record<string, unknown>][] = [
  ['mismatch', OTHER_NONCE, { nonce: NONCE }],
  ['no_cookie', null, { nonce: NONCE }],
  ['no_state_nonce', NONCE, {}],
]

describe('OAuth2Page state nonce enforcement', () => {
  const originalLocation = window.location
  let cookieValue: string | null
  let cookieWrites: number
  let events: string[]
  let root: HTMLDivElement
  let replaceStateSpy: jest.SpyInstance
  let locationReplace: jest.Mock

  beforeEach(() => {
    mockedAxios.post.mockReset()
    mockedAxios.post.mockImplementation(((url: string) =>
      url.endsWith('/auth/oauth-callback-check')
        ? Promise.resolve({ status: 204 })
        : Promise.resolve({ data: { code: 'SUCCESS', result: { token: 'exchanged-token' } } })) as any)
    mockSocialLogin.mockReset().mockResolvedValue(undefined)
    events = []
    mockedMessageError.mockReset().mockImplementation(() => {
      events.push('message.error')
    })
    replaceStateSpy = jest.spyOn(window.history, 'replaceState').mockImplementation(() => {
      events.push('replaceState')
    })
    locationReplace = jest.fn()
    mockRoute.provider = undefined
    mockRoute.query = {}
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
      pathname: '/oauth2',
      hash: '',
      href: 'https://example.test/oauth2',
      replace: locationReplace,
    }
    root = document.createElement('div')
    document.body.appendChild(root)
  })

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(root)
    root.remove()
    jest.useRealTimers()
    replaceStateSpy.mockRestore()
    delete (document as any).cookie
    delete (window as any).location
    ;(window as any).location = originalLocation
  })

  const renderPage = () => {
    act(() => {
      ReactDOM.render(<OAuth2Page />, root)
    })
  }

  const expectRejected = (target: string) => {
    expect(events).toEqual(['replaceState', 'message.error'])
    expect(replaceStateSpy).toHaveBeenCalledTimes(1)
    expect(replaceStateSpy).toHaveBeenCalledWith(null, '', window.location.pathname)
    expect(mockedMessageError).toHaveBeenCalledWith('code.E_OAUTH_STATE')
    expect(locationReplace).not.toHaveBeenCalled()
    act(() => {
      jest.advanceTimersByTime(1999)
    })
    expect(locationReplace).not.toHaveBeenCalled()
    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(locationReplace).toHaveBeenCalledTimes(1)
    expect(locationReplace).toHaveBeenCalledWith(target)
  }

  const expectNotRejected = () => {
    expect(replaceStateSpy).not.toHaveBeenCalled()
    expect(mockedMessageError).not.toHaveBeenCalled()
    expect(locationReplace).not.toHaveBeenCalled()
  }

  const setImplicitCallback = (provider: string, redirect: string, extra: Record<string, unknown>) => {
    mockRoute.query = { state: encodeState({ provider, redirect, ...extra }) }
    window.location.hash = `#access_token=${provider}-token`
  }

  describe('implicit flow (Google / Facebook)', () => {
    it('logs in once and reports match when the state nonce is in the cookie', async () => {
      setImplicitCallback('google', '/programs/x', { nonce: NONCE })
      cookieValue = `bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.${NONCE}`

      renderPage()
      renderPage()
      await flush()

      expect(telemetryCalls()).toHaveLength(1)
      expect(telemetryCalls()[0][1]).toEqual({ provider: 'google', result: 'match' })
      expect(telemetryCalls()[0][2]).toEqual({ withCredentials: true })
      expect(mockSocialLogin).toHaveBeenCalledTimes(1)
      expect(mockSocialLogin).toHaveBeenCalledWith({ provider: 'google', providerToken: 'google-token' })
      expect(window.location.href).toBe('/programs/x')
      expectNotRejected()
      expect(cookieWrites).toBe(0)
    })

    it.each(REJECTED_CASES)(
      'rejects %s: no login, address cleaned before the message, back to the redirect after 2 seconds',
      async (result, cookie, extra) => {
        jest.useFakeTimers()
        setImplicitCallback('google', '/x', extra)
        cookieValue = cookie

        renderPage()

        await flushMicrotasks()
        renderPage()
        await flushMicrotasks()

        expect(telemetryCalls()).toHaveLength(1)
        expect(telemetryCalls()[0][1]).toEqual({ provider: 'google', result })
        expect(mockSocialLogin).not.toHaveBeenCalled()
        expectRejected('/x')
        expect(mockSocialLogin).not.toHaveBeenCalled()
        expect(cookieWrites).toBe(0)
      },
    )

    it('rejects a Facebook callback without a matching nonce', async () => {
      jest.useFakeTimers()
      setImplicitCallback('facebook', '/p?a=1', { nonce: NONCE })
      cookieValue = OTHER_NONCE

      renderPage()

      await flushMicrotasks()

      expect(telemetryCalls()[0][1]).toEqual({ provider: 'facebook', result: 'mismatch' })
      expect(mockSocialLogin).not.toHaveBeenCalled()
      expectRejected('/p?a=1')
    })

    it.each(['/OAuth2/x', '/%6Fauth2', '/oauth2?code=1', '/%E0%A4%A'])(
      'sends a rejected callback to / instead of the redirect %s',
      async redirect => {
        jest.useFakeTimers()
        setImplicitCallback('google', redirect, { nonce: NONCE })
        cookieValue = OTHER_NONCE

        renderPage()

        await flushMicrotasks()

        expect(mockSocialLogin).not.toHaveBeenCalled()
        expectRejected('/')
      },
    )
  })

  describe('authorization code flow (LINE)', () => {
    const setLineCallback = (extra: Record<string, unknown>) => {
      mockRoute.query = { code: 'line-code', state: encodeState({ provider: 'line', redirect: '/l', ...extra }) }
    }

    it('exchanges the code once and logs in on match', async () => {
      setLineCallback({ nonce: NONCE })
      cookieValue = NONCE

      renderPage()
      await flush()

      expect(telemetryCalls()).toHaveLength(1)
      expect(telemetryCalls()[0][1]).toEqual({ provider: 'line', result: 'match' })
      expect(tokenCalls()).toHaveLength(1)
      expect(tokenCalls()[0][1]).toEqual({
        appId: 'app-id',
        provider: 'line',
        redirectUri: 'https://example.test/oauth2',
        code: 'line-code',
      })
      expect(mockSocialLogin).toHaveBeenCalledWith({
        provider: 'line',
        providerToken: 'exchanged-token',
        accountLinkToken: '',
      })
      expect(window.location.href).toBe('/l')
      expectNotRejected()
    })

    it.each(REJECTED_CASES)('does not exchange the code on %s', async (result, cookie, extra) => {
      jest.useFakeTimers()
      setLineCallback(extra)
      cookieValue = cookie

      renderPage()

      await flushMicrotasks()

      expect(telemetryCalls()).toHaveLength(1)
      expect(telemetryCalls()[0][1]).toEqual({ provider: 'line', result })
      expect(tokenCalls()).toHaveLength(0)
      expect(mockSocialLogin).not.toHaveBeenCalled()
      expectRejected('/l')
      expect(tokenCalls()).toHaveLength(0)
    })
  })

  describe('backend-exchanged providers (Oauth2Section)', () => {
    beforeEach(() => {
      window.location.pathname = '/oauth2/commonhealth'
    })

    it('exchanges the code on match', async () => {
      mockRoute.provider = 'commonhealth'
      mockRoute.query = {
        code: 'c-code',
        state: encodeState({ provider: 'commonhealth', redirect: '/c', nonce: NONCE }),
      }
      cookieValue = NONCE

      renderPage()
      await flush()

      expect(telemetryCalls()).toHaveLength(1)
      expect(telemetryCalls()[0][1]).toEqual({ provider: 'commonhealth', result: 'match' })
      expect(tokenCalls()).toHaveLength(1)
      expect(tokenCalls()[0][1]).toMatchObject({ provider: 'commonhealth', code: 'c-code' })
      expect(mockSocialLogin).toHaveBeenCalledWith({
        provider: 'commonhealth',
        providerToken: 'exchanged-token',
        accountLinkToken: '',
      })
      expect(window.location.href).toBe('/c')
      expectNotRejected()
    })

    it.each(REJECTED_CASES)('does not exchange the commonhealth code on %s', async (result, cookie, extra) => {
      jest.useFakeTimers()
      mockRoute.provider = 'commonhealth'
      mockRoute.query = { code: 'c-code', state: encodeState({ provider: 'commonhealth', redirect: '/c', ...extra }) }
      cookieValue = cookie

      renderPage()

      await flushMicrotasks()

      expect(telemetryCalls()).toHaveLength(1)
      expect(telemetryCalls()[0][1]).toEqual({ provider: 'commonhealth', result })
      expect(tokenCalls()).toHaveLength(0)
      expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '/oauth2/commonhealth')
      expectRejected('/c')
      expect(tokenCalls()).toHaveLength(0)
      expect(mockSocialLogin).not.toHaveBeenCalled()
    })

    it('rejects a partner-initiated callback without our state', async () => {
      jest.useFakeTimers()
      mockRoute.provider = 'parenting'
      mockRoute.query = { code: 'p-code' }
      cookieValue = NONCE

      renderPage()

      await flushMicrotasks()

      expect(telemetryCalls()[0][1]).toEqual({ provider: 'parenting', result: 'no_state_nonce' })
      expect(tokenCalls()).toHaveLength(0)
      expectRejected('/')
    })
  })

  describe('per mount behaviour', () => {
    it('logs in again after a real unmount and a fresh mount of the same URL', async () => {
      setImplicitCallback('google', '/again', { nonce: NONCE })
      cookieValue = NONCE

      renderPage()
      await flush()
      expect(mockSocialLogin).toHaveBeenCalledTimes(1)
      expect(telemetryCalls()).toHaveLength(1)

      act(() => {
        ReactDOM.unmountComponentAtNode(root)
      })
      renderPage()
      await flush()

      expect(mockSocialLogin).toHaveBeenCalledTimes(2)
      expect(telemetryCalls()).toHaveLength(2)
      expect(telemetryCalls().map(([, body]) => body)).toEqual([
        { provider: 'google', result: 'match' },
        { provider: 'google', result: 'match' },
      ])
      expectNotRejected()
    })

    it('does not leave the page when unmounted before the rejection redirect', async () => {
      jest.useFakeTimers()
      setImplicitCallback('google', '/x', { nonce: NONCE })
      cookieValue = OTHER_NONCE

      renderPage()

      await flushMicrotasks()
      expect(replaceStateSpy).toHaveBeenCalledTimes(1)
      act(() => {
        ReactDOM.unmountComponentAtNode(root)
      })
      act(() => {
        jest.advanceTimersByTime(5000)
      })

      expect(locationReplace).not.toHaveBeenCalled()
    })

    it('logs in on match when the state only arrives on the second render', async () => {
      cookieValue = NONCE
      mockRoute.query = {}

      renderPage()
      await flush()
      expect(telemetryCalls()).toHaveLength(0)
      expect(mockSocialLogin).not.toHaveBeenCalled()
      expectNotRejected()

      setImplicitCallback('google', '/late', { nonce: NONCE })
      renderPage()
      await flush()

      expect(telemetryCalls()).toHaveLength(1)
      expect(telemetryCalls()[0][1]).toEqual({ provider: 'google', result: 'match' })
      expect(mockSocialLogin).toHaveBeenCalledTimes(1)
      expect(window.location.href).toBe('/late')
      expectNotRejected()
    })

    it('still rejects a mismatch when the state only arrives on the second render', async () => {
      jest.useFakeTimers()
      cookieValue = OTHER_NONCE
      mockRoute.query = {}

      renderPage()

      await flushMicrotasks()
      expect(telemetryCalls()).toHaveLength(0)
      expectNotRejected()

      setImplicitCallback('google', '/late', { nonce: NONCE })
      renderPage()
      await flushMicrotasks()

      expect(telemetryCalls()).toHaveLength(1)
      expect(telemetryCalls()[0][1]).toEqual({ provider: 'google', result: 'mismatch' })
      expect(mockSocialLogin).not.toHaveBeenCalled()
      expectRejected('/late')
    })

    it('waits for the query of a backend-exchanged provider before judging the nonce', async () => {
      window.location.pathname = '/oauth2/commonhealth'
      mockRoute.provider = 'commonhealth'
      mockRoute.query = {}
      cookieValue = NONCE

      renderPage()
      await flush()
      expect(telemetryCalls()).toHaveLength(0)
      expectNotRejected()

      mockRoute.query = {
        code: 'c-code',
        state: encodeState({ provider: 'commonhealth', redirect: '/c', nonce: NONCE }),
      }
      renderPage()
      await flush()

      expect(telemetryCalls()).toHaveLength(1)
      expect(telemetryCalls()[0][1]).toEqual({ provider: 'commonhealth', result: 'match' })
      expect(tokenCalls()).toHaveLength(1)
      expectNotRejected()
    })
  })

  describe('telemetry', () => {
    it('still logs in on match when the telemetry call fails or throws synchronously', async () => {
      mockRoute.query = { code: 'line-code', state: encodeState({ provider: 'line', redirect: '/l', nonce: NONCE }) }
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
      expect(mockSocialLogin).toHaveBeenCalledWith({
        provider: 'line',
        providerToken: 'line-id-token',
        accountLinkToken: '',
      })
    })

    it('neither reports nor rejects when the state carries no known provider', async () => {
      mockRoute.query = { state: 'not-a-state' }

      renderPage()
      await flush()

      expect(telemetryCalls()).toHaveLength(0)
      expect(mockSocialLogin).not.toHaveBeenCalled()
      expectNotRejected()
    })
  })
})
