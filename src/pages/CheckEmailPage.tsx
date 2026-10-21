import { Icon } from '@chakra-ui/icons'
import { Button, message } from 'antd'
import axios from 'axios'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { NumberParam, StringParam, useQueryParam } from 'use-query-params'
import DefaultLayout from '../components/layout/DefaultLayout'
import { formatAuthError, readAuthResponse } from '../helpers/authResponse'
import { commonMessages, usersMessages } from '../helpers/translation'
import { authCooldownKey, useAuthCooldown } from '../hooks/authCooldown'
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

const CheckEmailPage: React.FC = () => {
  const { id: appId } = useApp()
  const { formatMessage } = useIntl()
  const [email] = useQueryParam('email', StringParam)
  const [type] = useQueryParam('type', StringParam)
  const [retryAfter] = useQueryParam('retryAfter', NumberParam)
  const [requestedAt] = useQueryParam('requestedAt', NumberParam)
  const [openedAt] = useState(Date.now)
  const [loading, setLoading] = useState(false)
  const { remaining, start } = useAuthCooldown(
    authCooldownKey(appId, 'reset', email || ''),
    type === 'reset-password' ? readAuthResponse({ retryAfter }).retryAfter || 60 : 0,
    type === 'reset-password' && requestedAt && requestedAt > 0 && requestedAt <= openedAt ? requestedAt : 0,
  )

  const handleResendEmail = async () => {
    if (!email || loading || remaining) return
    setLoading(true)
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_ROOT}/auth/forgot-password`, {
        appId,
        account: email,
      })
      if (data.code !== 'SUCCESS' && data.code !== 'E_NO_MEMBER') throw data
      const seconds = readAuthResponse(data).retryAfter || 60
      start(seconds)
      message.info(formatAuthError({ retryAfter: seconds }, formatMessage))
    } catch (error) {
      const seconds = readAuthResponse(error).retryAfter
      if (seconds) start(seconds)
      message.error(formatAuthError(error, formatMessage))
    } finally {
      setLoading(false)
    }
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
          <Button type="link" size="small" onClick={handleResendEmail} loading={loading} disabled={remaining > 0}>
            {remaining > 0
              ? formatAuthError({ retryAfter: remaining }, formatMessage)
              : formatMessage(commonMessages.button.resendEmail)}
          </Button>
        </StyledAction>
      </StyledContainer>
    </DefaultLayout>
  )
}

export default CheckEmailPage
