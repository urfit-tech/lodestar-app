import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { VoucherProps } from '../components/voucher/Voucher'
import hasura from '../hasura'

export const useEnrolledVoucherCollection = (memberId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_ENROLLED_VOUCHER_COLLECTION,
    hasura.GET_ENROLLED_VOUCHER_COLLECTIONVariables
  >(
    gql`
      query GET_ENROLLED_VOUCHER_COLLECTION($memberId: String!) {
        voucher(where: { member_id: { _eq: $memberId } }, order_by: [{ created_at: desc }]) {
          id
          status {
            outdated
            used
          }
          voucher_code {
            id
            code
            voucher_plan {
              id
              title
              description
              started_at
              ended_at
              is_transferable
              product_quantity_limit
              voucher_plan_products {
                id
                product_id
              }
            }
          }
        }
      }
    `,
    {
      variables: { memberId },
    },
  )

  const enrolledVoucherCollection: (VoucherProps & {
    productIds: string[]
  })[] =
    data?.voucher.map(voucher => ({
      id: voucher.id,
      title: voucher.voucher_code.voucher_plan.title,
      startedAt: voucher.voucher_code.voucher_plan.started_at
        ? new Date(voucher.voucher_code.voucher_plan.started_at)
        : undefined,
      endedAt: voucher.voucher_code.voucher_plan.ended_at
        ? new Date(voucher.voucher_code.voucher_plan.ended_at)
        : undefined,
      productQuantityLimit: voucher.voucher_code.voucher_plan.product_quantity_limit,
      available: !!voucher.status && !voucher.status.outdated && !voucher.status.used,
      productIds: voucher.voucher_code.voucher_plan.voucher_plan_products.map(product => product.product_id),
      description: decodeURI(voucher.voucher_code.voucher_plan.description || ''),
      isTransferable: voucher.voucher_code.voucher_plan.is_transferable,
      voucherCode: {
        id: voucher.voucher_code.id,
        code: voucher.voucher_code.code,
      },
      status: { outdated: voucher.status?.outdated, used: voucher.status?.used },
    })) || []

  return {
    loading,
    error,
    enrolledVoucherCollection,
    refetch,
  }
}
