import { Form, Select } from 'antd'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import { checkoutMessages } from '../../helpers/translation'
import { PaymentProps } from '../../types/checkout'
import { CommonTitleMixin } from '../common'

const StyledTitle = styled.h1`
  margin-bottom: 0.75rem;
  line-height: 1.5;
  ${CommonTitleMixin}
`
const StyledDescription = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
  line-height: 1.5;
`

const PaymentSelector: React.FC<{
  value: PaymentProps | null
  onChange: (value: PaymentProps | null) => void
  isValidating?: boolean
}> = ({ value, onChange, isValidating }) => {
  const { formatMessage } = useIntl()
  const { settings } = useApp()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentProps | null>(value)

  const paymentOptions: { payment: PaymentProps; name: string; permissions: boolean }[] = [
    {
      payment: { gateway: 'spgateway', method: 'credit' },
      name: formatMessage(checkoutMessages.label.credit),
      permissions: settings['payment.spgateway.credit.enable'] === '1',
    },
    {
      payment: { gateway: 'spgateway', method: 'vacc' },
      name: formatMessage(checkoutMessages.label.vacc),
      permissions: settings['payment.spgateway.vacc.enable'] === '1',
    },
    {
      payment: { gateway: 'spgateway', method: 'cvs' },
      name: formatMessage(checkoutMessages.label.cvs),
      permissions: settings['payment.spgateway.cvs.enable'] === '1',
    },
    {
      payment: { gateway: 'spgateway', method: 'instflag' },
      name: formatMessage(checkoutMessages.label.instFlag),
      permissions: settings['payment.spgateway.instflag.enable'] === '1',
    },
    {
      payment: { gateway: 'spgateway', method: 'unionpay' },
      name: formatMessage(checkoutMessages.label.unionPay),
      permissions: settings['payment.spgateway.unionpay.enable'] === '1',
    },
    {
      payment: { gateway: 'spgateway', method: 'webatm' },
      name: formatMessage(checkoutMessages.label.webAtm),
      permissions: settings['payment.spgateway.webatm.enable'] === '1',
    },
    {
      payment: { gateway: 'spgateway', method: 'barcode' },
      name: formatMessage(checkoutMessages.label.barcode),
      permissions: settings['payment.spgateway.barcode.enable'] === '1',
    },
    {
      payment: { gateway: 'paypal', method: 'credit' },
      name: formatMessage(checkoutMessages.label.paypal),
      permissions: settings['payment.paypal.credit.enable'] === '1',
    },
    {
      payment: { gateway: 'parenting', method: 'credit' },
      name: formatMessage(checkoutMessages.label.credit) + `(${formatMessage(checkoutMessages.label.parenting)})`,
      permissions: settings['payment.parenting.credit.enable'] === '1',
    },
    {
      payment: { gateway: 'commonhealth', method: 'credit' },
      name: formatMessage(checkoutMessages.label.credit),
      permissions: settings['payment.commonhealth.credit.enable'] === '1',
    },
  ]

  const handleChange = (paymentType?: PaymentProps | null) => {
    const currentPaymentOption = typeof paymentType === 'undefined' ? selectedPaymentMethod : paymentType
    typeof paymentType !== 'undefined' && setSelectedPaymentMethod(paymentType)
    if (currentPaymentOption) {
      localStorage.setItem('kolable.cart.payment.perpetual', JSON.stringify(currentPaymentOption))
      onChange?.(currentPaymentOption)
    }
  }

  return (
    <Form.Item
      className="mb-0"
      required
      validateStatus={isValidating && !selectedPaymentMethod ? 'error' : undefined}
      help={isValidating && !selectedPaymentMethod && formatMessage(checkoutMessages.label.paymentMethodPlaceholder)}
    >
      <StyledTitle>{formatMessage(checkoutMessages.label.paymentMethod)}</StyledTitle>
      <StyledDescription className="mb-4">{formatMessage(checkoutMessages.message.warningPayment)}</StyledDescription>
      <Select
        style={{ width: '50%' }}
        value={
          selectedPaymentMethod &&
          paymentOptions.some(
            options =>
              options.permissions &&
              options.payment.gateway === selectedPaymentMethod.gateway &&
              options.payment.method === selectedPaymentMethod.method,
          )
            ? JSON.stringify(selectedPaymentMethod)
            : undefined
        }
        onChange={(v: string) => v && handleChange(JSON.parse(v))}
        placeholder={formatMessage(checkoutMessages.label.paymentMethodPlaceholder)}
      >
        {paymentOptions
          .filter(option => option.permissions)
          .map(option => (
            <Select.Option value={JSON.stringify(option.payment)}>{option.name}</Select.Option>
          ))}
      </Select>
    </Form.Item>
  )
}

export default PaymentSelector
