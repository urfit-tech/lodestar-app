import React from 'react'
import styled from 'styled-components'
import { BREAK_POINT } from './Responsive'

const StyledWrapper = styled.div<{ width?: { desktop: string; mobile: string } }>`
  position: relative;
  overflow: ${props => (props.width ? 'visible' : 'hidden')};
  height: ${props => (props.width ? props.width.mobile : 'auto')};
  @media (min-width: ${BREAK_POINT}px) {
    height: ${props => (props.width ? props.width.desktop : 'auto')};
  }
`
const BackgroundWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: scale(1.1);
`
const BlurredCover = styled.div<{ coverUrl?: string | null }>`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.coverUrl || ''});
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  filter: blur(6px);
`
const ContentWrapper = styled.div`
  position: relative;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6));
`

const BlurredBanner: React.FC<{
  coverUrl?: string | null
  width?: { desktop: string; mobile: string }
}> = ({ coverUrl, width, children }) => {
  return (
    <StyledWrapper width={width}>
      <BackgroundWrapper>
        <BlurredCover coverUrl={coverUrl} />
      </BackgroundWrapper>

      <ContentWrapper>{children}</ContentWrapper>
    </StyledWrapper>
  )
}

export default BlurredBanner
