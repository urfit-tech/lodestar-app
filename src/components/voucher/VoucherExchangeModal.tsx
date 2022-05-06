import { Button, Divider } from '@chakra-ui/react'
import { Checkbox, Modal } from 'antd'
import { CommonTitleMixin } from 'lodestar-app-element/src/components/common/index'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import ProductItem from '../../components/common/ProductItem'
import { commonMessages, voucherMessages } from '../../helpers/translation'

const StyledTitle = styled.div`
  ${CommonTitleMixin}
`
const StyledDescription = styled.div`
  color: var(--gray-darker);
  font-size: 16px;
  letter-spacing: 0.2px;
  white-space: pre-wrap;
`
const StyledNotice = styled.div`
  margin-bottom: 2rem;
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
`

const VoucherExchangeModal: React.VFC<{
  productQuantityLimit: number
  description: string | null
  productIds: string[]
  onExchange?: (
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    selectedProductIds: string[],
  ) => void
}> = ({ productQuantityLimit, description, productIds, onExchange }) => {
  const { formatMessage } = useIntl()
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])

  // select disabledProductIds
  const disabledProductIds: any = []

  return (
    <>
      <Button colorScheme="primary" onClick={() => setVisible(true)}>
        {formatMessage(commonMessages.button.useNow)}
      </Button>

      <Modal centered destroyOnClose footer={null} visible={visible} onCancel={() => setVisible(false)}>
        <StyledTitle className="mb-2">
          {formatMessage(
            { id: 'voucher.redeemable.items', defaultMessage: '可兌換 {productQuantityLimit} 個項目' },
            { productQuantityLimit },
          )}
        </StyledTitle>
        <StyledDescription className="mb-2">{description}</StyledDescription>
        <StyledNotice>{formatMessage(voucherMessages.content.notice)}</StyledNotice>

        {productIds.map(productId => (
          <div key={productId}>
            <div className="d-flex align-items-center justify-content-start">
              <Checkbox
                className="mr-4"
                onChange={e => {
                  if (e.target.checked) {
                    setSelectedProductIds([...selectedProductIds, productId])
                  } else {
                    setSelectedProductIds(selectedProductIds.filter(id => id !== productId))
                  }
                }}
                disabled={
                  disabledProductIds.includes(productId) ||
                  (!selectedProductIds.includes(productId) && selectedProductIds.length >= productQuantityLimit)
                }
              />
              <ProductItem id={productId} />
            </div>

            <Divider className="my-4" />
          </div>
        ))}

        <div className="text-right">
          <Button className="mr-2" onClick={() => setVisible(false)}>
            {formatMessage(commonMessages.ui.cancel)}
          </Button>
          <Button
            colorScheme="primary"
            isLoading={loading}
            isDisabled={selectedProductIds.length === 0 || selectedProductIds.length > productQuantityLimit}
            onClick={() => {
              if (onExchange) {
                onExchange(setVisible, setLoading, selectedProductIds)
              }
            }}
          >
            {formatMessage(commonMessages.button.exchange)}
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default VoucherExchangeModal
