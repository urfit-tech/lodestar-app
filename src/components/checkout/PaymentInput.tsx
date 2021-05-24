import { Select } from 'antd'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import { checkoutMessages } from '../../helpers/translation'
import { CommonTitleMixin } from '../common'

const StyledTitle = styled.h1`
  margin-bottom: 0.75rem;
  ${CommonTitleMixin}
`
const StyledDescription = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
`

export type PaymentMethodType = 'CREDIT' | 'VACC' | 'CVS' | 'InstFlag' | 'UNIONPAY' | 'WEBATM' | 'BARCODE'

const PaymentInput: React.FC<{
  value: PaymentMethodType
  onChange: (value: PaymentMethodType) => void
}> = ({ value, onChange }) => {
  const { formatMessage } = useIntl()
  const { settings } = useApp()
  const [selectedPaymentMethodType, setSelectedPaymentMethodType] = useState<PaymentMethodType | null>(value)

  const paymentOptions = (settings['payment.method'] && settings['payment.method'].split(',')) || []

  const handleChange: (paymentMethod?: PaymentMethodType | null) => void = PaymentMethodType => {
    const currentPaymentOption =
      typeof PaymentMethodType === 'undefined' ? selectedPaymentMethodType : PaymentMethodType
    typeof PaymentMethodType !== 'undefined' && setSelectedPaymentMethodType(PaymentMethodType)
    currentPaymentOption && localStorage.setItem('kolable.cart.paymentMethod', currentPaymentOption)
    currentPaymentOption && onChange && onChange(currentPaymentOption)
  }

  return (
    <>
      <StyledTitle>{formatMessage(checkoutMessages.label.paymentMethod)}</StyledTitle>
      <StyledDescription className="mb-4">{formatMessage(checkoutMessages.message.warningPayment)}</StyledDescription>
      <Select<PaymentMethodType | null>
        style={{ width: '50%' }}
        value={selectedPaymentMethodType}
        onChange={v => handleChange(v)}
      >
        <Select.Option value="CREDIT">{formatMessage(checkoutMessages.label.credit)}</Select.Option>
        <Select.Option value="VACC">{formatMessage(checkoutMessages.label.vacc)}</Select.Option>
        <Select.Option value="CVS">{formatMessage(checkoutMessages.label.cvs)}</Select.Option>
        {paymentOptions.includes('InstFlag') && (
          <Select.Option value="InstFlag">{formatMessage(checkoutMessages.label.instFlag)}</Select.Option>
        )}
        {paymentOptions.includes('UNIONPAY') && (
          <Select.Option value="UNIONPAY">{formatMessage(checkoutMessages.label.unionPay)}</Select.Option>
        )}
        {paymentOptions.includes('WEBATM') && (
          <Select.Option value="WEBATM">{formatMessage(checkoutMessages.label.webAtm)}</Select.Option>
        )}
        {paymentOptions.includes('BARCODE') && (
          <Select.Option value="BARCODE">{formatMessage(checkoutMessages.label.barcode)}</Select.Option>
        )}
      </Select>
    </>
  )
}

export default PaymentInput
