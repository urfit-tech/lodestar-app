import { CraftSection } from 'lodestar-app-element/src/components/common/CraftElement'
import React from 'react'
import styled from 'styled-components'

const StyledBackgroundSection = styled(CraftSection)`
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
        margin: 0,
        padding: 0,
      }}
    />
  )
}

export default BackgroundSection
