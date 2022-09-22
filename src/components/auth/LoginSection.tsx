import { Button, Icon, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { message } from 'antd'
import { AxiosError } from 'axios'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineLock, AiOutlineUser } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { handleError } from '../../helpers'
import { authMessages, codeMessages, commonMessages } from '../../helpers/translation'
import { AuthState } from '../../types/member'
import { AuthModalContext, StyledAction, StyledDivider, StyledTitle } from './AuthModal'
import { FacebookLoginButton, GoogleLoginButton, LineLoginButton, ParentingLoginButton } from './SocialLoginButton'

const ForgetPassword = styled.div`
  margin-bottom: 1.5rem;
  font-size: 14px;
  text-align: right;

  a {
    color: #9b9b9b;
  }
`

const LoginSection: React.VFC<{
  noGeneralLogin?: boolean
  onAuthStateChange: React.Dispatch<React.SetStateAction<AuthState>>
  accountLinkToken?: string
  renderTitle?: () => React.ReactNode
}> = ({ noGeneralLogin, onAuthStateChange, accountLinkToken, renderTitle }) => {
  const { settings } = useApp()
  const { formatMessage } = useIntl()
  const tracking = useTracking()
  const history = useHistory()
  const [back] = useQueryParam('back', StringParam)
  const { login } = useAuth()
  const { setVisible } = useContext(AuthModalContext)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      account: '',
      password: '',
    },
  })

  const handleLogin = handleSubmit(
    ({ account, password }) => {
      if (login === undefined) {
        return
      }

      setLoading(true)
      login({
        account: account.trim().toLowerCase(),
        password: password,
        accountLinkToken: accountLinkToken,
      })
        .then(() => {
          tracking.login()
          setVisible?.(false)
          reset()
          back && history.push(back)
        })
        .catch((error: AxiosError) => {
          if (error.isAxiosError && error.response) {
            const code = error.response.data.code as keyof typeof codeMessages
            message.error(formatMessage(codeMessages[code]))
          } else {
            message.error(error.message)
          }
        })
        .catch(handleError)
        .finally(() => setLoading(false))
    },
    error => {
      console.error(error)
    },
  )

  return (
    <>
      {renderTitle ? renderTitle() : <StyledTitle>{formatMessage(authMessages.title.login)}</StyledTitle>}

      {!!settings['auth.parenting.client_id'] && (
        <div className="mb-3" style={{ width: '100%' }}>
          <ParentingLoginButton accountLinkToken={accountLinkToken} />
        </div>
      )}
      {!!settings['auth.facebook_app_id'] && (
        <div className="mb-3" style={{ width: '100%' }}>
          <FacebookLoginButton accountLinkToken={accountLinkToken} />
        </div>
      )}
      {!!settings['auth.line_client_id'] && !!settings['auth.line_client_secret'] && (
        <div className="mb-3" style={{ width: '100%' }}>
          <LineLoginButton accountLinkToken={accountLinkToken} />
        </div>
      )}
      {!!settings['auth.google_client_id'] && (
        <div className="mb-3" style={{ width: '100%' }}>
          <GoogleLoginButton accountLinkToken={accountLinkToken} />
        </div>
      )}

      {!noGeneralLogin && !(settings['auth.email.disabled'] === 'true') && (
        <>
          {!!settings['auth.facebook_app_id'] ||
            !!settings['auth.google_client_id'] ||
            (!!settings['auth.line_client_id'] && !!settings['auth.line_client_secret'] && (
              <StyledDivider>{formatMessage(commonMessages.defaults.or)}</StyledDivider>
            ))}

          <InputGroup className="mb-3">
            <Input
              name="account"
              ref={register({ required: formatMessage(commonMessages.form.message.usernameAndEmail) })}
              placeholder={formatMessage(commonMessages.form.message.usernameAndEmail)}
            />
            <InputRightElement children={<Icon as={AiOutlineUser} />} />
          </InputGroup>

          <InputGroup className="mb-3">
            <Input
              type="password"
              name="password"
              ref={register({ required: formatMessage(commonMessages.form.message.password) })}
              placeholder={formatMessage(commonMessages.form.message.password)}
            />
            <InputRightElement children={<Icon as={AiOutlineLock} />} />
          </InputGroup>

          <ForgetPassword>
            <Link to="/forgot-password">{formatMessage(authMessages.link.forgotPassword)}</Link>
          </ForgetPassword>

          <Button variant="primary" isFullWidth isLoading={loading} onClick={handleLogin}>
            {formatMessage(commonMessages.button.login)}
          </Button>

          <StyledAction>
            <span>{formatMessage(authMessages.content.noMember)}</span>
            <Button
              colorScheme="primary"
              variant="ghost"
              size="sm"
              lineHeight="unset"
              onClick={() => onAuthStateChange('register')}
            >
              {formatMessage(commonMessages.button.signUp)}
            </Button>
          </StyledAction>
        </>
      )}
    </>
  )
}

export default LoginSection
