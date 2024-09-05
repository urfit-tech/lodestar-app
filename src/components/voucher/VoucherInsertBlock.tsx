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
import { codeMessages, commonMessages, voucherMessages } from '../../helpers/translation'
import AdminCard from '../common/AdminCard'
import { BREAK_POINT } from '../common/Responsive'

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

const StyledButton = styled(Button)`
  && {
    width: 100%;

    @media (min-width: ${BREAK_POINT}px) {
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

type VoucherInsertBlockProps = CardProps &
  FormComponentProps & {
    onRefetch?: () => void
  }
const VoucherInsertBlock: React.VFC<VoucherInsertBlockProps> = ({ form, onRefetch, ...cardProps }) => {
  const { formatMessage } = useIntl()
  const { authToken, currentMemberId } = useAuth()
  const [loading, setLoading] = useState(false)
  const [voucherCode] = useQueryParam('voucherCode', StringParam)

  const handleInsert = (setLoading: React.Dispatch<React.SetStateAction<boolean>>, voucherCode: string) => {
    if (!currentMemberId) {
      return
    }

    setLoading(true)
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_ROOT}/payment/exchange`,
        {
          code: voucherCode.trim(),
          type: 'Voucher',
        },
        {
          headers: { authorization: `Bearer ${authToken}` },
        },
      )
      .then(({ data: { code } }) => {
        if (code === 'SUCCESS') {
          message.success(formatMessage(voucherMessages.messages.addVoucher))
          onRefetch?.()
        } else {
          message.error(formatMessage(codeMessages[code as keyof typeof codeMessages]))
        }
      })
      .catch(handleError)
      .finally(() => setLoading(false))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    form.validateFields((err, values) => {
      if (err) {
        return
      }

      handleInsert(setLoading, values.code)
      form.resetFields()
    })
  }

  return (
    <AdminCard {...cardProps}>
      <Form layout="inline" onSubmit={handleSubmit}>
        <StyledFormItem label={formatMessage(voucherMessages.title.addVoucher)}>
          {form.getFieldDecorator('code', { initialValue: voucherCode, rules: [{ required: true }] })(
            <StyledInput
              placeholder={formatMessage(voucherMessages.form.placeholder.voucherEnter)}
              autoComplete="off"
            />,
          )}
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

export default Form.create<VoucherInsertBlockProps>()(VoucherInsertBlock)
