import { SkeletonText } from '@chakra-ui/react'
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
import { useEnrolledVoucherCollection } from '../../hooks/voucher'

const VoucherCollectionBlock: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { enabledModules } = useApp()
  const { currentMemberId } = useAuth()
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
          voucherId={voucher.id}
          voucherPlanId={voucher.voucherPlanId}
          productQuantityLimit={voucher.productQuantityLimit}
          productIds={voucher.productIds}
          disabledProductIds={enrolledProductIds}
          description={voucher.description}
          loading={loading}
          onLoading={status => setLoading(status)}
          onRefetch={() => refetchEnrolledVoucherCollection()}
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
