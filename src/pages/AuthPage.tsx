import { Container } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import LoginSection from '../components/auth/LoginSection'
import RegisterSection from '../components/auth/RegisterSection'
import DefaultLayout from '../components/layout/DefaultLayout'
import { AuthState } from '../types/member'

const StyledContainer = styled(Container)`
  background: #ffffff;
  padding: 56px 64px;
`

const AuthPage: React.FC<{ noGeneralLogin?: boolean }> = ({ noGeneralLogin }) => {
  const [authState, setAuthState] = useState<AuthState>('login')
  const { search } = useLocation()
  const query = new URLSearchParams(search)
  const linkToken = query.get('accountLinkToken') || ''

  return (
    <DefaultLayout centeredBox noFooter>
      <StyledContainer centerContent maxW="md">
        {authState === 'login' ? (
          <LoginSection onAuthStateChange={setAuthState} noGeneralLogin={noGeneralLogin} accountLinkToken={linkToken} />
        ) : authState === 'register' ? (
          <RegisterSection onAuthStateChange={setAuthState} />
        ) : null}
      </StyledContainer>
    </DefaultLayout>
  )
}

export default AuthPage
