import { Container } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'
import { useAuth } from '../components/auth/AuthContext'
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

  if (!accountLinkToken) return <Redirect to="/" />
  if (currentMember) {
    window.location.assign(`/line-binding?accountLinkToken=${accountLinkToken}`)
  }
  return (
    <DefaultLayout centeredBox noFooter noGeneralLogin={noGeneralLogin || false}>
      <StyledContainer centerContent maxW="md">
        {authState === 'login' ? (
          <LoginSection
            onAuthStateChange={setAuthState}
            noGeneralLogin={noGeneralLogin || false}
            accountLinkToken={accountLinkToken}
          />
        ) : authState === 'register' ? (
          <RegisterSection onAuthStateChange={setAuthState} />
        ) : null}
      </StyledContainer>
    </DefaultLayout>
  )
}

export default AuthPage
