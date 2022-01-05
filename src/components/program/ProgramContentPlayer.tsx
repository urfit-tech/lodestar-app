import { CircularProgress, Icon } from '@chakra-ui/react'
import { StreamPlayerApi } from '@cloudflare/stream-react'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import ReactPlayer, { ReactPlayerProps } from 'react-player'
import { useHistory, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { ProgressContext } from '../../contexts/ProgressContext'
import { commonMessages, productMessages } from '../../helpers/translation'
import { useProgramContent } from '../../hooks/program'
import { ReactComponent as IconNext } from '../../images/icon-next.svg'
import VideoPlayer from '../common/VideoPlayer'

const StyledReactPlayerWrapper = styled.div`
  && > div {
    position: relative;
    width: 100% !important;
    height: 0 !important;
    padding-bottom: 56.25%;

    > div {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
`
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

const ProgramContentPlayer: React.VFC<
  ReactPlayerProps & {
    programContentId: string
    nextProgramContent?: {
      id: string
      title: string
    }
    onVideoEvent?: (event: VideoEvent) => void
  }
> = ({ programContentId, nextProgramContent, onVideoEvent }) => {
  const { formatMessage } = useIntl()
  const streamRef = useRef<StreamPlayerApi>()
  const playerRef = useRef<ReactPlayer | null>(null)
  const lastEndedTime = useRef<number>(0)
  const { currentMember } = useAuth()
  const { programContent } = useProgramContent(programContentId)
  const { loadingProgress, programContentProgress } = useContext(ProgressContext)
  const [isCoverShowing, setIsCoverShowing] = useState(false)

  if (loadingProgress) {
    return null
  }

  const currentProgramContentProgress = programContentProgress?.find(
    progress => progress.programContentId === programContentId,
  )

  const lastProgress =
    (!!currentProgramContentProgress?.lastProgress && currentProgramContentProgress?.lastProgress !== 1) ||
    currentProgramContentProgress?.progress !== 1
      ? currentProgramContentProgress?.lastProgress || 0
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
          {video.data?.source ? (
            <StyledReactPlayerWrapper>
              <ReactPlayer
                ref={playerRef}
                url={video.data.url}
                controls
                progressInterval={5000}
                config={{
                  youtube: {
                    playerVars: {
                      autoplay: 1,
                      rel: 0,
                    },
                  },
                }}
                onDuration={duration => {
                  if (!playerRef.current || typeof lastEndedTime.current === 'number') {
                    return
                  }
                  const progress = lastProgress > 0 && lastProgress < 1 ? lastProgress : 0
                  playerRef.current.seekTo(duration * progress, 'seconds')
                  lastEndedTime.current = duration * progress
                }}
                onProgress={state => {
                  if (!playerRef.current || lastEndedTime.current === null) {
                    return
                  }
                  const video = playerRef.current.getInternalPlayer()
                  // FIXME: can not get youtube volume and playbackRate
                  localStorage.setItem('kolable.player.volume', video.volume.toString())
                  localStorage.setItem('kolable.player.playbackRate', video.playbackRate.toString())

                  onVideoEvent?.({
                    type: 'progress',
                    progress: state.playedSeconds / playerRef.current.getDuration(),
                    videoState: {
                      playbackRate: video.playbackRate || 1,
                      startedAt: lastEndedTime.current || 0,
                      endedAt: state.playedSeconds,
                    },
                  })
                }}
                onPause={() => {
                  if (!playerRef.current) {
                    return
                  }
                  const video = playerRef.current.getInternalPlayer() as HTMLVideoElement
                  const currentTime = playerRef.current.getCurrentTime() || 0

                  onVideoEvent?.({
                    type: 'pause',
                    progress: currentTime / playerRef.current.getDuration(),
                    videoState: {
                      playbackRate: video.playbackRate || 1,
                      startedAt: lastEndedTime.current || 0,
                      endedAt: currentTime || 0,
                    },
                  })
                  lastEndedTime.current = currentTime
                }}
                onSeek={seconds => {
                  if (!playerRef.current || lastEndedTime.current === null) {
                    return
                  }

                  onVideoEvent?.({
                    type: 'seeked',
                    progress: seconds / playerRef.current.getDuration(),
                    videoState: {
                      playbackRate: 0,
                      startedAt: lastEndedTime.current || 0,
                      endedAt: seconds,
                    },
                  })
                  lastEndedTime.current = seconds
                }}
                onEnded={() => {
                  if (!playerRef.current) {
                    return
                  }
                  const video = playerRef.current.getInternalPlayer() as HTMLVideoElement
                  const endedAt = playerRef.current.getDuration() || video.duration || 0

                  onVideoEvent?.({
                    type: 'ended',
                    progress: playerRef.current.getCurrentTime() / playerRef.current.getDuration(),
                    videoState: {
                      playbackRate: video.playbackRate || 1,
                      startedAt: lastEndedTime.current || 0,
                      endedAt,
                    },
                  })
                  lastEndedTime.current = endedAt
                  setIsCoverShowing(true)
                }}
                onReady={player => {
                  // FIXME: can not get youtube volume and playbackRate
                  const video = player.getInternalPlayer()
                  if (player) {
                    const initialPlaybackRate = Number(localStorage.getItem('kolable.player.playbackRate')) || 1
                    const initialVolume = Number(localStorage.getItem('kolable.player.volume')) || 1
                    video.volume = initialVolume
                    video.playbackRate = initialPlaybackRate
                  }
                }}
              />
            </StyledReactPlayerWrapper>
          ) : (
            <>
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
                    streamRef.current.currentTime = (streamRef.current as any).duration * lastProgress
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
            </>
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
