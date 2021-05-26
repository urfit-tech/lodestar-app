import { useQuery } from '@apollo/react-hooks'
import { message } from 'antd'
import axios from 'axios'
import gql from 'graphql-tag'
import React from 'react'
import { useIntl } from 'react-intl'
import { useAuth } from '../../components/auth/AuthContext'
import { VoucherProps } from '../../components/voucher/Voucher'
import VoucherCollectionBlockComponent from '../../components/voucher/VoucherCollectionBlock'
import hasura from '../../hasura'
import { handleError } from '../../helpers'
import { codeMessages, voucherMessages } from '../../helpers/translation'
import { useEnrolledProductIds } from '../../hooks/data'

const VoucherCollectionBlock: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { currentMemberId, authToken, apiHost } = useAuth()
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_VOUCHER_COLLECTION,
    hasura.GET_VOUCHER_COLLECTIONVariables
  >(GET_VOUCHER_COLLECTION, {
    variables: { memberId: currentMemberId || '' },
  })
  const { loadingProductIds, errorProductIds, enrolledProductIds, refetchProgramIds } = useEnrolledProductIds(
    currentMemberId || '',
  )

  const voucherCollection: (VoucherProps & {
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
    })) || []

  const handleInsert = (setLoading: React.Dispatch<React.SetStateAction<boolean>>, code: string) => {
    if (!currentMemberId) {
      return
    }

    setLoading(true)

    axios
      .post(
        `https://${apiHost}/payment/exchange`,
        {
          code,
          type: 'Voucher',
        },
        {
          headers: { authorization: `Bearer ${authToken}` },
        },
      )
      .then(({ data: { code, message: errorMessage } }) => {
        if (code === 'SUCCESS') {
          message.success(formatMessage(voucherMessages.messages.addVoucher))
          refetch()
          refetchProgramIds()
        } else {
          if (/^GraphQL error: Uniqueness violation/.test(errorMessage)) {
            message.error(formatMessage(voucherMessages.messages.duplicateVoucherCode))
          } else {
            message.error(formatMessage(codeMessages[code as keyof typeof codeMessages]))
          }
        }
      })
      .catch(handleError)
      .finally(() => setLoading(false))
  }

  const handleExchange = (
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    selectedProductIds: string[],
    voucherId: string,
  ) => {
    if (!currentMemberId) {
      return
    }

    setLoading(true)

    exchangeVoucherCode(authToken, apiHost, voucherId, selectedProductIds)
      .then(data => {
        setVisible(false)
        message.success(formatMessage(voucherMessages.messages.exchangeVoucher))
        refetch()
      })
      .catch(error => {
        try {
          message.error(error.response.data.message)
        } catch (error) {
          message.error(formatMessage(voucherMessages.messages.useVoucherError))
        }
      })
      .finally(() => setLoading(false))
  }

  return (
    <VoucherCollectionBlockComponent
      memberId={currentMemberId}
      loading={loading || loadingProductIds}
      error={error || errorProductIds}
      voucherCollection={voucherCollection}
      disabledProductIds={enrolledProductIds}
      onInsert={handleInsert}
      onExchange={handleExchange}
    />
  )
}

const exchangeVoucherCode = (
  authToken: string | null,
  apiHost: string,
  voucherId: string,
  selectedProductIds: string[],
) => {
  return axios.post(
    `https://${apiHost}/tasks/order`,
    {
      paymentModel: { type: 'perpetual' },
      discountId: `Voucher_${voucherId}`,
      productIds: selectedProductIds,
      invoice: {},
    },
    {
      headers: { authorization: `Bearer ${authToken}` },
    },
  )
}

const GET_VOUCHER_COLLECTION = gql`
  query GET_VOUCHER_COLLECTION($memberId: String!) {
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
          product_quantity_limit
          voucher_plan_products {
            id
            product_id
          }
        }
      }
    }
  }
`

export default VoucherCollectionBlock
