import { Container } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'
import SafeLoginSection from '../components/auth/login/SafeLoginSection'
import DefaultLayout from '../components/layout/DefaultLayout'

const StyledContainer = styled(Container)`
  background: #ffffff;
  padding: 56px 64px;
  user-select: none;
`

const SafeLoginPage: React.FC = () => {
  const { currentMember } = useAuth()
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
        <SafeLoginSection />
      </StyledContainer>
    </DefaultLayout>
  )
}

export default SafeLoginPage
