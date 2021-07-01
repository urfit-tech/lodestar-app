import { Button, Form, Input, message } from 'antd'
import { CardProps } from 'antd/lib/card'
import { FormComponentProps } from 'antd/lib/form'
import axios from 'axios'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { handleError } from '../../helpers'
import { checkoutMessages, codeMessages, commonMessages } from '../../helpers/translation'
import { useAuth } from '../auth/AuthContext'
import AdminCard from '../common/AdminCard'

type CouponInsertionCardProps = CardProps &
  FormComponentProps & {
    onInsert?: () => void
  }
const CouponInsertionCard: React.VFC<CouponInsertionCardProps> = ({ form, onInsert, ...cardProps }) => {
  const { formatMessage } = useIntl()
  const { authToken, apiHost } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        setLoading(true)
        axios
          .post(
            `//${apiHost}/payment/exchange`,
            {
              code: values.code,
              type: 'Coupon',
            },
            {
              headers: { authorization: `Bearer ${authToken}` },
            },
          )
          .then(({ data: { code } }) => {
            if (code === 'SUCCESS') {
              message.success(formatMessage(codeMessages[code as keyof typeof codeMessages]))
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
        <Form.Item label={formatMessage(checkoutMessages.form.label.addCoupon)}>
          {form.getFieldDecorator('code', { rules: [{ required: true }] })(<Input />)}
        </Form.Item>
        <Form.Item>
          <Button loading={loading} type="primary" htmlType="submit" disabled={!form.getFieldValue('code')}>
            {formatMessage(commonMessages.button.add)}
          </Button>
        </Form.Item>
      </Form>
    </AdminCard>
  )
}

export default Form.create<CouponInsertionCardProps>()(CouponInsertionCard)
