import axios from 'axios'
import { useEffect, useState } from 'react'

export const useFetchPayFormToken = (paymentNo?: string, cacheToken?: string | null | undefined) => {
  const [result, setResult] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!paymentNo || !cacheToken) return

    const fetchPayFormToken = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_ROOT}/payment/${paymentNo}/pay-form-token/${cacheToken}`,
        )
        if (response.data.code === 'SUCCESS') {
          setResult({
            token: response.data.result.payFormToken.toString(),
          })
        } else {
          setError(new Error(response.data.message))
        }
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchPayFormToken()
  }, [paymentNo, cacheToken])

  return { result, loading, error }
}
