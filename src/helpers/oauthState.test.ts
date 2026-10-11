import { TextDecoder as NodeTextDecoder, TextEncoder as NodeTextEncoder } from 'util'
import * as nodeCrypto from 'crypto'

// jsdom (jest 26) does not provide TextEncoder/TextDecoder or window.crypto
const globalObject = global as any
if (typeof globalObject.TextEncoder === 'undefined') {
  globalObject.TextEncoder = NodeTextEncoder
}
if (typeof globalObject.TextDecoder === 'undefined') {
  globalObject.TextDecoder = NodeTextDecoder
}
// a controllable stand-in so the "crypto unavailable" path can be exercised
const cryptoStub: { getRandomValues?: (array: Uint8Array) => Uint8Array } = {
  getRandomValues: array => (nodeCrypto as any).webcrypto.getRandomValues(array),
}
Object.defineProperty(window, 'crypto', { configurable: true, value: cryptoStub })

type OauthStateModule = typeof import('./oauthState')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createOauthState, decodeOauthState, encodeOauthState, normalizeRedirect, rememberOauthNonce } =
  require('./oauthState') as OauthStateModule

describe('normalizeRedirect', () => {
  it('keeps relative paths with search and hash', () => {
    expect(normalizeRedirect('/programs/x?a=1#b')).toBe('/programs/x?a=1#b')
  })

  it('keeps same-origin absolute URLs as a path', () => {
    expect(normalizeRedirect(`${window.location.origin}/p?q=1`)).toBe('/p?q=1')
  })

  it.each([
    'javascript:alert(1)',
    'JaVaScRiPt:x',
    ' javascript:x',
    'data:text/html,x',
    '//evil.com',
    '/\\evil.com',
    '/\t/evil.com',
    'https://evil.com/',
    `${window.location.origin}//evil.com`,
  ])('rejects %p', (value: string) => {
    expect(normalizeRedirect(value)).toBe('/')
  })

  it.each([undefined, null, 1, {}, ['/a']])('rejects non-string %p', (value: unknown) => {
    expect(normalizeRedirect(value)).toBe('/')
  })
})

describe('decodeOauthState', () => {
  it('decodes a legacy btoa(JSON.stringify(...)) state', () => {
    const state = { provider: 'google', redirect: '/programs/x?utm_source=a', accountLinkToken: '' }
    expect(decodeOauthState(btoa(JSON.stringify(state)))).toEqual(state)
  })

  it('decodes a URI-encoded state', () => {
    const state = { provider: 'facebook', redirect: '/p?a=1&b=2' }
    expect(decodeOauthState(encodeURIComponent(btoa(JSON.stringify(state))))).toEqual(state)
  })

  it('round-trips UTF-8 content with encodeOauthState', () => {
    const state = { provider: 'line', redirect: '/課程/中文?標籤=測試', accountLinkToken: '' }
    const encoded = encodeOauthState(state)
    expect(decodeOauthState(encoded)).toEqual(state)
    expect(normalizeRedirect(decodeOauthState(encoded)?.redirect)).toBe(
      '/%E8%AA%B2%E7%A8%8B/%E4%B8%AD%E6%96%87?%E6%A8%99%E7%B1%A4=%E6%B8%AC%E8%A9%A6',
    )
  })

  it('encodes ASCII content exactly like btoa(JSON.stringify(...))', () => {
    const state = { provider: 'google', redirect: '/p?q=1', accountLinkToken: 'abc' }
    expect(encodeOauthState(state)).toBe(btoa(JSON.stringify(state)))
  })

  it('decodes an admin-style state', () => {
    const state = { provider: 'google', redirect: '/admin/x', accountLinkToken: 'token' }
    expect(decodeOauthState(btoa(JSON.stringify(state)))).toEqual(state)
  })

  it.each([
    ['invalid base64', '%%%not-base64%%%'],
    ['non-JSON', btoa('not json')],
    ['an array', btoa(JSON.stringify(['/a']))],
    ['a number', btoa('1')],
    ['null JSON', btoa('null')],
    ['a non-string', 123],
    ['undefined', undefined],
  ])('returns null for %s', (_: string, raw: unknown) => {
    expect(decodeOauthState(raw)).toBeNull()
  })
})

describe('createOauthState', () => {
  it('adds a 32-hex nonce that stays the same within the page load', () => {
    const first = decodeOauthState(createOauthState({ provider: 'google', redirect: '/a' }))
    const second = decodeOauthState(createOauthState({ provider: 'line', redirect: '/b' }))
    expect(first?.nonce).toMatch(/^[0-9a-f]{32}$/)
    expect(second?.nonce).toBe(first?.nonce)
    expect(first).toMatchObject({ provider: 'google', redirect: '/a' })
  })
})

describe('rememberOauthNonce', () => {
  const originalLocation = window.location
  let writes: string[]

  beforeEach(() => {
    writes = []
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: () => '',
      set: (value: string) => {
        writes.push(value)
      },
    })
  })

  afterEach(() => {
    delete (document as any).cookie
    delete (window as any).location
    ;(window as any).location = originalLocation
  })

  const setProtocol = (protocol: string) => {
    delete (window as any).location
    ;(window as any).location = { ...originalLocation, protocol, origin: `${protocol}//example.test` }
  }

  it('writes a host-only __Host- cookie on https', () => {
    setProtocol('https:')
    rememberOauthNonce()
    expect(writes).toHaveLength(1)
    const nonce = decodeOauthState(createOauthState({}))?.nonce
    const parts = writes[0].split('; ')
    expect(parts[0]).toBe(`__Host-oauth_state_nonce=${nonce}`)
    const attributes = parts.slice(1).map(part => part.toLowerCase())
    expect(attributes).toContain('path=/')
    expect(attributes).toContain('secure')
    expect(attributes).toContain('samesite=lax')
    expect(attributes.some(attribute => attribute.startsWith('expires='))).toBe(true)
    expect(attributes.some(attribute => attribute.startsWith('domain'))).toBe(false)
    const expires = Date.parse(parts.find(part => part.toLowerCase().startsWith('expires='))!.split('=')[1])
    expect(expires - Date.now()).toBeGreaterThan(9 * 60 * 1000)
    expect(expires - Date.now()).toBeLessThanOrEqual(10 * 60 * 1000)
  })

  it('does not write the cookie on http', () => {
    setProtocol('http:')
    rememberOauthNonce()
    expect(writes).toHaveLength(0)
  })
})

describe('without crypto.getRandomValues', () => {
  it('returns the payload unchanged', () => {
    const getRandomValues = cryptoStub.getRandomValues
    cryptoStub.getRandomValues = undefined
    try {
      jest.resetModules()
      const fresh = require('./oauthState') as OauthStateModule
      expect(fresh.createOauthState).not.toBe(createOauthState)
      const payload = { provider: 'google', redirect: '/a', accountLinkToken: '' }
      expect(fresh.createOauthState(payload)).toBe(btoa(JSON.stringify(payload)))
    } finally {
      cryptoStub.getRandomValues = getRandomValues
    }
  })
})
