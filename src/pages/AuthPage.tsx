import { Container } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'
import LoginSection from '../components/auth/LoginSection'
import RegisterSection from '../components/auth/RegisterSection'
import DefaultLayout from '../components/layout/DefaultLayout'
import { AuthState } from '../types/member'

const StyledContainer = styled(Container)`
  background: #ffffff;
  padding: 56px 64px;
`

const AuthPage: React.VFC = () => {
  const { currentMember } = useAuth()
  const [authState, setAuthState] = useState<AuthState>('login')
  const [accountLinkToken] = useQueryParam('accountLinkToken', StringParam)
  const [noGeneralLogin] = useQueryParam('noGeneralLogin', BooleanParam)

  useEffect(() => {
    if (currentMember) {
      const redirectUrl = Cookies.get('redirect')
      window.location.assign(redirectUrl || '/')
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
