import { Button, CircularProgress, Icon } from '@chakra-ui/react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import ReactPlayer, { ReactPlayerProps } from 'react-player'
import { useHistory, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import { ProgressContext } from '../../contexts/ProgressContext'
import { getFileDownloadableLink } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { ReactComponent as IconNext } from '../../images/icon-next.svg'
import { ReactComponent as InfoOIcon } from '../../images/info-o.svg'
import { ProgramContentBodyProps } from '../../types/program'
import { useAuth } from '../auth/AuthContext'

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
const StyledAnnouncement = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: white;
  box-shadow: 0 2px 10px 0 var(--black-10);
  line-height: normal;

  svg {
    color: ${props => props.theme['@primary-color']};
  }
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
    programContentBody: ProgramContentBodyProps
    nextProgramContent?: {
      id: string
      title: string
    }
    isSwarmifyAvailable: boolean
    onVideoEvent?: (event: VideoEvent) => void
  }
> = ({ programContentId, programContentBody, nextProgramContent, isSwarmifyAvailable, onVideoEvent }) => {
  const { formatMessage } = useIntl()
  const videoId = `v-${programContentBody.id}`
  const { id: appId } = useApp()
  const { programContentProgress } = useContext(ProgressContext)
  const urls = useUrls(appId, programContentBody.id)
  const [isCoverShowing, setIsCoverShowing] = useState(false)
  const [playerType, setPlayerType] = useState<'smartVideo' | 'reactPlayer'>(
    isSwarmifyAvailable &&
      (localStorage.getItem('kolable.feature.swarmify') === null ||
        localStorage.getItem('kolable.feature.swarmify') === '1')
      ? 'smartVideo'
      : 'reactPlayer',
  )

  if (typeof programContentProgress === 'undefined') {
    return null
  }

  const lastProgress =
    programContentProgress.find(progress => progress.programContentId === programContentId)?.lastProgress || 0

  return (
    <>
      {isSwarmifyAvailable && playerType === 'smartVideo' && (
        <StyledAnnouncement className="mb-3">
          <div className="row">
            <div className="col-12 col-md-9">
              <Icon viewBox="0 0 20 20" className="mr-2">
                <InfoOIcon />
              </Icon>
              {formatMessage(messages.switchToStablePlayer)}
            </div>
            <div className="col-12 col-md-3 text-right">
              <Button
                variant="link"
                onClick={() => {
                  setPlayerType('reactPlayer')
                  localStorage.setItem('kolable.feature.swarmify', '0')
                  location.reload()
                }}
              >
                {formatMessage(messages.switchPlayer)}
              </Button>
            </div>
          </div>
        </StyledAnnouncement>
      )}

      <StyledContainer>
        {nextProgramContent && isCoverShowing && (
          <ProgramContentPlayerCover nextProgramContent={nextProgramContent} onSetIsCoverShowing={setIsCoverShowing} />
        )}

        {playerType === 'reactPlayer' && (
          <VimeoPlayer
            videoId={programContentBody.data.vimeoVideoId}
            lastProgress={lastProgress}
            onEvent={e => {
              if (e.type === 'ended') {
                setIsCoverShowing(true)
              }
              onVideoEvent?.(e)
            }}
          />
        )}

        {playerType === 'smartVideo' && urls && (
          <SmartVideo
            videoId={videoId}
            urls={urls}
            lastProgress={lastProgress}
            onEvent={e => {
              if (e.type === 'ended') {
                setIsCoverShowing(true)
              }
              onVideoEvent?.(e)
            }}
          />
        )}
      </StyledContainer>
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

const VimeoPlayer: React.VFC<{
  videoId: string
  lastProgress: number
  onEvent?: (event: VideoEvent) => void
}> = ({ videoId, lastProgress, onEvent }) => {
  const playerRef = useRef<ReactPlayer | null>(null)
  const lastEndedTime = useRef<number | null>(null)

  return (
    <ReactPlayer
      ref={playerRef}
      url={`https://vimeo.com/${videoId}`}
      width="100%"
      height="100%"
      progressInterval={5000}
      controls
      config={{
        vimeo: {
          playerOptions: {
            responsive: true,
            speed: true,
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
        const video = playerRef.current.getInternalPlayer() as HTMLVideoElement

        onEvent?.({
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

        onEvent?.({
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

        onEvent?.({
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

        onEvent?.({
          type: 'ended',
          progress: playerRef.current.getCurrentTime() / playerRef.current.getDuration(),
          videoState: {
            playbackRate: video.playbackRate || 1,
            startedAt: lastEndedTime.current || 0,
            endedAt,
          },
        })
        lastEndedTime.current = endedAt
      }}
    />
  )
}

const SmartVideo: React.FC<{
  videoId: string
  urls: { video: string; texttracks: string[] }
  lastProgress: number
  onEvent?: (event: VideoEvent) => void
}> = ({ videoId, urls, lastProgress, onEvent }) => {
  const smartVideoPlayer = useRef<any>(null)

  useEffect(() => {
    if (smartVideoPlayer.current?._lock || videoId === smartVideoPlayer.current?._videoId || !onEvent) {
      return
    }
    smartVideoPlayer.current?.dispose?.()
    smartVideoPlayer.current = { _lock: true }

    getVideoPlayer(videoId).then(player => {
      player.on('pause', (e: Event) => {
        onEvent({
          type: 'pause',
          progress: player.currentTime() / player.duration,
          videoState: {
            playbackRate: player.playbackRate(),
            startedAt: smartVideoPlayer.current._lastEndedTime || 0,
            endedAt: player.currentTime(),
          },
        })
        smartVideoPlayer.current._lastEndedTime = player.currentTime()
      })
      player.on('seeked', (e: Event) => {
        onEvent({
          type: 'seeked',
          progress: player.currentTime() / player.duration,
          videoState: {
            playbackRate: 0,
            startedAt: smartVideoPlayer.current._lastEndedTime || 0,
            endedAt: player.currentTime(),
          },
        })
        smartVideoPlayer.current._lastEndedTime = player.currentTime()
      })
      player.on('progress', (e: Event) => {
        if (smartVideoPlayer.current._lastEndedTime === null) {
          return
        }
        onEvent({
          type: 'progress',
          progress: player.currentTime() / player.duration,
          videoState: {
            playbackRate: player.playbackRate(),
            startedAt: smartVideoPlayer.current._lastEndedTime || 0,
            endedAt: player.currentTime(),
          },
        })
      })
      player.on('durationchange', (e: Event) => {
        if (smartVideoPlayer.current._lastEndedTime !== null) {
          return
        }
        const progress = lastProgress > 0 && lastProgress < 1 ? lastProgress : 0
        player.currentTime(player.duration() * progress)
        smartVideoPlayer.current._lastEndedTime = player.duration() * progress
      })
      player.on('ended', (e: Event) => {
        onEvent({
          type: 'ended',
          progress: player.currentTime() / player.duration,
          videoState: {
            playbackRate: player.playbackRate(),
            startedAt: smartVideoPlayer.current._lastEndedTime || 0,
            endedAt: player.currentTime(),
          },
        })
        smartVideoPlayer.current._lastEndedTime = player.currentTime()
      })
      smartVideoPlayer.current = player
      smartVideoPlayer.current._videoId = videoId
      smartVideoPlayer.current._lastEndedTime = null
    })
  }, [lastProgress, onEvent, videoId])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        document.activeElement?.classList.contains('vjs-play-control') ||
        document.activeElement?.classList.contains('vjs-fullscreen-control') ||
        smartVideoPlayer.current?._videoId !== videoId ||
        !['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Space'].includes(event.code)
      ) {
        return
      }
      event.preventDefault()

      try {
        const duration = smartVideoPlayer.current.duration()
        const currentTime = smartVideoPlayer.current.currentTime()
        const isPaused = smartVideoPlayer.current.paused()
        const currentVolume = smartVideoPlayer.current.volume()
        const isMuted = smartVideoPlayer.current.muted()

        switch (event.code) {
          case 'ArrowRight':
            smartVideoPlayer.current.currentTime(Math.min(currentTime + 5, duration))
            break
          case 'ArrowLeft':
            smartVideoPlayer.current.currentTime(Math.max(currentTime - 5, 0))
            break
          case 'ArrowUp':
            smartVideoPlayer.current.muted(false)
            smartVideoPlayer.current.volume(isMuted ? 0.05 : Math.min((Math.floor(currentVolume * 20) + 1) / 20, 1))
            break
          case 'ArrowDown':
            smartVideoPlayer.current.muted(false)
            smartVideoPlayer.current.volume(isMuted ? 0 : Math.max((Math.floor(currentVolume * 20) - 1) / 20, 0))
            break
          case 'Space':
            if (isPaused) {
              smartVideoPlayer.current.play()
            } else {
              smartVideoPlayer.current.pause()
            }
            break
        }
      } catch (error) {
        process.env.NODE_ENV === 'development' && console.error(error)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [videoId])

  return (
    <div>
      <video
        id={videoId}
        key={videoId}
        width="100%"
        className="smartvideo swarm-fluid"
        src={urls.video}
        controls
        preload="auto"
      >
        {urls.texttracks.map((url, index) => (
          <track key={url} default={index === 0} kind="captions" label="Default" src={url} />
        ))}
      </video>
    </div>
  )
}

const getVideoPlayer = async (videoId: string) =>
  new Promise<any>((resolve, reject) => {
    // wait for 300ms to setup
    setTimeout(() => {
      // FIXME: videoPlayer type
      let videoPlayer
      try {
        videoPlayer = (window as any).SwarmifyPlayer(videoId)
      } catch (err) {}
      if (videoPlayer) {
        resolve(videoPlayer)
      } else {
        getVideoPlayer(videoId).then(resolve).catch(reject)
      }
    }, 300)
  })

const useUrls = (appId: string, programContentBodyId: string) => {
  const { authToken, apiHost } = useAuth()
  const [urls, setUrls] = useState<{
    video: string
    texttracks: string[]
  } | null>(null)

  useEffect(() => {
    if (!appId || !authToken || !apiHost) {
      return
    }

    setUrls(null)

    getFileDownloadableLink(`videos/${appId}/${programContentBodyId}`, authToken, apiHost).then(videoUrl => {
      getFileDownloadableLink(`texttracks/${appId}/${programContentBodyId}`, authToken, apiHost).then(texttrackUrl => {
        fetch(texttrackUrl)
          .then(res => {
            if (res.status === 200) {
              return res.text()
            } else {
              throw new Error('Not Found')
            }
          })
          .then(data => {
            const content = !data.startsWith('WEBVTT')
              ? 'WEBVTT - Generated using SRT2VTT\r\n\r\n' + data.replace(/(\d+:\d+:\d+)+,(\d+)/g, '$1.$2')
              : data
            const blob = new Blob([content], { type: 'text/vtt' })
            const vttFile = window.URL.createObjectURL(blob)

            setUrls({
              video: videoUrl,
              texttracks: [vttFile],
            })
          })
          .catch(error => {
            process.env.NODE_ENV === 'development' && console.error(error)
            setUrls({
              video: videoUrl,
              texttracks: [],
            })
          })
      })
    })
  }, [apiHost, appId, authToken, programContentBodyId])

  return urls
}

export default React.memo(ProgramContentPlayer)
