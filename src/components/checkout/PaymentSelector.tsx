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
export type PaymentProps = {
  gateway: string
  method?: PaymentMethodType
}

export type PaymentMethodType = 'credit' | 'vacc' | 'cvs' | 'instflag' | 'unionpay' | 'webatm' | 'barcode'

const PaymentSelector: React.FC<{
  value: PaymentProps
  onChange: (value: PaymentProps) => void
}> = ({ value, onChange }) => {
  const { formatMessage } = useIntl()
  const { settings } = useApp()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentProps | null>(value)

  const handleChange = (paymentType?: PaymentProps | null) => {
    const currentPaymentOption = typeof paymentType === 'undefined' ? selectedPaymentMethod : paymentType
    typeof paymentType !== 'undefined' && setSelectedPaymentMethod(paymentType)
    if (currentPaymentOption) {
      localStorage.setItem('kolable.cart.payment', JSON.stringify(currentPaymentOption))
      if (onChange) {
        onChange(currentPaymentOption)
      }
    }
  }

  return (
    <>
      <StyledTitle>{formatMessage(checkoutMessages.label.paymentMethod)}</StyledTitle>
      <StyledDescription className="mb-4">{formatMessage(checkoutMessages.message.warningPayment)}</StyledDescription>
      <Select
        style={{ width: '50%' }}
        value={JSON.stringify(selectedPaymentMethod)}
        onChange={(v: string) => v && handleChange(JSON.parse(v))}
      >
        {settings['payment.spgateway.credit.enable'] === '1' && (
          <Select.Option value='{"gateway":"spgateway","method":"credit"}'>
            {formatMessage(checkoutMessages.label.credit)}
          </Select.Option>
        )}
        {settings['payment.spgateway.vacc.enable'] === '1' && (
          <Select.Option value='{"gateway":"spgateway","method":"vacc"}'>
            {formatMessage(checkoutMessages.label.vacc)}
          </Select.Option>
        )}
        {settings['payment.spgateway.cvs.enable'] === '1' && (
          <Select.Option value='{"gateway":"spgateway","method":"cvs"}'>
            {formatMessage(checkoutMessages.label.cvs)}
          </Select.Option>
        )}
        {settings['payment.spgateway.instflag.enable'] === '1' && (
          <Select.Option value='{"gateway":"spgateway","method":"instflag"}'>
            {formatMessage(checkoutMessages.label.instFlag)}
          </Select.Option>
        )}
        {settings['payment.spgateway.unionpay.enable'] === '1' && (
          <Select.Option value='{"gateway":"spgateway","method":"unionpay"}'>
            {formatMessage(checkoutMessages.label.unionPay)}
          </Select.Option>
        )}
        {settings['payment.spgateway.webatm.enable'] === '1' && (
          <Select.Option value='{"gateway":"spgateway","method":"webatm"}'>
            {formatMessage(checkoutMessages.label.webAtm)}
          </Select.Option>
        )}
        {settings['payment.spgateway.barcode.enable'] === '1' && (
          <Select.Option value='{"gateway":"spgateway","method":"barcode"}'>
            {formatMessage(checkoutMessages.label.barcode)}
          </Select.Option>
        )}
      </Select>
    </>
  )
}

export default PaymentSelector
