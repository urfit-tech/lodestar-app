import { Spinner } from '@chakra-ui/react'
import React from 'react'
import styled from 'styled-components'

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`

const LoadingPage: React.VFC = () => {
  return (
    <StyledDiv className="loading">
      <Spinner size="lg" />
    </StyledDiv>
  )
}

export default LoadingPage
