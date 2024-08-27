import { CraftSection } from 'lodestar-app-element/src/components/common/CraftElement'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { SectionTitle } from '../../pages/AppPage'
import pageComponentsMessages from './translation'

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
  const { formatMessage } = useIntl()
  return (
    <CraftSection>
      <SectionTitle>
        {options?.title || formatMessage(pageComponentsMessages.InstructorCraftSection.professionalInstructors)}
      </SectionTitle>
      <StyledContainer>{/* <InstructorBlock appId={id} /> */}</StyledContainer>
    </CraftSection>
  )
}

export default InstructorSection
