import { Button, Form, Input } from 'antd'
import { CardProps } from 'antd/lib/card'
import { FormComponentProps } from 'antd/lib/form'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { commonMessages, voucherMessages } from '../../helpers/translation'
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
    onInsert?: (setLoading: React.Dispatch<React.SetStateAction<boolean>>, code: string) => void
  }
const VoucherInsertBlock: React.VFC<VoucherInsertBlockProps> = ({ form, onInsert, ...cardProps }) => {
  const [loading, setLoading] = useState(false)
  const { formatMessage } = useIntl()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    form.validateFields((err, values) => {
      if (err) {
        return
      }

      if (onInsert) {
        onInsert(setLoading, values.code)
        form.resetFields()
      }
    })
  }

  return (
    <AdminCard {...cardProps}>
      <Form layout="inline" onSubmit={handleSubmit}>
        <StyledFormItem label={formatMessage(voucherMessages.title.addVoucher)}>
          {form.getFieldDecorator('code', { rules: [{ required: true }] })(
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
