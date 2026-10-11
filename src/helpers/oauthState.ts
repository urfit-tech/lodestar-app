import Cookies from 'js-cookie'

// OAuth state helpers shared by the social login buttons and the /oauth2 callback page.
// Each page puts its nonce in the state and appends it to the __Host- cookie list
// (see oauthNonce.fixture.json). The callback page only reports the comparison; nothing is rejected.

export const OAUTH_STATE_NONCE_COOKIE = '__Host-oauth_state_nonce'
const OAUTH_STATE_NONCE_TTL_MS = 10 * 60 * 1000
const OAUTH_STATE_NONCE_MAX_ENTRIES = 5
const OAUTH_STATE_NONCE_SEPARATOR = '.'
const OAUTH_STATE_NONCE_PATTERN = /^[0-9a-f]{32}$/

export type OauthNonceCheckResult = 'match' | 'mismatch' | 'no_state_nonce' | 'no_cookie'

// eslint-disable-next-line no-control-regex
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/

/**
 * Returns a same-origin path (pathname + search + hash) for the given redirect target, or '/'.
 * Relative paths and same-origin absolute URLs are kept; other origins, javascript:, data:,
 * protocol-relative URLs and anything containing control characters become '/'.
 */
export const normalizeRedirect = (value: unknown): string => {
  if (typeof value !== 'string' || CONTROL_CHARACTERS.test(value)) {
    return '/'
  }
  let url: URL
  try {
    url = new URL(value, window.location.origin)
  } catch {
    return '/'
  }
  if (url.origin !== window.location.origin) {
    return '/'
  }
  const redirect = url.pathname + url.search + url.hash
  if (redirect[0] !== '/' || redirect[1] === '/' || redirect[1] === '\\') {
    return '/'
  }
  return redirect
}

const bytesToBinaryString = (bytes: Uint8Array): string => {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return binary
}

const binaryStringToBytes = (binary: string): Uint8Array => {
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

/** base64 of the UTF-8 bytes of JSON.stringify(obj); equals btoa(JSON.stringify(obj)) for ASCII content. */
export const encodeOauthState = (obj: Record<string, unknown>): string =>
  btoa(bytesToBinaryString(new TextEncoder().encode(JSON.stringify(obj))))

/** Decodes a state produced by encodeOauthState or by the legacy btoa(JSON.stringify(...)); null when invalid. */
export const decodeOauthState = (raw: unknown): Record<string, unknown> | null => {
  if (typeof raw !== 'string') {
    return null
  }
  let value = raw
  try {
    value = decodeURIComponent(raw)
  } catch {
    value = raw
  }
  let binary: string
  try {
    binary = atob(value)
  } catch {
    return null
  }
  let json = binary
  try {
    json = new TextDecoder('utf-8', { fatal: true }).decode(binaryStringToBytes(binary))
  } catch {
    json = binary
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    return null
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return null
  }
  return parsed as Record<string, unknown>
}

let pageNonce: string | null | undefined

const getPageNonce = (): string | null => {
  if (pageNonce !== undefined) {
    return pageNonce
  }
  try {
    const cryptoObject = typeof window !== 'undefined' ? window.crypto : undefined
    if (!cryptoObject || typeof cryptoObject.getRandomValues !== 'function') {
      pageNonce = null
      return pageNonce
    }
    const bytes = new Uint8Array(16)
    cryptoObject.getRandomValues(bytes)
    let hex = ''
    for (let i = 0; i < bytes.length; i++) {
      hex += (bytes[i] < 16 ? '0' : '') + bytes[i].toString(16)
    }
    pageNonce = hex
  } catch {
    pageNonce = null
  }
  return pageNonce
}

/** Encodes the OAuth state payload with this page's nonce attached (payload unchanged when crypto is unavailable). */
export const createOauthState = (payload: Record<string, unknown>): string => {
  const nonce = getPageNonce()
  return encodeOauthState(nonce ? { ...payload, nonce } : payload)
}

const parseOauthNonceList = (value: unknown): string[] => {
  if (typeof value !== 'string' || !value) {
    return []
  }
  const nonces: string[] = []
  value.split(OAUTH_STATE_NONCE_SEPARATOR).forEach(entry => {
    if (OAUTH_STATE_NONCE_PATTERN.test(entry) && !nonces.includes(entry)) {
      nonces.push(entry)
    }
  })
  return nonces
}

/** Cookie value after adding `nonce`: newest first, no duplicates, malformed entries dropped, at most 5 entries. */
export const appendOauthNonce = (current: string | null | undefined, nonce: string): string =>
  [nonce, ...parseOauthNonceList(current).filter(entry => entry !== nonce)]
    .slice(0, OAUTH_STATE_NONCE_MAX_ENTRIES)
    .join(OAUTH_STATE_NONCE_SEPARATOR)

/**
 * Compares the nonce carried in the OAuth state with a cookie value; pure, used by checkOauthNonce.
 * Same precedence as the backend /oauth2/:provider check: a missing or malformed state nonce is
 * 'no_state_nonce' (even without a cookie), then a cookie without well-formed entries is 'no_cookie',
 * otherwise the state nonce is looked up in the first 5 well-formed entries.
 */
export const compareOauthNonce = (
  cookieValue: string | null | undefined,
  stateNonce: unknown,
): OauthNonceCheckResult => {
  if (typeof stateNonce !== 'string' || !OAUTH_STATE_NONCE_PATTERN.test(stateNonce)) {
    return 'no_state_nonce'
  }
  const nonces =
    typeof cookieValue === 'string'
      ? cookieValue
          .split(OAUTH_STATE_NONCE_SEPARATOR)
          .filter(entry => OAUTH_STATE_NONCE_PATTERN.test(entry))
          .slice(0, OAUTH_STATE_NONCE_MAX_ENTRIES)
      : []
  if (nonces.length === 0) {
    return 'no_cookie'
  }
  return nonces.includes(stateNonce) ? 'match' : 'mismatch'
}

/** Appends this page's nonce to the host-only __Host- cookie list (https only) and refreshes its 10-minute lifetime. */
export const rememberOauthNonce = (): void => {
  try {
    const nonce = getPageNonce()
    if (!nonce || window.location.protocol !== 'https:') {
      return
    }
    Cookies.set(OAUTH_STATE_NONCE_COOKIE, appendOauthNonce(Cookies.get(OAUTH_STATE_NONCE_COOKIE), nonce), {
      path: '/',
      secure: true,
      sameSite: 'lax',
      expires: new Date(Date.now() + OAUTH_STATE_NONCE_TTL_MS),
    })
  } catch {
    // the login link must keep working even if the cookie cannot be written
  }
}

/** Read-only check of the state nonce against the cookie list; never modifies or deletes the cookie. */
export const checkOauthNonce = (stateNonce: unknown): OauthNonceCheckResult => {
  let cookieValue: string | undefined
  try {
    cookieValue = Cookies.get(OAUTH_STATE_NONCE_COOKIE)
  } catch {
    cookieValue = undefined
  }
  return compareOauthNonce(cookieValue, stateNonce)
}
