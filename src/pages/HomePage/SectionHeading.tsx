import { Heading } from '@chakra-ui/react'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

const StyledSectionHeading = styled.div`
  margin: 60px 0;
`
const StyledIcon = styled.span`
  font-size: 48px;
  line-height: 1;
`
const StyledHeading = styled(Heading)`
  font-size: 34px;
  font-weight: 600;
  text-align: justify;
  color: #4a4a4a;
`
const StyledSubHeading = styled(Heading)`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: ${props => props.theme['@primary-color']};
`

const SectionHeading: React.FC<{
  title: string
  subtitle: string
  icon: ReactElement
}> = ({ icon, title, subtitle }) => {
  return (
    <StyledSectionHeading className="d-flex flex-column align-items-center justify-content-center">
      <StyledHeading className="d-flex align-items-center mb-1">
        <StyledIcon className="mr-2">{icon}</StyledIcon>
        <span>{title}</span>
      </StyledHeading>
      <StyledSubHeading as="h3">{subtitle}</StyledSubHeading>
    </StyledSectionHeading>
  )
}

export default SectionHeading
