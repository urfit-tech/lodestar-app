import { Icon } from '@chakra-ui/icons'
import { Button, message } from 'antd'
import axios from 'axios'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { useAuth } from '../components/auth/AuthContext'
import DefaultLayout from '../components/layout/DefaultLayout'
import { useApp } from '../containers/common/AppContext'
import { handleError } from '../helpers'
import { codeMessages, commonMessages, usersMessages } from '../helpers/translation'
import { ReactComponent as CheckEmailIcon } from '../images/check-email.svg'

const StyledContainer = styled.div`
  padding: 4rem 1rem;
  color: #585858;
  text-align: center;
`
const StyledIcon = styled.div`
  margin-bottom: 2rem;
`
const StyledAction = styled.div`
  padding-top: 1.5rem;
  color: #9b9b9b;
  font-size: 14px;
`

const CheckEmailPage: React.VFC = () => {
  const { id: appId } = useApp()
  const { formatMessage } = useIntl()
  const [email] = useQueryParam('email', StringParam)
  const [type] = useQueryParam('type', StringParam)
  const { apiHost } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleResendEmail = () => {
    setLoading(true)
    if (!email) {
      setTimeout(() => {
        setLoading(false)
      }, 3000)
      return
    }
    axios
      .post(`//${apiHost}/auth/forgot-password`, {
        appId,
        account: email,
      })
      .then(({ data: { code } }) => {
        if (code === 'SUCCESS') {
          message.success(formatMessage(usersMessages.messages.resetPassword))
        } else {
          message.error(formatMessage(codeMessages[code as keyof typeof codeMessages]))
        }
      })
      .catch(handleError)
      .finally(() => setLoading(false))
  }

  return (
    <DefaultLayout noFooter centeredBox>
      <StyledContainer>
        <StyledIcon>
          <Icon as={CheckEmailIcon} />
        </StyledIcon>

        <p>
          {type === 'reset-password'
            ? formatMessage(commonMessages.content.checkEmailForSecurity)
            : formatMessage(commonMessages.content.checkEmail)}
        </p>

        <p>{email}</p>

        <StyledAction>
          <span>{formatMessage(usersMessages.content.unreceivedEmail)}</span>
          <Button type="link" size="small" onClick={handleResendEmail} loading={loading}>
            {formatMessage(commonMessages.button.resendEmail)}
          </Button>
        </StyledAction>
      </StyledContainer>
    </DefaultLayout>
  )
}

export default CheckEmailPage
