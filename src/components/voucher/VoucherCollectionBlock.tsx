import { SkeletonText } from '@chakra-ui/react'
import { message } from 'antd'
import axios from 'axios'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { StringParam, useQueryParam } from 'use-query-params'
import VoucherCollectionTabs from '../../components/voucher/VoucherCollectionTabs'
import VoucherDeliverModal from '../../components/voucher/VoucherDeliverModal'
import VoucherExchangeModal from '../../components/voucher/VoucherExchangeModal'
import VoucherInsertBlock from '../../components/voucher/VoucherInsertBlock'
import { handleError } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { useEnrolledProductIds } from '../../hooks/data'
import { fetchCurrentGeolocation } from '../../hooks/util'
import { useEnrolledVoucherCollection } from '../../hooks/voucher'
import voucherMessages from './translation'

const VoucherCollectionBlock: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { enabledModules } = useApp()
  const { currentMemberId, authToken } = useAuth()
  const [loading, setLoading] = useState(false)
  const [voucherCode, setVoucherCode] = useQueryParam('voucherCode', StringParam)

  const {
    loading: loadingEnrolledProductIds,
    error: errorEnrolledProductIds,
    enrolledProductIds,
    refetch: refetchEnrolledProductIds,
  } = useEnrolledProductIds(currentMemberId || '')

  const {
    loading: loadingEnrolledVoucherCollection,
    error: errorEnrolledVoucherCollection,
    enrolledVoucherCollection,
    refetch: refetchEnrolledVoucherCollection,
  } = useEnrolledVoucherCollection(currentMemberId || '')

  const handleExchange = async (
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    selectedProductIds: string[],
    voucherId: string,
  ) => {
    setLoading(true)
    if (!currentMemberId) {
      return
    }
    const { ip, country, countryCode } = await fetchCurrentGeolocation()
    await axios
      .post(
        `${process.env.REACT_APP_API_BASE_ROOT}/order/create`,
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
      .then(() => {
        setVisible(false)
        message.success(formatMessage(voucherMessages.VoucherCollectionBLock.exchangeVoucher))
        refetchEnrolledVoucherCollection()
      })
      .catch(error => handleError(error))
      .finally(() => {
        setLoading(false)
        //   setTimeout(() => {
        //     window.location.reload()
        //   }, 2000)
      })
  }

  const handleRefetch = () => {
    refetchEnrolledVoucherCollection()
      .then(() => {
        refetchEnrolledProductIds().catch(handleError)
      })
      .catch(handleError)
      .finally(() => voucherCode && setVoucherCode(null))
  }

  const vouchers = enrolledVoucherCollection.map(voucher => ({
    ...voucher,
    extra: (
      <>
        {enabledModules.transfer_voucher && voucher.isTransferable && (
          <VoucherDeliverModal title={voucher.title} voucherId={voucher.id} onRefetch={handleRefetch} />
        )}
        <VoucherExchangeModal
          productQuantityLimit={voucher.productQuantityLimit}
          productIds={voucher.productIds}
          disabledProductIds={enrolledProductIds}
          onExchange={(setVisible, selectedProductIds) => handleExchange(setVisible, selectedProductIds, voucher.id)}
          description={voucher.description}
          loading={loading}
        />
      </>
    ),
  }))

  if (!currentMemberId || loadingEnrolledProductIds || loadingEnrolledVoucherCollection) {
    return <SkeletonText mt="1" noOfLines={4} spacing="4" />
  }

  if (errorEnrolledProductIds || errorEnrolledVoucherCollection) {
    return <div>{formatMessage(commonMessages.status.loadingError)}</div>
  }

  return (
    <>
      <div className="mb-5">
        <VoucherInsertBlock onRefetch={handleRefetch} />
      </div>

      <VoucherCollectionTabs vouchers={vouchers} />
    </>
  )
}

export default VoucherCollectionBlock
