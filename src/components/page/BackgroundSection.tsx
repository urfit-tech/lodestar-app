import LodestarBackgroundSection from 'lodestar-app-element/src/components/BackgroundSection'
import React from 'react'
import styled from 'styled-components'

const StyledBackgroundSection = styled(LodestarBackgroundSection)`
  height: 240px;

  @media (min-width: 768px) {
    height: 540px;
  }
`

const BackgroundSection: React.FC<{
  options: { backgroundUrl?: string }
}> = ({ options: { backgroundUrl } }) => {
  return <StyledBackgroundSection background={backgroundUrl || ''} />
}

export default BackgroundSection
