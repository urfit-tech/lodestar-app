import { useCallback, useEffect, useState } from 'react'

export const authCooldownKey = (appId: string, kind: string, identity: string) =>
  `auth-cooldown:${appId}:${kind}:${identity.trim().toLowerCase()}`

export const saveAuthCooldown = (key: string, seconds: number) => {
  const deadline = Date.now() + seconds * 1000
  try {
    sessionStorage.setItem(key, String(deadline))
  } catch {}
  return deadline
}

export const useAuthCooldown = (key: string) => {
  const [deadline, setDeadline] = useState(() => {
    try {
      return Number(sessionStorage.getItem(key)) || 0
    } catch {
      return 0
    }
  })
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    try {
      setDeadline(Number(sessionStorage.getItem(key)) || 0)
    } catch {
      setDeadline(0)
    }
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [key])
  const start = useCallback(
    (seconds: number) => {
      setNow(Date.now())
      setDeadline(saveAuthCooldown(key, seconds))
    },
    [key],
  )
  return { remaining: Math.max(0, Math.ceil((deadline - now) / 1000)), start }
}
