import { BREAK_POINT } from 'lodestar-app-element/src/components/common/Responsive'
import React from 'react'
import styled from 'styled-components'

const FullSizeContainer = styled.div<{ coverUrl?: { mobileUrl?: string; desktopUrl?: string } }>`
  width: 100vw;
  height: 41.68vw;
  background-image: url(${props => props.coverUrl?.mobileUrl || props.coverUrl?.desktopUrl});
  background-size: cover;
  background-position: center;
  @media (min-width: ${BREAK_POINT}px) {
    background-image: url(${props => props.coverUrl?.desktopUrl || props.coverUrl?.mobileUrl});
  }
`

const FullSizeBanner: React.VFC<{
  coverUrl?: { mobileUrl?: string; desktopUrl?: string }
}> = ({ coverUrl }) => {
  return <>{coverUrl ? <FullSizeContainer coverUrl={coverUrl} /> : <></>}</>
}

export default FullSizeBanner
