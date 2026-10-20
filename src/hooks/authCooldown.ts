import { useCallback, useEffect, useRef, useState } from 'react'

export const authCooldownKey = (appId: string, kind: string, identity: string) =>
  `auth-cooldown:${appId}:${kind}:${identity.trim().toLowerCase()}`

export const saveAuthCooldown = (key: string, seconds: number) => {
  const deadline = Date.now() + seconds * 1000
  try {
    sessionStorage.setItem(key, String(deadline))
  } catch {}
  return deadline
}

const readDeadline = (key: string, initialSeconds: number, requestedAt: number) => {
  try {
    const saved = sessionStorage.getItem(key)
    if (requestedAt > 0) {
      const deadline = Math.max(Number(saved) || 0, requestedAt + initialSeconds * 1000)
      sessionStorage.setItem(key, String(deadline))
      return deadline
    }
    if (saved !== null) return Number(saved) || 0
  } catch {}
  return initialSeconds > 0 ? saveAuthCooldown(key, initialSeconds) : 0
}

export const useAuthCooldown = (key: string, initialSeconds = 0, requestedAt = 0) => {
  const currentKey = useRef(key)
  currentKey.current = key
  const [deadline, setDeadline] = useState(() => readDeadline(key, initialSeconds, requestedAt))
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    setDeadline(readDeadline(key, initialSeconds, requestedAt))
    setNow(Date.now())
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [key, initialSeconds, requestedAt])
  const start = useCallback(
    (seconds: number) => {
      const nextDeadline = saveAuthCooldown(key, seconds)
      if (currentKey.current !== key) return
      setNow(Date.now())
      setDeadline(nextDeadline)
    },
    [key],
  )
  return { remaining: Math.max(0, Math.ceil((deadline - now) / 1000)), start }
}
