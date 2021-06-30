import BackgroundSection from 'lodestar-app-element/src/components/BackgroundSection'
import InstructorBlock from 'lodestar-app-element/src/components/blocks/InstructorBlock'
import React from 'react'
import styled from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
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
    <BackgroundSection>
      <SectionTitle>{options?.title || '專業師資'}</SectionTitle>
      <StyledContainer>
        <InstructorBlock appId={id} />
      </StyledContainer>
    </BackgroundSection>
  )
}

export default InstructorSection
