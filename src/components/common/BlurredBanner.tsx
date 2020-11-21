import React from 'react'
import styled from 'styled-components'

const StyledWrapper = styled.div`
  position: relative;
  overflow: hidden;
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
}> = ({ coverUrl, children }) => {
  return (
    <StyledWrapper>
      <BackgroundWrapper>
        <BlurredCover coverUrl={coverUrl} />
      </BackgroundWrapper>

      <ContentWrapper>{children}</ContentWrapper>
    </StyledWrapper>
  )
}

export default BlurredBanner
