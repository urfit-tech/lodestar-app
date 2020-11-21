import axios from 'axios'
import { useEffect, useState } from 'react'
import { useAuth } from '../components/auth/AuthContext'

export const useTask = (queue: string, taskId: string) => {
  const { authToken, backendEndpoint } = useAuth()
  const [retry, setRetry] = useState(0)
  const [task, setTask] = useState<{
    returnvalue: any
    failedReason: string
    progress: number
    timestamp: number
    finishedOn: number | null
    processedOn: number | null
  } | null>(null)

  useEffect(() => {
    authToken &&
      backendEndpoint &&
      axios
        .get(`${backendEndpoint}/tasks/${queue}/${taskId}`, {
          headers: { authorization: `Bearer ${authToken}` },
        })
        .then(({ data: { code, result } }) => {
          if (code === 'SUCCESS') {
            setTask(result)
          }
          if (!result || !result.finishedOn) {
            setTimeout(() => setRetry(v => v + 1), 1000)
          }
        })
  }, [authToken, backendEndpoint, queue, taskId, retry])
  return { task, retry }
}
