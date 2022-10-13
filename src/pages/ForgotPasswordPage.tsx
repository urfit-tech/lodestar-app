import { Button, Form, Icon, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import axios from 'axios'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import MigrationInput from '../components/common/MigrationInput'
import { BREAK_POINT } from '../components/common/Responsive'
import DefaultLayout from '../components/layout/DefaultLayout'
import { handleError } from '../helpers'
import { codeMessages, commonMessages } from '../helpers/translation'

const StyledContainer = styled.div`
  padding: 4rem 1rem;
  color: #585858;

  .ant-form-explain {
    font-size: 14px;
  }

  @media (min-width: ${BREAK_POINT}px) {
    padding: 4rem;
  }
`
const StyledTitle = styled.h1`
  margin-bottom: 2rem;
  color: #585858;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  line-height: 1.6;
  letter-spacing: 0.8px;
`

const ForgotPasswordPage: React.VFC<FormComponentProps> = ({ form }) => {
  const { id: appId } = useApp()
  const { formatMessage } = useIntl()
  const history = useHistory()
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (error) {
        return
      }

      setLoading(true)
      const trimedEmail = values.email.trim()
      axios
        .post(`${process.env.REACT_APP_API_BASE_ROOT}/auth/forgot-password`, {
          appId,
          account: trimedEmail,
        })
        .then(({ data: { code } }) => {
          if (code === 'SUCCESS') {
            history.push(`/check-email?email=${trimedEmail}&type=forgot-password`)
          } else {
            message.error(formatMessage(codeMessages[code as keyof typeof codeMessages]))
          }
        })
        .catch(handleError)
        .finally(() => setLoading(false))
    })
  }

  return (
    <DefaultLayout noFooter centeredBox>
      <StyledContainer>
        <StyledTitle>{formatMessage(commonMessages.title.forgotPassword)}</StyledTitle>

        <Form onSubmit={handleSubmit}>
          <Form.Item>
            {form.getFieldDecorator('email', {
              validateTrigger: 'onSubmit',
              rules: [
                {
                  required: true,
                  message: formatMessage(commonMessages.form.message.enterEmail),
                },
                {
                  type: 'email',
                  message: formatMessage(commonMessages.form.message.emailFormat),
                },
              ],
            })(
              <MigrationInput
                placeholder={formatMessage(commonMessages.form.option.email)}
                suffix={<Icon type="mail" />}
              />,
            )}
          </Form.Item>
          <Form.Item className="m-0">
            <Button htmlType="submit" type="primary" block loading={loading}>
              {formatMessage(commonMessages.button.confirm)}
            </Button>
          </Form.Item>
        </Form>
      </StyledContainer>
    </DefaultLayout>
  )
}

export default Form.create<FormComponentProps>()(ForgotPasswordPage)
