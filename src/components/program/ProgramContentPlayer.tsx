import { CircularProgress, Icon } from '@chakra-ui/react'
import { StreamPlayerApi } from '@cloudflare/stream-react'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { useHistory, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { ProgressContext } from '../../contexts/ProgressContext'
import { commonMessages, productMessages } from '../../helpers/translation'
import { useProgramContent } from '../../hooks/program'
import { ReactComponent as IconNext } from '../../images/icon-next.svg'
import VideoPlayer from '../common/VideoPlayer'

const StyledContainer = styled.div`
  position: relative;
`
const StyledCover = styled.div`
  z-index: 1;
  position: absolute;
  background: black;
  width: 100%;
  height: 100%;
`
const StyledCoverWrapper = styled.div`
  text-align: center;
`
const StyledCoverTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.8px;
  color: #ffffff;
`
const StyledCoverSubtitle = styled.h3`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: var(--gray-dark);
`
const StyledIconWrapper = styled.div`
  position: relative;
  user-select: none;
  cursor: pointer;
  height: 72px;
  margin-bottom: 24px;
  svg {
    display: block !important;
  }
`
const StyledIcon = styled(Icon)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 36px;
  color: white;
`
const StyledCancelButton = styled.span`
  width: 30px;
  height: 20px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.8px;
  color: #ffffff;
  user-select: none;
  cursor: pointer;
`

const messages = defineMessages({
  next: { id: 'program.text.next', defaultMessage: '接下來' },
  switchPlayer: { id: 'program.ui.switchPlayer', defaultMessage: '切換為舊版' },
  switchToStablePlayer: {
    id: 'program.text.switchToStablePlayer',
    defaultMessage: '系統更新了播放器版本，若還不習慣可切換為舊版模式',
  },
})

type VideoEvent = {
  type: 'pause' | 'seeked' | 'progress' | 'ended'
  progress: number
  videoState: { playbackRate: number; startedAt: number; endedAt: number }
}

const ProgramContentPlayer: React.VFC<{
  programContentId: string
  nextProgramContent?: {
    id: string
    title: string
  }
  onVideoEvent?: (event: VideoEvent) => void
}> = ({ programContentId, nextProgramContent, onVideoEvent }) => {
  const { formatMessage } = useIntl()
  const streamRef = useRef<StreamPlayerApi>()
  const lastEndedTime = useRef<number>(0)
  const { currentMember } = useAuth()
  const { programContent } = useProgramContent(programContentId)
  const { loadingProgress, programContentProgress } = useContext(ProgressContext)
  const [isCoverShowing, setIsCoverShowing] = useState(false)

  if (loadingProgress) {
    return null
  }

  const lastProgress =
    (!!programContentProgress?.find(progress => progress.programContentId === programContentId)?.lastProgress &&
      programContentProgress?.find(progress => progress.programContentId === programContentId)?.lastProgress !== 1) ||
    !(programContentProgress?.find(progress => progress.programContentId === programContentId)?.progress === 1)
      ? programContentProgress?.find(progress => progress.programContentId === programContentId)?.lastProgress
      : 0

  const getCurrentProgress = (player: StreamPlayerApi) => Number(player.currentTime) / Number((player as any).duration)

  return (
    <>
      {programContent?.videos?.map(video => (
        <StyledContainer key={video.id}>
          {nextProgramContent && isCoverShowing && (
            <ProgramContentPlayerCover
              nextProgramContent={nextProgramContent}
              onSetIsCoverShowing={setIsCoverShowing}
            />
          )}
          <VideoPlayer
            height="400px"
            videoId={video.id}
            streamRef={streamRef}
            autoplay
            onProgress={() => {
              if (streamRef.current) {
                const progress = getCurrentProgress(streamRef.current)
                const endedAt = streamRef.current.currentTime
                onVideoEvent?.({
                  type: 'progress',
                  progress,
                  videoState: {
                    playbackRate: (streamRef.current as any).playbackRate,
                    startedAt: lastEndedTime.current,
                    endedAt,
                  },
                })
                lastEndedTime.current = endedAt
              }
            }}
            onSeeked={() => {
              if (streamRef.current) {
                const progress = getCurrentProgress(streamRef.current)
                const endedAt = streamRef.current.currentTime
                onVideoEvent?.({
                  type: 'seeked',
                  progress,
                  videoState: {
                    playbackRate: (streamRef.current as any).playbackRate,
                    startedAt: lastEndedTime.current,
                    endedAt,
                  },
                })
                lastEndedTime.current = endedAt
              }
            }}
            onLoadStart={() => {
              if (streamRef.current) {
                const initialPlaybackRate = Number(localStorage.getItem('kolable.player.playbackRate')) || 1
                const initialVolume = Number(localStorage.getItem('kolable.player.volume')) || 1
                ;(streamRef.current as any).playbackRate = initialPlaybackRate
                ;(streamRef.current as any).volume = initialVolume
              }
            }}
            onVolumeChange={() => {
              if (streamRef.current) {
                localStorage.setItem('kolable.player.volume', (streamRef.current as any).volume)
              }
            }}
            onRateChange={() => {
              if (streamRef.current) {
                localStorage.setItem('kolable.player.playbackRate', (streamRef.current as any).playbackRate)
              }
            }}
            onDurationChange={() => {
              if (streamRef.current && !streamRef.current.currentTime) {
                streamRef.current.currentTime = (streamRef.current as any).duration * (lastProgress || 0)
              }
            }}
            onEnded={() => {
              setIsCoverShowing(true)
              if (streamRef.current) {
                const progress = getCurrentProgress(streamRef.current)
                const endedAt = streamRef.current.currentTime
                onVideoEvent?.({
                  type: 'ended',
                  progress,
                  videoState: {
                    playbackRate: (streamRef.current as any).playbackRate,
                    startedAt: lastEndedTime.current,
                    endedAt,
                  },
                })
                lastEndedTime.current = endedAt
              }
            }}
          />
          {currentMember && (
            <div
              className="p-1 p-sm-2"
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                background: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              {`${formatMessage(productMessages.program.content.provide)} ${currentMember.name}-${
                currentMember.email
              } ${formatMessage(productMessages.program.content.watch)}`}
            </div>
          )}
        </StyledContainer>
      ))}
    </>
  )
}

const ProgramContentPlayerCover: React.VFC<{
  nextProgramContent: {
    id: string
    title: string
  }
  onSetIsCoverShowing?: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ nextProgramContent, onSetIsCoverShowing }) => {
  const history = useHistory()
  const {
    params: { programContentId: currentContentId },
    url,
  } = useRouteMatch<{ programContentId: string }>()
  const { formatMessage } = useIntl()

  return (
    <StyledCover className="d-flex align-items-center justify-content-center">
      <StyledCoverWrapper>
        <StyledCoverSubtitle className="mb-2">{formatMessage(messages.next)}</StyledCoverSubtitle>
        <StyledCoverTitle className="mb-4">{nextProgramContent.title}</StyledCoverTitle>
        <CountDownPlayButton
          onPlayNext={() => {
            onSetIsCoverShowing?.(false)
            history.push(url.replace(currentContentId, nextProgramContent.id))
          }}
        />
        <StyledCancelButton onClick={() => onSetIsCoverShowing?.(false)}>
          {formatMessage(commonMessages.ui.cancel)}
        </StyledCancelButton>
      </StyledCoverWrapper>
    </StyledCover>
  )
}

const CountDownPlayButton: React.VFC<{
  duration?: number
  onPlayNext?: () => void
}> = ({ duration = 5, onPlayNext }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const counter = setTimeout(() => {
      setProgress(progress => progress + 5)
    }, (duration * 1000) / 20)
    return () => clearTimeout(counter)
  }, [duration, progress])

  if (progress > 100) {
    onPlayNext?.()
  }

  return (
    <StyledIconWrapper onClick={() => onPlayNext?.()}>
      <CircularProgress trackColor="var(--gray-darker)" color="white" thickness="6px" value={progress} size="72px" />
      <StyledIcon as={IconNext} />
    </StyledIconWrapper>
  )
}

export default ProgramContentPlayer
