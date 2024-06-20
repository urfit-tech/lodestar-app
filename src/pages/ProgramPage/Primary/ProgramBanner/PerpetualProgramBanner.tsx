import { Button } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import { useIntl } from 'react-intl'
import ReactPlayer from 'react-player'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import BlurredBanner from '../../../../components/common/BlurredBanner'
import { BREAK_POINT } from '../../../../components/common/Responsive'
import VideoPlayer from '../../../../components/common/VideoPlayer'
import { commonMessages } from '../../../../helpers/translation'
import { Program } from '../../../../types/program'

const StyledTags = styled.div`
  margin-bottom: 1rem;
  color: white;
  font-size: 14px;
`
const StyledTitle = styled.h1`
  margin: 0;
  color: white;
  font-size: 28px;
  line-height: 1.23;
  letter-spacing: 0.23px;

  @media (min-width: ${BREAK_POINT}px) {
    font-size: 40px;
  }
`
const StyledVideoWrapper = styled.div<{ backgroundImage?: string }>`
  position: relative;
  padding-top: 56.25%;
  ${props => props.backgroundImage && `background-image: url(${props.backgroundImage});`}
  background-size: cover;
  background-position: center;
`
const StyledPlayer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: black;
`

const StyledTitleBlock = styled.div<{ noVideo?: boolean }>`
  position: relative;
  padding: ${props => (props.noVideo ? '6rem 2rem' : '2rem')};

  @media (min-width: ${BREAK_POINT}px) {
    padding: ${props => (props.noVideo ? '7.5rem 2rem' : '4rem 2rem')};
  }
`
const StyledVideoBlock = styled.div`
  position: relative;
  margin-bottom: -1px;
  padding-bottom: 2px;
  background: linear-gradient(to bottom, transparent 50%, white 50%);
`
const StyledLink = styled(Link)`
  color: white;
`

const StyledButton = styled(Button)`
  && {
    width: 250px;
  }
`

const PerpetualProgramBanner: React.VFC<{
  program: Program & {
    tags: string[]
  }
  isEnrolledByProgramPackage?: boolean
  isDelivered?: boolean
}> = ({ program, isEnrolledByProgramPackage, isDelivered }) => {
  const history = useHistory()
  const { settings } = useApp()
  const { formatMessage } = useIntl()

  return (
    <BlurredBanner
      coverUrl={{ mobileUrl: program.coverMobileUrl || undefined, desktopUrl: program.coverUrl || undefined }}
    >
      <StyledTitleBlock noVideo={!program.coverVideoUrl}>
        <StyledTags className="text-center">
          {program.tags?.map(programTag => (
            <StyledLink key={programTag} to={`/search?tag=${programTag}&tab=programs`} className="mr-2">
              #{programTag}
            </StyledLink>
          ))}
        </StyledTags>

        <StyledTitle className="text-center">{program.title}</StyledTitle>
        {isEnrolledByProgramPackage && (
          <div className="mt-4 text-center">
            {isDelivered ? (
              <StyledButton
                colorScheme="primary"
                onClick={() => {
                  history.push(`/programs/${program.id}/contents`)
                }}
              >
                {formatMessage(commonMessages.button.enter)}
              </StyledButton>
            ) : (
              <StyledButton colorScheme="gray" color="darkGray" isActive>
                {formatMessage(commonMessages.button.unOpened)}
              </StyledButton>
            )}
          </div>
        )}
      </StyledTitleBlock>

      {program.coverVideoUrl && (
        <StyledVideoBlock>
          <div className="container">
            <StyledVideoWrapper>
              <StyledPlayer>
                {program.coverVideoUrl.includes(`https://${process.env.REACT_APP_S3_BUCKET}`) ? (
                  <video
                    controlsList="nodownload"
                    className="smartvideo"
                    src={program.coverVideoUrl}
                    controls
                    autoPlay={Boolean(Number(settings['feature.program_banner_video_autoPlay.enabled']))}
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : program.coverVideoUrl.includes('streaming.media.azure.net') ? (
                  <VideoPlayer
                    sources={[
                      { type: 'application/dash+xml', src: program.coverVideoUrl + '(format=mpd-time-cmaf)' },
                      { type: 'application/x-mpegURL', src: program.coverVideoUrl + '(format=m3u8-cmaf)' },
                    ]}
                  />
                ) : (
                  <ReactPlayer url={program.coverVideoUrl} width="100%" height="100%" controls />
                )}
              </StyledPlayer>
            </StyledVideoWrapper>
          </div>
        </StyledVideoBlock>
      )}
    </BlurredBanner>
  )
}

export default PerpetualProgramBanner
