import { Button, Icon, useDisclosure } from '@chakra-ui/react'
import { CommonTextMixin } from 'lodestar-app-element/src/components/common/index'
import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import { shippingMethodFormatter } from '../../helpers'
import { ReactComponent as IconList } from '../../images/list-o.svg'
import { InvoiceProps, ShippingProps } from '../../types/checkout'
import CommonModal from '../common/CommonModal'

const messages = defineMessages({
  shippingInfo: { id: 'product.merchandise.ui.shippingInfo', defaultMessage: '收件資訊' },
  shippingName: { id: 'product.merchandise.ui.shippingName', defaultMessage: '收件姓名' },
  shippingMethod: { id: 'product.merchandise.ui.shippingMethod', defaultMessage: '收件方式' },
  shippingPhone: { id: 'product.merchandise.ui.shippingPhone', defaultMessage: '收件人電話' },
  shippingAddress: { id: 'product.merchandise.ui.shippingAddress', defaultMessage: '收件地址' },
  shippingMail: { id: 'product.merchandise.ui.shippingMail', defaultMessage: '收件人信箱' },
})

const StyledShippingInfoSubtitle = styled.h4`
  ${CommonTextMixin}
`
const StyledShippingInfoContent = styled.div`
  margin-bottom: 24px;
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`

const MerchandiseShippingInfoModal: React.VFC<{
  shipping: ShippingProps
  invoice: InvoiceProps
}> = ({ shipping, invoice }) => {
  const { formatMessage } = useIntl()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button leftIcon={<Icon as={IconList} />} variant="ghost" colorScheme="white" onClick={onOpen}>
        {formatMessage(messages.shippingInfo)}
      </Button>
      <CommonModal title={formatMessage(messages.shippingInfo)} isOpen={isOpen} onClose={onClose}>
        <div>
          <div className="row">
            <div className="col-4">
              <StyledShippingInfoSubtitle className="mb-1">
                {formatMessage(messages.shippingName)}
              </StyledShippingInfoSubtitle>
              <StyledShippingInfoContent>{shipping?.name}</StyledShippingInfoContent>
            </div>
            <div className="col-8">
              <StyledShippingInfoSubtitle className="mb-1">
                {formatMessage(messages.shippingMethod)}
              </StyledShippingInfoSubtitle>
              <StyledShippingInfoContent>{shippingMethodFormatter(shipping?.shippingMethod)}</StyledShippingInfoContent>
            </div>
            <div className="col-12">
              <StyledShippingInfoSubtitle className="mb-1">
                {formatMessage(messages.shippingPhone)}
              </StyledShippingInfoSubtitle>
              <StyledShippingInfoContent>{shipping?.phone}</StyledShippingInfoContent>
            </div>
            <div className="col-12">
              <StyledShippingInfoSubtitle className="mb-1">
                {formatMessage(messages.shippingAddress)}
              </StyledShippingInfoSubtitle>
              <StyledShippingInfoContent>
                {shipping?.address}
                {shipping?.storeName ? `（${shipping.storeName}）` : ''}
              </StyledShippingInfoContent>
            </div>
            <div className="col-12">
              <StyledShippingInfoSubtitle className="mb-1">
                {formatMessage(messages.shippingMail)}
              </StyledShippingInfoSubtitle>
              <StyledShippingInfoContent>{invoice?.email}</StyledShippingInfoContent>
            </div>
          </div>
        </div>
      </CommonModal>
    </>
  )
}

export default MerchandiseShippingInfoModal
