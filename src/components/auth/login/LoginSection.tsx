import { Button, Icon, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { message, Modal } from 'antd'
import { AxiosError } from 'axios'
import { CommonTitleMixin } from 'lodestar-app-element/src/components/common'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { BackendServerError, BindDeviceError, LoginDeviceError } from 'lodestar-app-element/src/helpers/error'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineUser } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { handleError } from '../../../helpers'
import { authMessages, codeMessages, commonMessages } from '../../../helpers/translation'
import { AuthState } from '../../../types/member'
import { AuthModalContext, StyledAction, StyledDivider, StyledTitle } from '../AuthModal'
import { FacebookLoginButton, GoogleLoginButton, LineLoginButton, ParentingLoginButton } from '../SocialLoginButton'
import * as localAuthMessages from '../translation'
import OverBindDeviceModal from './OverBindDeviceModal'
import OverLoginDeviceModal from './OverLoginDeviceModal'

const ForgetPassword = styled.div`
  margin-bottom: 1.5rem;
  font-size: 14px;
  text-align: right;

  a {
    color: #9b9b9b;
  }
`

export const StyledModal = styled(Modal)`
  && .ant-modal-footer {
    border-top: 0;
    padding: 0 1.5rem 1.5rem;
  }
`

export const StyledModalTitle = styled.div`
  ${CommonTitleMixin}
`

const LoginSection: React.FC<{
  noGeneralLogin?: boolean
  isBusinessMember?: boolean
  onAuthStateChange: React.Dispatch<React.SetStateAction<AuthState>>
  accountLinkToken?: string
  renderTitle?: () => React.ReactNode
}> = ({ noGeneralLogin, isBusinessMember, onAuthStateChange, accountLinkToken, renderTitle }) => {
  const { settings } = useApp()
  const { formatMessage } = useIntl()
  const tracking = useTracking()
  const history = useHistory()
  const [returnTo] = useQueryParam('returnTo', StringParam)
  const { login, forceLogin } = useAuth()
  const { setVisible: setAuthModalVisible, setIsBusinessMember } = useContext(AuthModalContext)
  const [loading, setLoading] = useState(false)
  const [forceLoginLoading, setForceLoginLoading] = useState(false)
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      account: '',
      password: '',
    },
  })
  const [isOverLoginDeviceModalVisible, setIsOverLoginDeviceModalVisible] = useState(false)
  const [isOverBindDeviceModalVisible, setIsOverBindDeviceModalVisible] = useState(false)
  const [passwordShow, setPasswordShow] = useState(false)

  const handleLogin = handleSubmit(
    async ({ account, password }) => {
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
          setAuthModalVisible?.(false)
          reset()
          returnTo && history.push(returnTo)
        })
        .catch(error => {
          if (error instanceof LoginDeviceError) {
            setIsOverLoginDeviceModalVisible(true)
          }
          if (error instanceof BindDeviceError) {
            setIsOverBindDeviceModalVisible(true)
          }
          if (error instanceof BackendServerError) {
            const code = error.code as keyof typeof codeMessages
            message.error(formatMessage(codeMessages[code]))
          } else {
            message.error(error.message)
          }
        })
        .finally(() => setLoading(false))
    },
    error => {
      console.error(error)
    },
  )

  const handleForceLogin = handleSubmit(
    ({ account, password }) => {
      if (forceLogin === undefined) {
        return
      }

      setForceLoginLoading(true)

      forceLogin({
        account: account.trim().toLowerCase(),
        password: password,
        accountLinkToken: accountLinkToken,
      })
        .then(() => {
          tracking.login()
          setAuthModalVisible?.(false)
          reset()
          returnTo && history.push(returnTo)
          message.success(formatMessage(localAuthMessages.default.LoginSection.loginSuccess))
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
        .finally(() => {
          setLoading(false)
          setIsBusinessMember?.(false)
          setForceLoginLoading(false)
        })
    },
    error => {
      console.error(error)
    },
  )
  return (
    <>
      {renderTitle ? renderTitle() : <StyledTitle>{formatMessage(authMessages.title.login)}</StyledTitle>}

      {!isBusinessMember && !!settings['auth.parenting.client_id'] && (
        <div className="mb-3" style={{ width: '100%' }}>
          <ParentingLoginButton accountLinkToken={accountLinkToken} />
        </div>
      )}
      {!isBusinessMember && !!settings['auth.facebook_app_id'] && (
        <div className="mb-3" style={{ width: '100%' }}>
          <FacebookLoginButton accountLinkToken={accountLinkToken} />
        </div>
      )}
      {!isBusinessMember && !!settings['auth.line_client_id'] && !!settings['auth.line_client_secret'] && (
        <div className="mb-3" style={{ width: '100%' }}>
          <LineLoginButton accountLinkToken={accountLinkToken} />
        </div>
      )}
      {!isBusinessMember && !!settings['auth.google_client_id'] && (
        <div className="mb-3" style={{ width: '100%' }}>
          <GoogleLoginButton accountLinkToken={accountLinkToken} />
        </div>
      )}

      {!noGeneralLogin && !(settings['auth.email.disabled'] === '1') && (
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
              type={passwordShow ? 'text' : 'password'}
              name="password"
              ref={register({ required: formatMessage(commonMessages.form.message.password) })}
              placeholder={formatMessage(commonMessages.form.message.password)}
            />
            <InputRightElement
              children={
                <Icon
                  className="cursor-pointer"
                  as={passwordShow ? AiOutlineEye : AiOutlineEyeInvisible}
                  onClick={() => setPasswordShow(!passwordShow)}
                />
              }
            />
          </InputGroup>
          <ForgetPassword>
            <Link to="/forgot-password">{formatMessage(authMessages.link.forgotPassword)}</Link>
          </ForgetPassword>
          <Button variant="primary" isFullWidth isLoading={loading} onClick={handleLogin}>
            {formatMessage(commonMessages.button.login)}
          </Button>
          <StyledAction>
            <span>
              {formatMessage(isBusinessMember ? authMessages.content.noCompany : authMessages.content.noMember)}
            </span>
            <Button
              colorScheme="primary"
              variant="ghost"
              size="sm"
              lineHeight="unset"
              onClick={() => onAuthStateChange('register')}
            >
              {formatMessage(isBusinessMember ? commonMessages.button.instantlySignUp : commonMessages.button.signUp)}
            </Button>
          </StyledAction>
          <OverLoginDeviceModal
            visible={isOverLoginDeviceModalVisible}
            onClose={() => setIsOverLoginDeviceModalVisible(false)}
            onOk={handleForceLogin}
            loading={forceLoginLoading}
          />
          <OverBindDeviceModal
            visible={isOverBindDeviceModalVisible}
            onClose={() => {
              setIsOverBindDeviceModalVisible(false)
              setLoading(false)
            }}
          />{' '}
        </>
      )}
    </>
  )
}

export default LoginSection
