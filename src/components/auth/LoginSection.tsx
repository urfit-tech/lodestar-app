import { Icon } from '@chakra-ui/react'
import { Button, Form, Input, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import React, { useContext, useState } from 'react'
import { AiOutlineLock, AiOutlineUser } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { useApp } from '../../containers/common/AppContext'
import { handleError } from '../../helpers'
import { authMessages, codeMessages, commonMessages } from '../../helpers/translation'
import { AuthState } from '../../types/member'
import { useAuth } from './AuthContext'
import { AuthModalContext, StyledAction, StyledDivider, StyledTitle } from './AuthModal'
import { FacebookLoginButton, GoogleLoginButton, LineLoginButton } from './SocialLoginButton'

const ForgetPassword = styled.div`
  margin-bottom: 1.5rem;
  font-size: 14px;
  text-align: right;

  a {
    color: #9b9b9b;
  }
`

type LoginSectionProps = FormComponentProps & {
  noGeneralLogin?: boolean
  onAuthStateChange: React.Dispatch<React.SetStateAction<AuthState>>
  renderTitle?: () => React.ReactNode
}
const LoginSection: React.FC<LoginSectionProps> = ({ form, noGeneralLogin, onAuthStateChange, renderTitle }) => {
  const { settings } = useApp()
  const { formatMessage } = useIntl()
  const history = useHistory()
  const [back] = useQueryParam('back', StringParam)
  const { login } = useAuth()
  const { setVisible } = useContext(AuthModalContext)
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    if (!login) {
      return
    }

    form.validateFields((error, values) => {
      if (error) {
        return
      }
      setLoading(true)
      login({
        account: values.account.trim().toLowerCase(),
        password: values.password,
      })
        .then(() => {
          setVisible && setVisible(false)
          form.resetFields()
          back && history.push(back)
        })
        .catch((error: Error) => {
          const code = error.message as keyof typeof codeMessages
          message.error(formatMessage(codeMessages[code]))
        })
        .catch(handleError)
        .finally(() => setLoading(false))
    })
  }

  return (
    <>
      {renderTitle ? renderTitle() : <StyledTitle>{formatMessage(authMessages.title.login)}</StyledTitle>}
      <div className="d-grid gap-3 mb-3">
        {!!settings['auth.facebook_app_id'] && <FacebookLoginButton />}
        {!!settings['auth.line_client_id'] && <LineLoginButton />}
        {!!settings['auth.google_client_id'] && <GoogleLoginButton />}
      </div>
      {!noGeneralLogin && (
        <>
          {(!!settings['auth.facebook_app_id'] || !!settings['auth.google_client_id']) && (
            <StyledDivider>{formatMessage(commonMessages.defaults.or)}</StyledDivider>
          )}

          <Form
            onSubmit={e => {
              e.preventDefault()
              handleLogin()
            }}
          >
            <Form.Item>
              {form.getFieldDecorator('account', {
                rules: [
                  {
                    required: true,
                    message: formatMessage(commonMessages.form.message.usernameAndEmail),
                  },
                ],
              })(
                <Input
                  placeholder={formatMessage(commonMessages.form.message.usernameAndEmail)}
                  suffix={<Icon as={AiOutlineUser} />}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {form.getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: formatMessage(commonMessages.form.message.password),
                  },
                ],
              })(
                <Input
                  type="password"
                  placeholder={formatMessage(commonMessages.form.placeholder.password)}
                  suffix={<Icon as={AiOutlineLock} />}
                />,
              )}
            </Form.Item>
            <ForgetPassword>
              <Link to="/forgot-password">{formatMessage(authMessages.link.forgotPassword)}</Link>
            </ForgetPassword>
            <Form.Item>
              <Button block loading={loading} type="primary" htmlType="submit">
                {formatMessage(commonMessages.button.login)}
              </Button>
            </Form.Item>

            <StyledAction>
              <span>{formatMessage(authMessages.content.noMember)}</span>
              <Button type="link" size="small" onClick={() => onAuthStateChange('register')}>
                {formatMessage(commonMessages.button.signUp)}
              </Button>
            </StyledAction>
          </Form>
        </>
      )}
    </>
  )
}

export default Form.create<LoginSectionProps>()(LoginSection)
