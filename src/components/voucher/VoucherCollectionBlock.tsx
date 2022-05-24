import { SkeletonText } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import { useIntl } from 'react-intl'
import VoucherCollectionTabs from '../../components/voucher/VoucherCollectionTabs'
import VoucherDeliverModal from '../../components/voucher/VoucherDeliverModal'
import VoucherExchangeModal from '../../components/voucher/VoucherExchangeModal'
import VoucherInsertBlock from '../../components/voucher/VoucherInsertBlock'
import { commonMessages } from '../../helpers/translation'
import { VoucherProps } from './Voucher'

const VoucherCollectionBlock: React.VFC<{
  memberId: string | null
  loading?: boolean
  error?: Error
  voucherCollection: (VoucherProps & {
    productIds: string[]
  })[]
  disabledProductIds: string[]
  onExchange: (
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    selectedProductIds: string[],
    voucherId: string,
  ) => void
  onRefetch?: () => void
  onRefetchEnrolledProgramIds?: () => void
}> = ({
  memberId,
  loading,
  error,
  voucherCollection,
  disabledProductIds,
  onExchange,
  onRefetch,
  onRefetchEnrolledProgramIds,
}) => {
  const { formatMessage } = useIntl()
  const { enabledModules } = useApp()
  if (!memberId || loading) {
    return <SkeletonText mt="1" noOfLines={4} spacing="4" />
  }

  if (error) {
    return <div>{formatMessage(commonMessages.status.loadingError)}</div>
  }

  const vouchers = voucherCollection.map(voucher => ({
    ...voucher,
    extra: (
      <>
        {enabledModules.transfer_voucher && voucher.isTransferable && (
          <VoucherDeliverModal title={voucher.title} voucherId={voucher.id} onRefetch={onRefetch} />
        )}
        <VoucherExchangeModal
          productQuantityLimit={voucher.productQuantityLimit}
          productIds={voucher.productIds}
          disabledProductIds={disabledProductIds}
          onExchange={(setVisible, setLoading, selectedProductIds) =>
            onExchange(setVisible, setLoading, selectedProductIds, voucher.id)
          }
          description={voucher.description}
        />
      </>
    ),
  }))

  return (
    <>
      <div className="mb-5">
        <VoucherInsertBlock
          onRefetchVoucherCollection={onRefetch}
          onRefetchEnrolledProgramIds={onRefetchEnrolledProgramIds}
        />
      </div>

      <VoucherCollectionTabs vouchers={vouchers} />
    </>
  )
}

export default VoucherCollectionBlock
