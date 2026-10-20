import { Container } from '@chakra-ui/react'
import { message } from 'antd'
import Cookies from 'js-cookie'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Redirect, useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'
import LoginSection from '../components/auth/login/LoginSection'
import RegisterSection from '../components/auth/RegisterSection'
import DefaultLayout from '../components/layout/DefaultLayout'
import { formatAuthError } from '../helpers/authResponse'
import { normalizeRedirect } from '../helpers/oauthState'
import { AuthState } from '../types/member'

const StyledContainer = styled(Container)`
  background: #ffffff;
  padding: 56px 64px;
  user-select: none;
`

const AuthPage: React.FC = () => {
  const { currentMember } = useAuth()
  const { formatMessage } = useIntl()
  const history = useHistory()
  const location = useLocation<{ authError?: { code?: string; retryAfter?: number } }>()
  useEffect(() => {
    if (location.state?.authError) {
      message.error(formatAuthError(location.state.authError, formatMessage))
      history.replace({ ...location, state: undefined })
    }
  }, [formatMessage, history, location])
  const [authState, setAuthState] = useState<AuthState>('login')
  const [accountLinkToken] = useQueryParam('accountLinkToken', StringParam)
  const [noGeneralLogin] = useQueryParam('noGeneralLogin', BooleanParam)

  useEffect(() => {
    if (currentMember) {
      window.location.assign(normalizeRedirect(Cookies.get('redirect')))
    }
  }, [currentMember])

  return currentMember && accountLinkToken ? (
    <Redirect to={`/line-binding?accountLinkToken=${accountLinkToken}`} />
  ) : (
    <DefaultLayout centeredBox noFooter noGeneralLogin={noGeneralLogin || false}>
      <StyledContainer centerContent maxW="md">
        {authState === 'login' ? (
          <LoginSection
            onAuthStateChange={setAuthState}
            noGeneralLogin={noGeneralLogin || false}
            accountLinkToken={accountLinkToken || undefined}
          />
        ) : authState === 'register' ? (
          <RegisterSection onAuthStateChange={setAuthState} />
        ) : null}
      </StyledContainer>
    </DefaultLayout>
  )
}

export default AuthPage
