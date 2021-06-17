import Accordion from 'lodestar-app-element/src/components/Accordion'
import React from 'react'
import { SectionTitle, StyledSection } from '../../pages/AppPage'

const AccordionSection: React.FC<{
  options: {
    title?: string
    infos?: {
      title: string
      description: string
    }[]
  }
}> = ({ options: { title, infos = [] } }) => {
  return (
    <StyledSection>
      <div className="container">
        <SectionTitle>{title}</SectionTitle>

        <Accordion list={infos} />
      </div>
    </StyledSection>
  )
}

export default AccordionSection
