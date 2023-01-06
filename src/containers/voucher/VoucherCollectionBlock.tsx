import { useQuery } from '@apollo/react-hooks'
import { message } from 'antd'
import axios from 'axios'
import gql from 'graphql-tag'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { useIntl } from 'react-intl'
import { StringParam, useQueryParam } from 'use-query-params'
import { VoucherProps } from '../../components/voucher/Voucher'
import VoucherCollectionBlockComponent from '../../components/voucher/VoucherCollectionBlock'
import hasura from '../../hasura'
import { handleError } from '../../helpers'
import { voucherMessages } from '../../helpers/translation'
import { useEnrolledProductIds } from '../../hooks/data'
import { fetchCurrentGeolocation } from '../../hooks/util'

const VoucherCollectionBlock: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { currentMemberId, authToken } = useAuth()
  const [voucherCode, setVoucherCode] = useQueryParam('voucherCode', StringParam)
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_VOUCHER_COLLECTION,
    hasura.GET_VOUCHER_COLLECTIONVariables
  >(GET_VOUCHER_COLLECTION, {
    variables: { memberId: currentMemberId || '' },
  })

  const {
    loading: loadingEnrolledProductIds,
    error: errorEnrolledProductIds,
    enrolledProductIds,
    refetch: refetchEnrolledProductIds,
  } = useEnrolledProductIds(currentMemberId || '')

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
      isTransferable: voucher.voucher_code.voucher_plan.is_transferable,
      voucherCode: {
        id: voucher.voucher_code.id,
        code: voucher.voucher_code.code,
      },
    })) || []

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

    exchangeVoucherCode(authToken, voucherId, selectedProductIds)
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

  const handleRefetch = () => {
    refetch()
      .then(() => {
        refetchEnrolledProductIds().catch(handleError)
      })
      .catch(handleError)
      .finally(() => {
        voucherCode && setVoucherCode(null)
        window.location.reload()
      })
  }

  return (
    <VoucherCollectionBlockComponent
      memberId={currentMemberId}
      loading={loading || loadingEnrolledProductIds}
      error={error || errorEnrolledProductIds}
      voucherCollection={voucherCollection}
      disabledProductIds={enrolledProductIds}
      onExchange={handleExchange}
      onRefetch={handleRefetch}
    />
  )
}

const exchangeVoucherCode = async (authToken: string | null, voucherId: string, selectedProductIds: string[]) => {
  const { ip, country, countryCode } = await fetchCurrentGeolocation()
  return axios.post(
    `${process.env.REACT_APP_API_BASE_ROOT}/tasks/order`,
    {
      paymentModel: { type: 'perpetual' },
      discountId: `Voucher_${voucherId}`,
      productIds: selectedProductIds,
      invoice: {},
      geolocation: { ip: ip || '', country: country || '', countryCode: countryCode || '' },
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
`

export default VoucherCollectionBlock
