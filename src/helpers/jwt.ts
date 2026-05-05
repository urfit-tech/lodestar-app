const base64UrlDecode = (value: string) => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
  const binary = atob(paddedBase64)

  return decodeURIComponent(
    Array.from(binary)
      .map(char => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
      .join(''),
  )
}

export const decodeJwtPayload = <T = unknown>(token?: string | null): T | null => {
  const payload = token?.split('.')[1]

  if (!payload) {
    return null
  }

  try {
    return JSON.parse(base64UrlDecode(payload)) as T
  } catch {
    return null
  }
}
