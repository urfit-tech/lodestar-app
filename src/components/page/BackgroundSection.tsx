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
  return (
    <StyledBackgroundSection
      customStyle={{
        backgroundImage: backgroundUrl || '',
        mt: '0',
        mb: '0',
        mr: '0',
        ml: '0',
        pt: '0',
        pb: '0',
        pr: '0',
        pl: '0',
      }}
    />
  )
}

export default BackgroundSection
