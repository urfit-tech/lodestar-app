import { SkeletonText, Text } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useMemo, useState } from 'react'
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
import { EnrolledVoucher, VoucherFromAPI } from '../../types/vouchers'
import voucherMessages from './translation'

const VoucherCollectionBlock: React.FC = () => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()

  const {
    loading: loadingEnrolledVoucherCollection,
    error: errorEnrolledVoucherCollection,
    data: enrolledVoucherCollection,
  } = useEnrolledVoucherCollection(currentMemberId || '')

  if (!currentMemberId || loadingEnrolledVoucherCollection) {
    return <SkeletonText mt="1" noOfLines={4} spacing="4" />
  }

  if (errorEnrolledVoucherCollection) {
    return <div>{formatMessage(commonMessages.status.loadingError)}</div>
  }

  return <VoucherCollectionInnerBlock enrolledVoucherCollection={enrolledVoucherCollection} />
}

const VoucherCollectionInnerBlock: React.FC<{
  enrolledVoucherCollection: EnrolledVoucher[]
}> = ({ enrolledVoucherCollection }) => {
  const { enabledModules } = useApp()
  const { currentMemberId } = useAuth()
  const { formatMessage } = useIntl()
  const [vouchers, setVouchers] = useState<EnrolledVoucher[]>(enrolledVoucherCollection)
  const [loading, setLoading] = useState(false)
  const [voucherCode, setVoucherCode] = useQueryParam('voucherCode', StringParam)

  const {
    loading: loadingEnrolledProductIds,
    error: errorEnrolledProductIds,
    enrolledProductIds,
    refetch: refetchEnrolledProductIds,
  } = useEnrolledProductIds(currentMemberId || '')

  const handleRefetch = () => {
    refetchEnrolledProductIds()
      .catch(handleError)
      .finally(() => voucherCode && setVoucherCode(null))
  }

  const vouchersWithExtraElement = useMemo(() => {
    return generateVoucherWithExtraElement(
      vouchers,
      enrolledProductIds,
      loading,
      setLoading,
      handleRefetch,
      !!enabledModules.transfer_voucher,
      voucherId => {
        setVouchers(prev =>
          prev.map(voucher =>
            voucher.id === voucherId
              ? { ...voucher, available: false, status: { ...voucher.status, used: true } }
              : voucher,
          ),
        )
      },
    )
  }, [vouchers, enrolledProductIds])

  return (
    <>
      <div className="mb-5">
        <VoucherInsertBlock
          loading={loading}
          onChangeLoading={status => setLoading(status)}
          onRefetch={handleRefetch}
          afterInsert={(_newVoucher: VoucherFromAPI) => {
            const newVoucher = {
              id: _newVoucher.id,
              voucherPlanId: _newVoucher.voucherCode.voucherPlan.id,
              title: _newVoucher.voucherCode.voucherPlan.title,
              description: decodeURI(_newVoucher.voucherCode.voucherPlan.description || ''),
              productQuantityLimit: _newVoucher.voucherCode.voucherPlan.productQuantityLimit,
              isTransferable: _newVoucher.voucherCode.voucherPlan.isTransferable,
              startedAt: _newVoucher.voucherCode.voucherPlan.startedAt
                ? new Date(_newVoucher.voucherCode.voucherPlan.startedAt)
                : undefined,
              endedAt: _newVoucher.voucherCode.voucherPlan.endedAt
                ? new Date(_newVoucher.voucherCode.voucherPlan.endedAt)
                : undefined,
              available: !!_newVoucher.status && !_newVoucher.status.outdated && !_newVoucher.status.used,
              productIds: _newVoucher.voucherCode.voucherPlan.voucherPlanProducts.map(
                voucherPlanProduct => voucherPlanProduct.productId,
              ),
              voucherCode: {
                id: _newVoucher.voucherCode.id,
                code: _newVoucher.voucherCode.code,
                deletedAt: _newVoucher.voucherCode.deletedAt ? new Date(_newVoucher.voucherCode.deletedAt) : undefined,
              },
              status: _newVoucher.status,
            }
            setVouchers(prev => [newVoucher, ...prev])
          }}
        />
        <Text marginTop="24px" fontSize="sm" color={'var(--gray-dark)'}>
          {formatMessage(voucherMessages.VoucherExchangeModal.info)}
        </Text>
      </div>

      <VoucherCollectionTabs vouchers={vouchersWithExtraElement} />
    </>
  )
}

const generateVoucherWithExtraElement = (
  vouchers: EnrolledVoucher[],
  enrolledProductIds: string[],
  loading: boolean,
  onChangeLoading: (status: boolean) => void,
  onRefetch: () => void,
  hasDeliverModal: boolean,
  afterExchange: (voucherId: string) => void,
) => {
  return vouchers.map(voucher => ({
    ...voucher,
    extra: (
      <>
        {hasDeliverModal && voucher.isTransferable && (
          <VoucherDeliverModal title={voucher.title} voucherId={voucher.id} onRefetch={onRefetch} />
        )}
        <VoucherExchangeModal
          voucherId={voucher.id}
          voucherPlanId={voucher.voucherPlanId}
          productQuantityLimit={voucher.productQuantityLimit}
          productIds={voucher.productIds}
          disabledProductIds={enrolledProductIds}
          description={voucher.description}
          loading={loading}
          onLoading={onChangeLoading}
          onRefetch={onRefetch}
          afterExchange={afterExchange}
        />
      </>
    ),
  }))
}

export default VoucherCollectionBlock
