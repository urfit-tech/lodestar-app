import { Button } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import { useIntl } from 'react-intl'
import ReactPlayer from 'react-player'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import CWLBreadcrumb from '../../../components/common/CWLBreadcrumb'
import CWLPageNavButtons from '../../../components/common/CWLPageNavButtons'
import { BREAK_POINT } from '../../../components/common/Responsive'
import VideoPlayer from '../../../components/common/VideoPlayer'
import { commonMessages } from '../../../helpers/translation'
import { Program } from '../../../types/program'
import FullSizeBanner from './FullSizeBanner'

const StyledTags = styled.div`
  margin-bottom: 1rem;
  color: white;
  font-size: 14px;
`
const StyledTitle = styled.h1`
  margin: 0;
  font-weight: 900;
  font-size: 28px;
  line-height: 1.23;
  text-align: left;
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

const StyledTitleBlock = styled.div`
  position: relative;
  padding: 1rem 0;

  @media (min-width: ${BREAK_POINT}px) {
    padding: 4rem 0 2rem 0;
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
  pageNavActiveLink?: any
}> = ({ program, isEnrolledByProgramPackage, isDelivered, pageNavActiveLink }) => {
  const history = useHistory()
  const { settings } = useApp()
  const { formatMessage } = useIntl()
  const navButtons: { text: string; targetId: string; linkto?: any }[] = [
    { text: '講師簡介', targetId: '#program-instructor-collection' },
    { text: '課程內容', targetId: '#program-content-list-section' },
  ]

  if (program.coverVideoUrl) {
    navButtons.unshift({ text: '介紹影片', targetId: '#program-info-video' })
  }
  if (pageNavActiveLink) {
    navButtons.push({ text: pageNavActiveLink.text, targetId: '^_^', linkto: pageNavActiveLink.linkto })
  } else {
    navButtons.push({ text: '查看方案', targetId: '#program-plans-card' })
  }

  return (
    <div>
      {!program.coverVideoUrl && (
        <React.Fragment>
          <div id="program-banner">
            <FullSizeBanner
              coverUrl={{ mobileUrl: program.coverMobileUrl || undefined, desktopUrl: program.coverUrl || undefined }}
            />
          </div>
          <CWLPageNavButtons mainBlock="program-banner" navButtons={navButtons} />
          <CWLBreadcrumb program={program} />
        </React.Fragment>
      )}

      <div className="container">
        <StyledTitleBlock>
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
      </div>

      {program.coverVideoUrl && (
        <StyledVideoBlock>
          <div id="program-info-video" className="container">
            <StyledVideoWrapper>
              <StyledPlayer>
                {program.coverVideoUrl.includes(`https://${process.env.REACT_APP_S3_BUCKET}`) ? (
                  <video
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
          <CWLPageNavButtons mainBlock="program-info-video" navButtons={navButtons} />
          <CWLBreadcrumb program={program} />
        </StyledVideoBlock>
      )}
    </div>
  )
}

export default PerpetualProgramBanner
