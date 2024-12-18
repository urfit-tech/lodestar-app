import { BREAK_POINT } from 'lodestar-app-element/src/components/common/Responsive'
import React from 'react'
import styled from 'styled-components'

const StyledWrapper = styled.div<{ width?: { desktop: string; mobile: string } }>`
  position: relative;
  overflow: ${props => (props.width ? 'visible' : 'hidden')};
  height: calc(100vw * (9 / 16));

  @media (max-width: ${BREAK_POINT}px) {
    height: 40vh;
  }

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
const Cover = styled.div<{ coverUrl?: { mobileUrl?: string; desktopUrl?: string } }>`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.coverUrl?.mobileUrl || props.coverUrl?.desktopUrl});
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  @media (min-width: ${BREAK_POINT}px) {
    background-image: url(${props => props.coverUrl?.desktopUrl || props.coverUrl?.mobileUrl});
  }
`
const ContentWrapper = styled.div<{ gradient?: boolean }>`
  position: relative;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6));
  height: 100%;
  z-index: 10;
`

const PictureBanner: React.FC<{
  coverUrl?: { mobileUrl?: string; desktopUrl?: string }
  width?: { desktop: string; mobile: string }
}> = ({ coverUrl, width, children }) => {
  return (
    <StyledWrapper width={width}>
      <BackgroundWrapper>
        <Cover coverUrl={coverUrl} />
      </BackgroundWrapper>

      <ContentWrapper>{children}</ContentWrapper>
    </StyledWrapper>
  )
}

export default PictureBanner
