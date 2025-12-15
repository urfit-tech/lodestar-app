import { Button, Icon, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { message, Modal } from 'antd'
import { CommonTitleMixin } from 'lodestar-app-element/src/components/common'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { BackendServerError } from 'lodestar-app-element/src/helpers/error'
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineUser } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { authMessages, codeMessages, commonMessages } from '../../../helpers/translation'
import { AuthState } from '../../../types/member'
import { AuthModalContext, StyledAction, StyledTitle } from '../AuthModal'

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

const SafeLoginSection: React.FC<{
  noGeneralLogin?: boolean
  isBusinessMember?: boolean
  onAuthStateChange?: React.Dispatch<React.SetStateAction<AuthState>>
  accountLinkToken?: string
  renderTitle?: () => React.ReactNode
}> = ({ noGeneralLogin, isBusinessMember, onAuthStateChange, accountLinkToken, renderTitle }) => {
  const { settings } = useApp()
  const { formatMessage } = useIntl()
  const history = useHistory()
  const [returnTo] = useQueryParam('returnTo', StringParam)
  const { login } = useAuth()
  const { setVisible: setAuthModalVisible, setIsBusinessMember } = useContext(AuthModalContext)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      account: '',
      password: '',
    },
  })
  const [passwordShow, setPasswordShow] = useState(false)

  const handleSafeLogin = handleSubmit(
    async ({ account, password }) => {
      if (login === undefined) {
        return
      }
      setLoading(true)
      login({
        account: account.trim().toLowerCase(),
        password: password,
      })
        .then(() => {
          sessionStorage.setItem('safe-login', '1')
          setAuthModalVisible?.(false)
          reset()
          returnTo && history.push(returnTo)
        })
        .catch(error => {
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

  return (
    <>
      {renderTitle ? renderTitle() : <StyledTitle>{formatMessage(authMessages.title.safeLogin)}</StyledTitle>}
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
          ref={register({ required: formatMessage(commonMessages.form.message.pinCode) })}
          placeholder={formatMessage(commonMessages.form.message.pinCode)}
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
      <ForgetPassword>{formatMessage(authMessages.link.noPinCode)}</ForgetPassword>
      <Button variant="primary" isFullWidth isLoading={loading} onClick={handleSafeLogin}>
        {formatMessage(commonMessages.button.login)}
      </Button>
      <StyledAction>
        <span>{formatMessage(isBusinessMember ? authMessages.content.noCompany : authMessages.content.noMember)}</span>
        <Button
          colorScheme="primary"
          variant="ghost"
          size="sm"
          lineHeight="unset"
          onClick={() => onAuthStateChange?.('register')}
        >
          {formatMessage(isBusinessMember ? commonMessages.button.instantlySignUp : commonMessages.button.signUp)}
        </Button>
      </StyledAction>
    </>
  )
}

export default SafeLoginSection
