import { createAppBackendClient } from 'lodestar-app-element/src/services/http'
import { useEffect, useMemo, useState } from 'react'

export const useFetchPayFormToken = (paymentNo?: string, cacheToken?: string | null | undefined) => {
  const [result, setResult] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const appBackendClient = useMemo(() => createAppBackendClient(), [])

  useEffect(() => {
    if (!paymentNo || !cacheToken) return

    const fetchPayFormToken = async () => {
      setLoading(true)
      try {
        const data = await appBackendClient.get<{
          code: string
          message: string
          result: { payFormToken: string | number }
        }>(`/payment/${paymentNo}/pay-form-token/${cacheToken}`)
        if (data.code === 'SUCCESS') {
          setResult({
            token: data.result.payFormToken.toString(),
          })
        } else {
          setError(new Error(data.message))
        }
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchPayFormToken()
  }, [appBackendClient, paymentNo, cacheToken])

  return { result, loading, error }
}
