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

const PaymentSelector: React.FC<{
  value: PaymentMethodType
  onChange: (value: PaymentMethodType) => void
}> = ({ value, onChange }) => {
  const { formatMessage } = useIntl()
  const { settings } = useApp()
  const [selectedPaymentMethodType, setSelectedPaymentMethodType] = useState<PaymentMethodType | null>(value)

  const handleChange = (paymentMethodType?: PaymentMethodType | null) => {
    const currentPaymentOption =
      typeof paymentMethodType === 'undefined' ? selectedPaymentMethodType : paymentMethodType
    typeof paymentMethodType !== 'undefined' && setSelectedPaymentMethodType(paymentMethodType)
    if (currentPaymentOption) {
      localStorage.setItem('kolable.cart.paymentMethod', currentPaymentOption)
      if (onChange) {
        onChange(currentPaymentOption)
      }
    }
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
        {Number(settings['payment.spgateway.credit.enable']) && (
          <Select.Option value="CREDIT">{formatMessage(checkoutMessages.label.credit)}</Select.Option>
        )}
        {Number(settings['payment.spgateway.vacc.enable']) && (
          <Select.Option value="VACC">{formatMessage(checkoutMessages.label.vacc)}</Select.Option>
        )}
        {Number(settings['payment.spgateway.cvs.enable']) && (
          <Select.Option value="CVS">{formatMessage(checkoutMessages.label.cvs)}</Select.Option>
        )}
        {Number(settings['payment.spgateway.instflag.enable']) && (
          <Select.Option value="InstFlag">{formatMessage(checkoutMessages.label.instFlag)}</Select.Option>
        )}
        {Number(settings['payment.spgateway.unionpay.enable']) && (
          <Select.Option value="UNIONPAY">{formatMessage(checkoutMessages.label.unionPay)}</Select.Option>
        )}
        {Number(settings['payment.spgateway.webatm.enable']) && (
          <Select.Option value="WEBATM">{formatMessage(checkoutMessages.label.webAtm)}</Select.Option>
        )}
        {Number(settings['payment.spgateway.barcode.enable']) && (
          <Select.Option value="BARCODE">{formatMessage(checkoutMessages.label.barcode)}</Select.Option>
        )}
      </Select>
    </>
  )
}

export default PaymentSelector
