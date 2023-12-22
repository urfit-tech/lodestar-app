import axios from 'axios'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useCallback, useEffect, useState } from 'react'
import { VoucherProps } from '../components/voucher/Voucher'

export const useEnrolledVoucherCollection = (memberId: string) => {
  const { authToken } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>()
  const [data, setData] = useState<
    (VoucherProps & {
      productIds: string[]
      voucherPlanId: string
    })[]
  >([])

  const fetch = useCallback(async () => {
    if (authToken) {
      try {
        setLoading(true)
        const { data } = await axios.get(
          `${process.env.REACT_APP_LODESTAR_SERVER_ENDPOINT}/vouchers${memberId ? `/?memberId=${memberId}` : ''}`,
          {
            headers: { authorization: `Bearer ${authToken}` },
          },
        )
        setData(
          data
            .filter(
              (
                d: VoucherProps & {
                  voucherPlanProducts: { id: string; productId: string }[]
                  voucherPlanId: string
                },
              ) => d.voucherCode.deletedAt === null,
            )
            .map(
              (
                voucher: VoucherProps & {
                  voucherPlanProducts: { id: string; productId: string }[]
                  voucherPlanId: string
                },
              ) => ({
                ...voucher,
                startedAt: voucher.startedAt ? new Date(voucher.startedAt) : undefined,
                endedAt: voucher.endedAt ? new Date(voucher.endedAt) : undefined,
                description: decodeURI(voucher.description || ''),
                available: !!voucher.status && !voucher.status.outdated && !voucher.status.used,
                productIds: voucher.voucherPlanProducts.map(product => product.productId),
              }),
            ) || [],
        )
      } catch (err) {
        console.log(err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }
  }, [authToken])

  useEffect(() => {
    fetch()
  }, [fetch])

  return {
    loading,
    error,
    data,
    fetch,
  }
}
