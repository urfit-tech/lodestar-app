import { Icon } from '@chakra-ui/react'
import { Button, Form, Input, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import React, { useContext, useState } from 'react'
import { AiOutlineUser } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import { handleError } from '../../helpers'
import { authMessages, codeMessages, commonMessages } from '../../helpers/translation'
import { AuthState } from '../../types/member'
import { useAuth } from './AuthContext'
import { AuthModalContext, StyledAction, StyledDivider, StyledTitle } from './AuthModal'
import { FacebookLoginButton, GoogleLoginButton } from './SocialLoginButton'

const StyledParagraph = styled.p`
  color: var(--gray-dark);
  font-size: 14px;
`
type RegisterSectionProps = FormComponentProps & {
  onAuthStateChange: React.Dispatch<React.SetStateAction<AuthState>>
}
const RegisterSection: React.FC<RegisterSectionProps> = ({ form, onAuthStateChange }) => {
  const { id: appId, settings } = useApp()
  const { formatMessage } = useIntl()
  const { register } = useAuth()
  const { setVisible } = useContext(AuthModalContext)
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    if (!register) {
      return
    }

    form.validateFields((error, values) => {
      if (error) {
        return
      }
      setLoading(true)
      register({
        appId,
        username: values.username.trim().toLowerCase(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      })
        .then(() => {
          setVisible && setVisible(false)
          form.resetFields()
        })
        .catch((error: Error) => {
          const code = error.message as keyof typeof codeMessages
          message.error(formatMessage(codeMessages[code]))
        })
        .catch(err => handleError(err))
        .finally(() => setLoading(false))
    })
  }

  return (
    <>
      <StyledTitle>{formatMessage(authMessages.title.signUp)}</StyledTitle>

      {!!settings['auth.facebook_app_id'] && (
        <div className="mb-3">
          <FacebookLoginButton />
        </div>
      )}
      {!!settings['auth.google_client_id'] && (
        <div className="mb-3">
          <GoogleLoginButton />
        </div>
      )}
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
          {form.getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: formatMessage(commonMessages.form.message.username),
              },
            ],
          })(
            <Input
              placeholder={formatMessage(commonMessages.form.placeholder.username)}
              suffix={<Icon as={AiOutlineUser} />}
            />,
          )}
        </Form.Item>
        <Form.Item>
          {form.getFieldDecorator('email', {
            rules: [
              {
                required: true,
                message: formatMessage(commonMessages.form.message.email),
              },
              {
                type: 'email',
                message: formatMessage(commonMessages.form.message.emailFormatMessage),
              },
            ],
          })(
            <Input placeholder={formatMessage(commonMessages.form.placeholder.email)} suffix={<Icon type="mail" />} />,
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
              suffix={<Icon type="lock" />}
            />,
          )}
        </Form.Item>
        <StyledParagraph>
          <span>{formatMessage(authMessages.content.registration)}</span>
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="ml-1">
            {formatMessage(authMessages.content.term)}
          </a>
        </StyledParagraph>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {formatMessage(commonMessages.button.signUp)}
          </Button>
        </Form.Item>
      </Form>

      <StyledAction>
        <span>{formatMessage(authMessages.content.noMember)}</span>
        <Button type="link" size="small" onClick={() => onAuthStateChange('login')}>
          {formatMessage(commonMessages.button.login)}
        </Button>
      </StyledAction>
    </>
  )
}

export default Form.create<RegisterSectionProps>()(RegisterSection)
