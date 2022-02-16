import { Spinner } from '@chakra-ui/react'
import React from 'react'
import styled from 'styled-components'
import DefaultLayout from '../components/layout/DefaultLayout'

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 64px);
`

const LoadingPage: React.VFC = () => {
  return (
    <DefaultLayout noFooter>
      <StyledDiv className="loading">
        <Spinner size="lg" />
      </StyledDiv>
    </DefaultLayout>
  )
}

export default LoadingPage
