import axios from 'axios'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useEffect, useState } from 'react'

export const useTask = (queue: string, taskId: string) => {
  const { authToken } = useAuth()
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
    authToken &&
      axios
        .get(`${process.env.REACT_APP_API_BASE_ROOT}/tasks/${queue}/${taskId}`, {
          headers: { authorization: `Bearer ${authToken}` },
        })
        .then(({ data: { code, result } }) => {
          if (cancelled) return
          setCode(code)
          setTask(result)
          if (!result || !result.finishedOn) {
            timer = setTimeout(() => setRetry(v => v + 1), 1000)
          }
        })
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [authToken, queue, taskId, retry])
  return { task, code, retry }
}
