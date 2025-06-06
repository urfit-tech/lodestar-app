import { BREAK_POINT } from 'lodestar-app-element/src/components/common/Responsive'
import React from 'react'
import styled from 'styled-components'

const StyledWrapper = styled.div<{ width?: { desktop: string; mobile: string } }>`
  position: relative;
  overflow: ${props => (props.width ? 'visible' : 'hidden')};
  height: 100%;
  @media (min-width: ${BREAK_POINT}px) {
    height: 100%;
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

const ContentWrapper = styled.div<{ gradient?: boolean }>`
  position: relative;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6));
  height: 100%;
`

const VideoBanner: React.FC<{
  coverUrl?: { mobileUrl?: string; desktopUrl?: string; videoUrl?: string }
  width?: { desktop: string; mobile: string }
  videoWidth?: string
}> = ({ coverUrl, width, children, videoWidth }) => {
  return (
    <StyledWrapper width={width}>
      <BackgroundWrapper>
        <video muted autoPlay loop playsInline width={videoWidth}>
          <source src={coverUrl?.videoUrl} type="video/mp4" />
        </video>
      </BackgroundWrapper>

      <ContentWrapper>{children}</ContentWrapper>
    </StyledWrapper>
  )
}

export default VideoBanner
