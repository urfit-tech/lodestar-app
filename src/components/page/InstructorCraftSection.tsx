import { CraftSection } from 'lodestar-app-element/src/components/common/CraftElement'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import styled from 'styled-components'
import { SectionTitle } from '../../pages/AppPage'

const StyledContainer = styled.div`
  margin: 0 auto 4rem;
  padding: 0 4rem;
  width: 100%;
  max-width: 1080px;
`
const InstructorSection: React.FC<{
  options?: {
    title?: string
  }
}> = ({ options }) => {
  const { id } = useApp()
  return (
    <CraftSection>
      <SectionTitle>{options?.title || '專業師資'}</SectionTitle>
      <StyledContainer>{/* <InstructorBlock appId={id} /> */}</StyledContainer>
    </CraftSection>
  )
}

export default InstructorSection
