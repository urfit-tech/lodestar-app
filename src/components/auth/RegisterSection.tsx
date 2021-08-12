import { Button, Icon } from '@chakra-ui/react'
import { Form, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineLock, AiOutlineMail, AiOutlinePhone, AiOutlineUser } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import { useCustomRenderer } from '../../contexts/CustomRendererContext'
import { handleError } from '../../helpers'
import { authMessages, codeMessages, commonMessages } from '../../helpers/translation'
import { AuthState } from '../../types/member'
import MigrationInput from '../common/MigrationInput'
import { useAuth } from './AuthContext'
import { AuthModalContext, StyledAction, StyledDivider, StyledTitle } from './AuthModal'
import { FacebookLoginButton, GoogleLoginButton, LineLoginButton } from './SocialLoginButton'

const StyledParagraph = styled.p`
  color: var(--gray-dark);
  font-size: 14px;
`
type RegisterSectionProps = FormComponentProps & {
  onAuthStateChange: React.Dispatch<React.SetStateAction<AuthState>>
}
const RegisterSection: React.VFC<RegisterSectionProps> = ({ form, onAuthStateChange }) => {
  const { settings, enabledModules } = useApp()
  const { formatMessage } = useIntl()
  const { register, sendSmsCode, verifySmsCode } = useAuth()
  const { setVisible } = useContext(AuthModalContext)
  const { renderRegisterTerm } = useCustomRenderer()

  const [loading, setLoading] = useState(false)
  const [sendingState, setSendingState] = useState<'idle' | 'loading' | 'ready'>('ready')
  const [verifying, setVerifying] = useState(false)
  const [authState, setAuthState] = useState<'sms_verification' | 'register'>()

  useEffect(() => {
    setAuthState(enabledModules.sms_verification ? 'sms_verification' : 'register')
  }, [enabledModules.sms_verification])

  const handleSmsSend = () => {
    const phoneNumber = form.getFieldValue('phoneNumber')
    if (sendSmsCode && phoneNumber) {
      setSendingState('loading')
      sendSmsCode({ phoneNumber })
        .then(() => {
          setSendingState('idle')
          // TODO: locale
          message.success('成功發送簡訊碼')
          setTimeout(() => {
            setSendingState('ready')
          }, 30000)
        })
        .catch(error => {
          setSendingState('ready')
          message.error(error.message)
        })
    } else {
      // TODO: locale
      message.error('請輸入手機號碼')
    }
  }
  const handleSmsVerify = () => {
    verifySmsCode &&
      form.validateFields((error, values) => {
        if (error) {
          return
        }
        setVerifying(true)
        verifySmsCode({ phoneNumber: values.phoneNumber.trim(), code: values.code })
          .then(() => {
            setAuthState('register')
            sessionStorage.setItem('phone', values.phoneNumber.trim())
          })
          .catch((error: Error) => {
            message.error('簡訊驗證失敗')
          })
          .finally(() => setVerifying(false))
      })
  }

  const handleRegister = () => {
    register &&
      form.validateFields((error, values) => {
        if (error) {
          return
        }
        setLoading(true)
        register({
          username: values.username.trim().toLowerCase(),
          email: values.email.trim().toLowerCase(),
          password: values.password,
        })
          .then(() => {
            setVisible?.(false)
            form.resetFields()
          })
          .catch((error: Error) => {
            const code = error.message as keyof typeof codeMessages
            message.error(formatMessage(codeMessages[code]))
          })
          .catch(handleError)
          .finally(() => setLoading(false))
      })
  }

  if (!authState) {
    return <></>
  }

  if (authState === 'sms_verification') {
    return (
      <>
        <StyledTitle>{formatMessage(authMessages.title.smsVerification)}</StyledTitle>
        <Form
          onSubmit={e => {
            e.preventDefault()
            handleSmsVerify()
          }}
        >
          <Form.Item>
            {form.getFieldDecorator('phoneNumber', {
              rules: [
                {
                  required: true,
                  message: formatMessage(commonMessages.form.message.phone),
                },
              ],
            })(
              <MigrationInput
                placeholder={formatMessage(commonMessages.form.placeholder.phone)}
                suffix={<Icon as={AiOutlinePhone} />}
              />,
            )}
          </Form.Item>

          <Form.Item>
            {form.getFieldDecorator('code', {
              rules: [
                {
                  required: true,
                  message: formatMessage(commonMessages.form.message.smsVerification),
                },
              ],
            })(
              <MigrationInput
                placeholder={formatMessage(commonMessages.form.placeholder.smsVerification)}
                suffix={<AiOutlineMail />}
              />,
            )}
          </Form.Item>

          <Form.Item>
            <Button
              type="button"
              variant="outline"
              isFullWidth
              isLoading={sendingState === 'loading'}
              onClick={handleSmsSend}
              isDisabled={sendingState === 'idle'}
            >
              {sendingState === 'idle'
                ? formatMessage(commonMessages.button.sendSmsIdle)
                : formatMessage(commonMessages.button.sendSms)}
            </Button>
          </Form.Item>
          <Form.Item>
            <Button colorScheme="primary" type="submit" isFullWidth block loading={verifying}>
              {formatMessage(commonMessages.button.verifySms)}
            </Button>
          </Form.Item>
          <StyledAction>
            <span>{formatMessage(authMessages.content.isMember)}</span>
            <Button
              colorScheme="primary"
              variant="ghost"
              size="sm"
              lineHeight="unset"
              onClick={() => onAuthStateChange('login')}
            >
              {formatMessage(commonMessages.button.login)}
            </Button>
          </StyledAction>
        </Form>
      </>
    )
  }

  return (
    <>
      <StyledTitle>{formatMessage(authMessages.title.signUp)}</StyledTitle>

      {!!settings['auth.facebook_app_id'] && (
        <div className="mb-3">
          <FacebookLoginButton />
        </div>
      )}
      {!!settings['auth.line_client_id'] && !!settings['auth.line_client_secret'] && (
        <div className="mb-3">
          <LineLoginButton />
        </div>
      )}
      {!!settings['auth.google_client_id'] && (
        <div className="mb-3">
          <GoogleLoginButton />
        </div>
      )}

      {(!!settings['auth.facebook_app_id'] ||
        !!settings['auth.google_client_id'] ||
        (!!settings['auth.line_client_id'] && !!settings['auth.line_client_secret'])) && (
        <StyledDivider>{formatMessage(commonMessages.defaults.or)}</StyledDivider>
      )}

      <Form
        onSubmit={e => {
          e.preventDefault()
          handleRegister()
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
            <MigrationInput
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
            <MigrationInput
              placeholder={formatMessage(commonMessages.form.placeholder.email)}
              suffix={<AiOutlineMail />}
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
            <MigrationInput
              type="password"
              placeholder={formatMessage(commonMessages.form.placeholder.password)}
              suffix={<AiOutlineLock />}
            />,
          )}
        </Form.Item>
        <StyledParagraph>
          {renderRegisterTerm?.() || (
            <span>
              {formatMessage(authMessages.content.registration)}
              <a href="/terms" target="_blank" rel="noopener noreferrer" className="ml-1">
                {formatMessage(authMessages.content.term)}
              </a>
            </span>
          )}
        </StyledParagraph>
        <Form.Item>
          <Button colorScheme="primary" type="submit" isFullWidth isLoading={loading}>
            {formatMessage(commonMessages.button.signUp)}
          </Button>
        </Form.Item>
      </Form>

      <StyledAction>
        <span>{formatMessage(authMessages.content.isMember)}</span>
        <Button
          colorScheme="primary"
          variant="ghost"
          size="sm"
          lineHeight="unset"
          onClick={() => onAuthStateChange('login')}
        >
          {formatMessage(commonMessages.button.login)}
        </Button>
      </StyledAction>
    </>
  )
}

export default Form.create<RegisterSectionProps>()(RegisterSection)
