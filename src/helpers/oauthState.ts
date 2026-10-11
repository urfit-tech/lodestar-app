import Cookies from 'js-cookie'

// OAuth state helpers shared by the social login buttons and the /oauth2 callback page.
// The nonce is only emitted here (state + __Host- cookie); it is not checked yet.

export const OAUTH_STATE_NONCE_COOKIE = '__Host-oauth_state_nonce'
const OAUTH_STATE_NONCE_TTL_MS = 10 * 60 * 1000

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

/** Stores this page's nonce in a host-only __Host- cookie (https only). */
export const rememberOauthNonce = (): void => {
  const nonce = getPageNonce()
  if (!nonce || window.location.protocol !== 'https:') {
    return
  }
  Cookies.set(OAUTH_STATE_NONCE_COOKIE, nonce, {
    path: '/',
    secure: true,
    sameSite: 'lax',
    expires: new Date(Date.now() + OAUTH_STATE_NONCE_TTL_MS),
  })
}
