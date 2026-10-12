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

describe('checkOauthNonce cookie parsing', () => {
  const NONCE = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
  const OTHER = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
  let rawCookie: string

  beforeEach(() => {
    rawCookie = ''
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: () => rawCookie,
      set: () => {
        throw new Error('checkOauthNonce must not write cookies')
      },
    })
  })

  afterEach(() => {
    delete (document as any).cookie
  })

  it.each(fixture.checkExamples.map((example: any) => [example.cookie, example.stateNonce, example.result]))(
    'a single cookie %j with state nonce %j is %j',
    (cookie: string | null, stateNonce: string | null, result: string) => {
      rawCookie = cookie === null ? 'other=1' : `other=1; ${fixture.cookie.name}=${cookie}; last=2`
      expect(checkOauthNonce(stateNonce)).toBe(result)
    },
  )

  it('treats two cookies with the exact name as no cookie', () => {
    rawCookie = `${fixture.cookie.name}=${NONCE}; ${fixture.cookie.name}=${OTHER}`
    expect(checkOauthNonce(NONCE)).toBe('no_cookie')
    expect(checkOauthNonce(OTHER)).toBe('no_cookie')
  })

  it('treats a duplicate as no cookie even when both values are equal', () => {
    rawCookie = `${fixture.cookie.name}=${NONCE}; ${fixture.cookie.name}=${NONCE}`
    expect(checkOauthNonce(NONCE)).toBe('no_cookie')
  })

  it('does not decode cookie names', () => {
    rawCookie = `__%48ost-oauth_state_nonce=${NONCE}`
    expect(checkOauthNonce(NONCE)).toBe('no_cookie')
    rawCookie = `__%48ost-oauth_state_nonce=${NONCE}; ${fixture.cookie.name}=${OTHER}`
    expect(checkOauthNonce(NONCE)).toBe('mismatch')
    expect(checkOauthNonce(OTHER)).toBe('match')
  })

  it('ignores names that only contain or differ in case from the cookie name', () => {
    rawCookie = `x${fixture.cookie.name}=${NONCE}; __host-oauth_state_nonce=${NONCE}; ${fixture.cookie.name}x=${NONCE}`
    expect(checkOauthNonce(NONCE)).toBe('no_cookie')
  })

  it('splits at the first = only', () => {
    rawCookie = `${fixture.cookie.name}=${OTHER}=${NONCE}`
    expect(checkOauthNonce(NONCE)).toBe('no_cookie')
    rawCookie = `${fixture.cookie.name}=${NONCE}.${OTHER}`
    expect(checkOauthNonce(OTHER)).toBe('match')
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

describe('nonce writer raw cookie boundary (real js-cookie)', () => {
  const originalLocation = window.location
  const ATTACKER = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
  const VALID = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
  const ALIAS = '__%48ost-oauth_state_nonce'
  let rawCookie: string
  let writes: string[]

  beforeEach(() => {
    rawCookie = ''
    writes = []
    // Expose a raw cookie list and capture the actual js-cookie setter output.
    // This tests application parsing, not browser enforcement of the __Host- prefix.
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: () => rawCookie,
      set: (value: string) => writes.push(value),
    })
    delete (window as any).location
    ;(window as any).location = { ...originalLocation, protocol: 'https:' }
  })

  afterEach(() => {
    delete (document as any).cookie
    delete (window as any).location
    ;(window as any).location = originalLocation
  })

  const writtenValue = () => {
    expect(writes).toHaveLength(1)
    const pair = writes[0].split('; ')[0]
    expect(pair.split('=')[0]).toBe(OAUTH_STATE_NONCE_COOKIE)
    return pair.slice(pair.indexOf('=') + 1)
  }
  const pageNonce = () => decodeOauthState(createOauthState({}))?.nonce as string

  it.each([
    ['alias alone', `${ALIAS}=${ATTACKER}`, undefined],
    ['alias before the literal name', `${ALIAS}=${ATTACKER}; ${OAUTH_STATE_NONCE_COOKIE}=${VALID}`, VALID],
    ['alias after the literal name', `${OAUTH_STATE_NONCE_COOKIE}=${VALID}; ${ALIAS}=${ATTACKER}`, VALID],
  ])('does not import an encoded name: %s', (_: string, cookies: string, valid: string | undefined) => {
    rawCookie = cookies
    expect(checkOauthNonce(ATTACKER)).toBe(valid ? 'mismatch' : 'no_cookie')
    rememberOauthNonce()
    // Observe the callback after the real writer's output becomes the literal cookie.
    rawCookie = `${writes[0].split('; ')[0]}; ${ALIAS}=${ATTACKER}`
    expect(checkOauthNonce(ATTACKER)).toBe('mismatch')
    expect(checkOauthNonce(pageNonce())).toBe('match')
    expect(writtenValue()).toBe(valid ? `${pageNonce()}.${valid}` : pageNonce())
    if (valid) {
      expect(checkOauthNonce(valid)).toBe('match')
    }
  })

  it.each([
    `${OAUTH_STATE_NONCE_COOKIE}=${ATTACKER}; ${OAUTH_STATE_NONCE_COOKIE}=${VALID}`,
    `${OAUTH_STATE_NONCE_COOKIE}=${VALID}; ${OAUTH_STATE_NONCE_COOKIE}=${ATTACKER}`,
    `${OAUTH_STATE_NONCE_COOKIE}=${ATTACKER}; ${OAUTH_STATE_NONCE_COOKIE}=${ATTACKER}`,
  ])('does not import duplicate literal names: %s', (cookies: string) => {
    rawCookie = cookies
    expect(checkOauthNonce(ATTACKER)).toBe('no_cookie')
    expect(checkOauthNonce(VALID)).toBe('no_cookie')
    rememberOauthNonce()
    expect(writtenValue()).toBe(pageNonce())
  })

  it('preserves quoted and percent-encoded value decoding for a single literal name', () => {
    rawCookie = `${OAUTH_STATE_NONCE_COOKIE}="%62${VALID.slice(1)}%2E${ATTACKER}"`
    expect(checkOauthNonce(VALID)).toBe('match')
    rememberOauthNonce()
    expect(writtenValue()).toBe(`${pageNonce()}.${VALID}.${ATTACKER}`)
  })

  it('preserves the five-entry cap and deduplication across pending tab nonces', () => {
    const pending = ['1', '2', '3', '4', '5', '6'].map(value => value.repeat(32))
    rawCookie = `${OAUTH_STATE_NONCE_COOKIE}=${pending.join('.')}`
    rememberOauthNonce()
    expect(writtenValue()).toBe([pageNonce(), ...pending.slice(0, 4)].join('.'))
    rawCookie = writes[0].split('; ')[0]
    writes = []
    rememberOauthNonce()
    expect(writtenValue()).toBe([pageNonce(), ...pending.slice(0, 4)].join('.'))
    rawCookie = writes[0].split('; ')[0]
    pending.slice(0, 4).forEach(nonce => expect(checkOauthNonce(nonce)).toBe('match'))
    expect(checkOauthNonce(pending[4])).toBe('mismatch')
  })
})
