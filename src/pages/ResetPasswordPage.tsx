import { Button, Form, Icon, Input, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import axios from 'axios'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { useAuth } from '../components/auth/AuthContext'
import { BREAK_POINT } from '../components/common/Responsive'
import DefaultLayout from '../components/layout/DefaultLayout'
import { handleError } from '../helpers'
import { codeMessages, commonMessages, usersMessages } from '../helpers/translation'

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

const ResetPasswordPage: React.VFC<FormComponentProps> = ({ form }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const [token] = useQueryParam('token', StringParam)
  const { apiHost } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.validateFields((error, values) => {
      if (!error) {
        setLoading(true)
        axios
          .post(
            `//${apiHost}/auth/reset-password`,
            { newPassword: values.password },
            {
              headers: { authorization: `Bearer ${token}` },
            },
          )
          .then(({ data: { code } }) => {
            if (code === 'SUCCESS') {
              history.push('/reset-password-success')
            } else {
              message.error(formatMessage(codeMessages[code as keyof typeof codeMessages]))
            }
          })
          .catch(handleError)
          .finally(() => setLoading(false))
      }
    })
  }

  // FIXME: set auth token to reset password
  // useEffect(() => {
  //   try {
  //     localStorage.removeItem(`${localStorage.getItem('kolable.app.id')}.auth.token`)
  //   } catch (error) {}
  //   setAuthToken && setAuthToken(null)
  // }, [setAuthToken])

  return (
    <DefaultLayout noFooter centeredBox>
      <StyledContainer>
        <StyledTitle>{formatMessage(usersMessages.title.resetPassword)}</StyledTitle>
        <Form onSubmit={handleSubmit}>
          <Form.Item>
            {form.getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: formatMessage(usersMessages.messages.enterPassword),
                },
              ],
            })(
              <Input
                type="password"
                placeholder={formatMessage(usersMessages.placeholder.enterNewPassword)}
                suffix={<Icon type="lock" />}
              />,
            )}
          </Form.Item>
          <Form.Item>
            {form.getFieldDecorator('passwordCheck', {
              validateTrigger: 'onSubmit',
              rules: [
                {
                  required: true,
                  message: formatMessage(usersMessages.messages.confirmPassword),
                },
                {
                  validator: (rule, value, callback) => {
                    if (value && value !== form.getFieldValue('password')) {
                      callback(formatMessage(usersMessages.messages.confirmPassword))
                    } else {
                      callback()
                    }
                  },
                },
              ],
            })(
              <Input
                type="password"
                placeholder={formatMessage(usersMessages.placeholder.enterNewPasswordAgain)}
                suffix={<Icon type="lock" />}
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

export default Form.create<FormComponentProps>()(ResetPasswordPage)
