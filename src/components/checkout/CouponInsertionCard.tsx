import { Button, Form, Input, message } from 'antd'
import { CardProps } from 'antd/lib/card'
import { FormComponentProps } from 'antd/lib/form'
import axios from 'axios'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { handleError } from '../../helpers'
import { checkoutMessages, codeMessages, commonMessages } from '../../helpers/translation'
import AdminCard from '../common/AdminCard'
import { BREAK_POINT } from '../common/Responsive'
import messages from './translation'

const StyledInput = styled(Input)`
  && {
    margin-bottom: 1rem;
    width: 100%;

    @media (min-width: ${BREAK_POINT}px) {
      margin-bottom: 0;
      width: auto;
    }
  }
`
const StyledFormItem = styled(Form.Item)`
  && {
    width: 100%;

    @media (min-width: ${BREAK_POINT}px) {
      width: auto;
    }
  }
`
const StyledButton = styled(Button)`
  && {
    width: 100%;

    @media (min-width: ${BREAK_POINT}px) {
      width: auto;
    }
  }
`

type CouponInsertionCardProps = CardProps &
  FormComponentProps & {
    onInsert?: () => void
  }
const CouponInsertionCard: React.VFC<CouponInsertionCardProps> = ({ form, onInsert, ...cardProps }) => {
  const { formatMessage } = useIntl()
  const { authToken } = useAuth()
  const [loading, setLoading] = useState(false)
  const [couponCode, setCouponCode] = useQueryParam('couponCode', StringParam)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        setLoading(true)
        axios
          .post(
            `${process.env.REACT_APP_API_BASE_ROOT}/payment/exchange`,
            {
              code: values.code.trim(),
              type: 'Coupon',
            },
            {
              headers: { authorization: `Bearer ${authToken}` },
            },
          )
          .then(({ data: { code } }) => {
            if (code === 'SUCCESS') {
              message.success(formatMessage(messages.CouponInsertionCard.addSuccess))
              onInsert && onInsert()
            } else {
              message.error(formatMessage(codeMessages[code as keyof typeof codeMessages]))
            }
            form.resetFields()
          })
          .catch(handleError)
          .finally(() => setLoading(false))
      }
    })
  }

  return (
    <AdminCard {...cardProps}>
      <Form layout="inline" onSubmit={handleSubmit}>
        <StyledFormItem label={formatMessage(checkoutMessages.form.label.addCoupon)}>
          {form.getFieldDecorator('code', { initialValue: couponCode, rules: [{ required: true }] })(<StyledInput />)}
        </StyledFormItem>
        <StyledFormItem>
          <StyledButton loading={loading} type="primary" htmlType="submit" disabled={!form.getFieldValue('code')}>
            {formatMessage(commonMessages.button.add)}
          </StyledButton>
        </StyledFormItem>
      </Form>
    </AdminCard>
  )
}

export default Form.create<CouponInsertionCardProps>()(CouponInsertionCard)
