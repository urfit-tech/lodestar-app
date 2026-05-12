import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { createAppBackendClient } from 'lodestar-app-element/src/services/http'
import { useEffect, useMemo, useState } from 'react'

export const useTask = (queue: string, taskId: string) => {
  const { authToken } = useAuth()
  const appBackendClient = useMemo(() => createAppBackendClient({ getAuthToken: () => authToken }), [authToken])
  const [retry, setRetry] = useState(0)
  const [task, setTask] = useState<{
    returnvalue: any
    failedReason: string
    progress: number
    timestamp: number
    finishedOn: number | null
    processedOn: number | null
  } | null>(null)
  const [code, setCode] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const abortController = new AbortController()
    authToken &&
      appBackendClient
        .get<{ code: string; result: typeof task }>(`/tasks/${queue}/${taskId}`, {
          signal: abortController.signal,
        })
        .then(({ code, result }) => {
          if (cancelled) return
          setCode(code)
          setTask(result)
          if (!result || !result.finishedOn) {
            timer = setTimeout(() => setRetry(v => v + 1), 1000)
          }
        })
        .catch(error => {
          if (!abortController.signal.aborted) {
            throw error
          }
        })
    return () => {
      cancelled = true
      abortController.abort()
      if (timer) clearTimeout(timer)
    }
  }, [appBackendClient, authToken, queue, taskId, retry])
  return { task, code, retry }
}
