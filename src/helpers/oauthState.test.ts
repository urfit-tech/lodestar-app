import * as nodeCrypto from 'crypto'
import { TextDecoder as NodeTextDecoder, TextEncoder as NodeTextEncoder } from 'util'

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
const {
  appendOauthNonce,
  checkOauthNonce,
  compareOauthNonce,
  createOauthState,
  decodeOauthState,
  encodeOauthState,
  normalizeRedirect,
  OAUTH_STATE_NONCE_COOKIE,
  rememberOauthNonce,
} = require('./oauthState') as OauthStateModule
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fixture = require('./oauthNonce.fixture.json')

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

describe('nonce cookie contract (oauthNonce.fixture.json)', () => {
  it('uses the contract cookie name', () => {
    expect(OAUTH_STATE_NONCE_COOKIE).toBe(fixture.cookie.name)
  })

  it.each(fixture.appendExamples.map((example: any) => [example.before, example.add, example.after]))(
    'append(%j, %j) = %j',
    (before: string | null, add: string, after: string) => {
      const value = appendOauthNonce(before, add)
      expect(value).toBe(after)
      expect(value).toMatch(new RegExp(fixture.valueFormat))
    },
  )

  it('keeps at most maxEntries and never duplicates', () => {
    let value: string | null = null
    const nonces = Array.from({ length: 8 }, (_, i) => i.toString(16).repeat(32))
    nonces.forEach(nonce => {
      value = appendOauthNonce(value, nonce)
      value = appendOauthNonce(value, nonce)
    })
    expect(value!.split(fixture.separator)).toEqual(nonces.slice(-fixture.maxEntries).reverse())
  })

  it.each(fixture.checkExamples.map((example: any) => [example.cookie, example.stateNonce, example.result]))(
    'check(cookie=%j, stateNonce=%j) = %j',
    (cookie: string | null, stateNonce: string | null, result: string) => {
      expect(fixture.checkResults).toContain(result)
      expect(compareOauthNonce(cookie, stateNonce)).toBe(result)
    },
  )

  it.each([
    ['a missing state nonce and no cookie', null, undefined, 'no_state_nonce'],
    ['a malformed state nonce', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'zz', 'no_state_nonce'],
    ['an upper-case state nonce', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'A'.repeat(32), 'no_state_nonce'],
    ['a malformed state nonce and no cookie', null, 'zz', 'no_state_nonce'],
    ['a non-string state nonce', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 123, 'no_state_nonce'],
    ['a cookie with only malformed entries', 'not-hex.zz', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'no_cookie'],
    [
      'a malformed entry before a match',
      'not-hex.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      'match',
    ],
    [
      'a match beyond the first 5 well-formed entries',
      ['1', '2', '3', '4', '5', 'a'].map(c => c.repeat(32)).join('.'),
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      'mismatch',
    ],
  ])('check handles %s', (_: string, cookie: string | null, stateNonce: unknown, result: string) => {
    expect(compareOauthNonce(cookie, stateNonce)).toBe(result)
  })
})

describe('rememberOauthNonce / checkOauthNonce', () => {
  const originalLocation = window.location
  let writes: string[]
  let cookieValue: string | null

  beforeEach(() => {
    writes = []
    cookieValue = null
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: () => (cookieValue === null ? '' : `${fixture.cookie.name}=${cookieValue}`),
      set: (value: string) => {
        writes.push(value)
        const [pair] = value.split('; ')
        cookieValue = pair.slice(pair.indexOf('=') + 1)
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
  const pageNonce = () => decodeOauthState(createOauthState({}))?.nonce as string

  it('writes a host-only __Host- cookie on https with the contract attributes', () => {
    setProtocol('https:')
    rememberOauthNonce()
    expect(writes).toHaveLength(1)
    const parts = writes[0].split('; ')
    expect(parts[0]).toBe(`${fixture.cookie.name}=${pageNonce()}`)
    const attributes = parts.slice(1).map(part => part.toLowerCase())
    expect(attributes).toContain('path=/')
    expect(attributes).toContain('secure')
    expect(attributes).toContain('samesite=lax')
    expect(attributes.some(attribute => attribute.startsWith('domain'))).toBe(false)
    const expires = Date.parse(parts.find(part => part.toLowerCase().startsWith('expires='))!.split('=')[1])
    expect(expires - Date.now()).toBeGreaterThan(9 * 60 * 1000)
    expect(expires - Date.now()).toBeLessThanOrEqual(fixture.cookie.attributes.maxAgeSeconds * 1000)
  })

  it('prepends the page nonce to an existing list and refreshes it on every call', () => {
    setProtocol('https:')
    const other = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    cookieValue = `${other}.not-hex`
    rememberOauthNonce()
    rememberOauthNonce()
    expect(writes).toHaveLength(2)
    expect(cookieValue).toBe(`${pageNonce()}.${other}`)
  })

  it('does not write the cookie on http', () => {
    setProtocol('http:')
    rememberOauthNonce()
    expect(writes).toHaveLength(0)
  })

  it('checks the state nonce against the cookie without writing or deleting it', () => {
    cookieValue = `bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.${pageNonce()}`
    expect(checkOauthNonce(pageNonce())).toBe('match')
    expect(checkOauthNonce('cccccccccccccccccccccccccccccccc')).toBe('mismatch')
    expect(checkOauthNonce(undefined)).toBe('no_state_nonce')
    cookieValue = null
    expect(checkOauthNonce(pageNonce())).toBe('no_cookie')
    expect(checkOauthNonce(undefined)).toBe('no_state_nonce')
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
