import axios from 'axios'
import { useEffect, useState } from 'react'
import { useAuth } from '../components/auth/AuthContext'

export const useTask = (queue: string, taskId: string) => {
  const { authToken, apiHost } = useAuth()
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
      apiHost &&
      axios
        .get(
          //`//${apiHost}/tasks/${queue}/${taskId}`,
          `http://localhost:8081/v1/tasks/${queue}/${taskId}`,
          {
            headers: { authorization: `Bearer ${authToken}` },
          },
        )
        .then(({ data: { code, result } }) => {
          if (code === 'SUCCESS') {
            setTask(result)
          }
          if (!result || !result.finishedOn) {
            setTimeout(() => setRetry(v => v + 1), 1000)
          }
        })
  }, [authToken, apiHost, queue, taskId, retry])
  return { task, retry }
}
