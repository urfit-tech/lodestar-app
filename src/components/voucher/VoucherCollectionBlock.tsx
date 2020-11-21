import { Skeleton } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'
import VoucherCollectionTabs from '../../components/voucher/VoucherCollectionTabs'
import VoucherExchangeModal from '../../components/voucher/VoucherExchangeModal'
import VoucherInsertBlock from '../../components/voucher/VoucherInsertBlock'
import { commonMessages } from '../../helpers/translation'
import { VoucherProps } from './Voucher'

type VoucherCollectionBlockProps = {
  memberId: string | null
  loading?: boolean
  error?: Error
  voucherCollection: (VoucherProps & {
    productIds: string[]
  })[]
  onInsert: (setLoading: React.Dispatch<React.SetStateAction<boolean>>, code: string) => void
  onExchange: (
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    selectedProductIds: string[],
    voucherId: string,
  ) => void
}
const VoucherCollectionBlock: React.FC<VoucherCollectionBlockProps> = ({
  memberId,
  loading,
  error,
  voucherCollection,
  onExchange,
  onInsert,
}) => {
  const { formatMessage } = useIntl()
  if (!memberId || loading) {
    return <Skeleton active />
  }

  if (error) {
    return <div>{formatMessage(commonMessages.status.loadingError)}</div>
  }

  const vouchers = voucherCollection.map(voucher => ({
    ...voucher,
    extra: (
      <VoucherExchangeModal
        productQuantityLimit={voucher.productQuantityLimit}
        productIds={voucher.productIds}
        onExchange={(setVisible, setLoading, selectedProductIds) =>
          onExchange(setVisible, setLoading, selectedProductIds, voucher.id)
        }
        description={voucher.description}
      />
    ),
  }))

  return (
    <>
      <div className="mb-5">
        <VoucherInsertBlock onInsert={onInsert} />
      </div>

      <VoucherCollectionTabs vouchers={vouchers} />
    </>
  )
}

export default VoucherCollectionBlock
