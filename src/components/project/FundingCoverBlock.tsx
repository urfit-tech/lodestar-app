import React from 'react'
import styled from 'styled-components'
import { StyledPlayer } from '../program/ProgramBanner'

const StyledWrapper = styled.div<{ coverType: string; coverUrl: string }>`
  position: relative;
  padding-top: 56.25%;
  width: 100%;
  background-image: ${props => (props.coverType === 'image' ? `url(${props.coverUrl})` : 'none')};
  background-size: cover;
  background-position: center;
`

const FundingCoverBlock: React.VFC<{
  coverType: string
  coverUrl: string
}> = ({ coverType, coverUrl }) => {
  return (
    <StyledWrapper coverType={coverType} coverUrl={coverUrl}>
      {coverType === 'video' && (
        <StyledPlayer>
          <video className="smartvideo" src={coverUrl} controls autoPlay style={{ width: '100%', height: '100%' }} />
        </StyledPlayer>
      )}
    </StyledWrapper>
  )
}

export default FundingCoverBlock
