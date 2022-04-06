import React from 'react'
import styled from 'styled-components'

const FullSizeContainer = styled.div<{ coverUrl?: string | null }>`
  width: 100vw;
  height: 41.68vw;
  background-image: url(${props => props.coverUrl || ''});
  background-size: cover;
  background-position: center;
`

const FullSizeBanner: React.VFC<{
  coverUrl?: string | null
}> = ({ coverUrl }) => {
  return (
    <>
      {
        coverUrl ?
        <FullSizeContainer coverUrl={coverUrl} /> :
        <></>
      }
    </>
  )
}

export default FullSizeBanner