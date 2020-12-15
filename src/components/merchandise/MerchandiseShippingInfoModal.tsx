import { Icon } from '@chakra-ui/icons'
import { Button, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import { shippingMethodFormatter } from '../../helpers'
import { ReactComponent as IconList } from '../../images/list-o.svg'
import { InvoiceProps } from '../checkout/InvoiceInput'
import { ShippingProps } from '../checkout/ShippingInput'
import CommonModal from '../common/CommonModal'
import { StyledText } from '../practice/PracticeDisplayedCollection'

const messages = defineMessages({
  shippingInfo: { id: 'product.merchandise.ui.shippingInfo', defaultMessage: '收件資訊' },
  shippingName: { id: 'product.merchandise.ui.shippingName', defaultMessage: '收件姓名' },
  shippingMethod: { id: 'product.merchandise.ui.shippingMethod', defaultMessage: '收件方式' },
  shippingPhone: { id: 'product.merchandise.ui.shippingPhone', defaultMessage: '收件人電話' },
  shippingAddress: { id: 'product.merchandise.ui.shippingAddress', defaultMessage: '收件地址' },
  shippingMail: { id: 'product.merchandise.ui.shippingMail', defaultMessage: '收件人信箱' },
})

const StyledShippingInfoSubtitle = styled.h4`
  ${StyledText}
`
const StyledShippingInfoContent = styled.div`
  margin-bottom: 24px;
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`

const MerchandiseShippingInfoModal: React.FC<{
  shipping: ShippingProps
  invoice: InvoiceProps
}> = ({ shipping, invoice }) => {
  const { formatMessage } = useIntl()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <CommonModal
      title={formatMessage(messages.shippingInfo)}
      renderTrigger={() => (
        <Button leftIcon={<Icon as={IconList} />} variant="ghost" colorScheme="white" onClick={onOpen}>
          {formatMessage(messages.shippingInfo)}
        </Button>
      )}
      isOpen={isOpen}
      onClose={onClose}
    >
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
            <StyledShippingInfoContent>{shipping?.address}</StyledShippingInfoContent>
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
  )
}

export default MerchandiseShippingInfoModal
