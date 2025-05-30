import { Icon } from '@chakra-ui/icons'
import { Button, Spinner } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { lazy, Suspense } from 'react'
import { defineMessage, useIntl } from 'react-intl'
import ReactPlayer from 'react-player'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Responsive, { BREAK_POINT } from '../../../../components/common/Responsive'
import { ReactComponent as PlayIcon } from '../../../../images/play-fill-icon.svg'
import { ReactComponent as StarIcon } from '../../../../images/star-current-color.svg'
import { Program } from '../../../../types/program'

const VideoPlayer = lazy(() => import('../../../../components/common/VideoPlayer'))

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
const StyledVideoWrapper = styled.div<{ coverUrl: { mobileUrl?: string; desktopUrl?: string } }>`
  position: relative;
  padding-top: 56.25%;
  ${props =>
    props.coverUrl.mobileUrl
      ? `background-image: url(${props.coverUrl.mobileUrl});`
      : `background-image: url(${props.coverUrl.desktopUrl});`}
  background-size: cover;
  background-position: center;
  @media (min-width: ${BREAK_POINT}px) {
    ${props =>
      props.coverUrl.desktopUrl
        ? `background-image: url(${props.coverUrl.desktopUrl});`
        : `background-image: url(${props.coverUrl.mobileUrl});`}
  }
`
const StyledPlayer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: black;
`

const StyledWrapper = styled.div`
  background: #f7f8f8;

  ${StyledTitle} {
    color: #585858;
    margin-bottom: 1rem;
  }

  @media (min-width: ${BREAK_POINT}px) {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
`

const StyledTitleBlock = styled.div`
  width: 100%;
  padding: 1.5rem;
  text-align: center;

  @media (min-width: ${BREAK_POINT}px) {
    max-width: 520px;
    text-align: left;
  }
`

const StyleProgramInfo = styled.div`
  display: flex;
  justify-content: center;

  @media (min-width: ${BREAK_POINT}px) {
    justify-content: flex-start;
  }
`

const Divider = styled.div`
  width: 1px;
  background-color: var(--gray-light);
  margin: 0 24px;
`

const StyledIcon = styled(Icon)`
  font-size: 16px;
  color: ${props => props.theme['primary-color']};
`

const StyledText = styled.span`
  font-size: 24px;
  font-weight: 500;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`

const StyledButton = styled(Button)`
  && {
    padding-right: 56px;
    padding-left: 56px;
  }
`

const CustomizeProgramBanner: React.FC<{
  program: Program & {
    duration: number | null
    score: number | null
  }
  isEnrolled: boolean
}> = ({ program, isEnrolled }) => {
  const { settings } = useApp()
  const { formatMessage } = useIntl()
  return (
    <StyledWrapper id="program-banner" className="row">
      <div className="col-12 col-md-6">
        <StyledVideoWrapper
          coverUrl={{
            desktopUrl: program.coverUrl || undefined,
            mobileUrl: program.coverMobileUrl || undefined,
          }}
        >
          {program.coverVideoUrl && (
            <StyledPlayer>
              {program.coverVideoUrl.includes(`https://${process.env.REACT_APP_S3_BUCKET}`) ? (
                <video
                  controlsList="nodownload"
                  className="smartvideo"
                  src={program.coverVideoUrl}
                  controls
                  autoPlay
                  style={{ width: '100%', height: '100%' }}
                />
              ) : program.coverVideoUrl.includes('streaming.media.azure.net') ? (
                <Suspense fallback={<Spinner />}>
                  <VideoPlayer
                    sources={[
                      { type: 'application/dash+xml', src: program.coverVideoUrl + '(format=mpd-time-cmaf)' },
                      { type: 'application/x-mpegURL', src: program.coverVideoUrl + '(format=m3u8-cmaf)' },
                    ]}
                  />
                </Suspense>
              ) : (
                <ReactPlayer url={program.coverVideoUrl} width="100%" height="100%" controls />
              )}
            </StyledPlayer>
          )}
        </StyledVideoWrapper>
      </div>

      <div className="col-12 col-md-6 d-flex justify-content-center align-items-center flex-grow-1">
        <StyledTitleBlock>
          <StyledTitle>{program.title}</StyledTitle>
          <div className="mb-3">{program.abstract}</div>

          <StyleProgramInfo>
            {typeof program.score === 'number' && (
              <div className="d-flex flex-column align-items-center">
                <StyledText className="d-inline-flex align-items-center">
                  <span>{program.score}</span>
                  <StyledIcon as={StarIcon} />
                </StyledText>
                <span>{formatMessage(defineMessage({ id: 'common.ui.score', defaultMessage: '評分' }))}</span>
              </div>
            )}

            {typeof program.score === 'number' && typeof program.duration === 'number' && <Divider />}

            {typeof program.duration === 'number' && (
              <div className="d-flex flex-column align-items-center">
                <StyledText>{Math.floor(program.duration / 60)}</StyledText>
                <span>{formatMessage(defineMessage({ id: 'common.text.min', defaultMessage: '分鐘' }))}</span>
              </div>
            )}
          </StyleProgramInfo>
          <Responsive.Desktop>
            <Link to={isEnrolled ? `/programs/${program.id}/contents` : settings['link.program_page']}>
              <StyledButton className="mt-3" colorScheme="primary" leftIcon={<Icon as={PlayIcon} />}>
                {formatMessage(defineMessage({ id: 'common.ui.start', defaultMessage: '開始進行' }))}
              </StyledButton>
            </Link>
          </Responsive.Desktop>
        </StyledTitleBlock>
      </div>
    </StyledWrapper>
  )
}

export default CustomizeProgramBanner
