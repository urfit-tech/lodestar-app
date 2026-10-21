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
import { formatAuthError, readAuthResponse } from '../helpers/authResponse'
import { commonMessages } from '../helpers/translation'
import { authCooldownKey, useAuthCooldown } from '../hooks/authCooldown'

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

const ForgotPasswordPage: React.FC<FormComponentProps> = ({ form }) => {
  const { id: appId } = useApp()
  const { formatMessage } = useIntl()
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const { remaining, start } = useAuthCooldown(authCooldownKey(appId, 'reset', email))

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading || remaining) return
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
        .then(({ data }) => {
          const { code } = data
          if (code === 'SUCCESS' || code === 'E_NO_MEMBER') {
            const seconds = readAuthResponse(data).retryAfter || 60
            start(seconds)
            message.info(formatAuthError({ retryAfter: seconds }, formatMessage))
            history.push(`/check-email?email=${encodeURIComponent(trimedEmail)}&type=forgot-password`)
          } else {
            throw data
          }
        })
        .catch(error => {
          const seconds = readAuthResponse(error).retryAfter
          if (seconds) start(seconds)
          message.error(formatAuthError(error, formatMessage))
        })
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
                onChange={event => setEmail(event.target.value)}
                placeholder={formatMessage(commonMessages.form.option.email)}
                suffix={<Icon type="mail" />}
              />,
            )}
          </Form.Item>
          <Form.Item className="m-0">
            <Button htmlType="submit" type="primary" block loading={loading} disabled={remaining > 0}>
              {remaining > 0
                ? formatAuthError({ retryAfter: remaining }, formatMessage)
                : formatMessage(commonMessages.button.confirm)}
            </Button>
          </Form.Item>
        </Form>
      </StyledContainer>
    </DefaultLayout>
  )
}

export default Form.create<FormComponentProps>()(ForgotPasswordPage)
