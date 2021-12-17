import React from 'react'
import ReactPlayer from 'react-player'
import styled from 'styled-components'

const StyledPlayer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: black;
`

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
          {coverUrl.includes(`https://${process.env.REACT_APP_S3_BUCKET}`) ? (
            <video className="smartvideo" src={coverUrl} controls autoPlay style={{ width: '100%', height: '100%' }} />
          ) : (
            <ReactPlayer url={coverUrl} width="100%" height="100%" controls />
          )}
        </StyledPlayer>
      )}
    </StyledWrapper>
  )
}

export default FundingCoverBlock
