import { Spinner } from '@chakra-ui/react'
import React from 'react'
import styled from 'styled-components'
import { BooleanParam, useQueryParams } from 'use-query-params'
import DefaultLayout from '../layout/DefaultLayout'

const StyledDiv = styled.div<{ $noHeader?: boolean | null }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${props => (props.$noHeader ? '100vh' : 'calc(100vh - 64px)')};
`

const LoadingView: React.FC = () => {
  const [{ noHeader }] = useQueryParams({
    noHeader: BooleanParam,
  })

  return (
    <DefaultLayout noFooter noHeader={noHeader}>
      <StyledDiv className="loading" $noHeader={noHeader}>
        <Spinner size="lg" />
      </StyledDiv>
    </DefaultLayout>
  )
}

export default LoadingView
