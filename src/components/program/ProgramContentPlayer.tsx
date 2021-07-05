import { CircularProgress, Icon } from '@chakra-ui/react'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { ReactPlayerProps } from 'react-player'
import { useHistory, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import { ProgressContext } from '../../contexts/ProgressContext'
import { getFileDownloadableLink } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { ReactComponent as IconNext } from '../../images/icon-next.svg'
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

const message = defineMessages({
  next: { id: 'program.text.next', defaultMessage: '接下來' },
})

type VideoEvent = Event & {
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
    onVideoEvent?: (event: VideoEvent) => void
  }
> = ({ programContentId, programContentBody, nextProgramContent, onVideoEvent }) => {
  const videoId = `v-${programContentBody.id}`
  const { id: appId } = useApp()
  const [isCoverShowing, setIsCoverShowing] = useState(false)
  const urls = useUrls(appId, programContentBody.id)

  return (
    <StyledContainer>
      {nextProgramContent && isCoverShowing && (
        <ProgramContentPlayerCover nextProgramContent={nextProgramContent} onSetIsCoverShowing={setIsCoverShowing} />
      )}
      {urls && (
        <SmartVideo
          programContentId={programContentId}
          videoId={videoId}
          urls={urls}
          onEvent={e => {
            if (e.type === 'ended') {
              setIsCoverShowing(true)
            }
            onVideoEvent?.(e)
          }}
        />
      )}
    </StyledContainer>
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
        <StyledCoverSubtitle className="mb-2">{formatMessage(message.next)}</StyledCoverSubtitle>
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

const SmartVideo: React.FC<{
  programContentId: string
  videoId: string
  urls: { video: string; texttracks: string[] }
  onEvent?: (e: VideoEvent) => void
}> = ({ programContentId, videoId, urls, onEvent }) => {
  const { programContentProgress } = useContext(ProgressContext)
  const smartVideoPlayer = useRef<any>(null)

  const lastProgress =
    typeof programContentProgress === 'undefined'
      ? undefined
      : programContentProgress.find(progress => progress.programContentId === programContentId)?.lastProgress || 0

  useEffect(() => {
    if (
      typeof lastProgress === 'undefined' ||
      smartVideoPlayer.current?._lock ||
      videoId === smartVideoPlayer.current?._videoId ||
      !onEvent
    ) {
      return
    }
    smartVideoPlayer.current?.dispose?.()
    smartVideoPlayer.current = { _lock: true }

    getVideoPlayer(videoId).then(player => {
      player.on('pause', (e: Event) => {
        onEvent({
          ...e,
          type: e.type,
          target: e.target,
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
          ...e,
          type: e.type,
          target: e.target,
          videoState: {
            playbackRate: 0,
            startedAt: smartVideoPlayer.current._lastEndedTime || 0,
            endedAt: player.currentTime(),
          },
        })
        smartVideoPlayer.current._lastEndedTime = player.currentTime()
      })
      player.on('progress', (e: Event) => {
        onEvent({
          ...e,
          type: e.type,
          target: e.target,
          videoState: {
            playbackRate: player.playbackRate(),
            startedAt: smartVideoPlayer.current._lastEndedTime || 0,
            endedAt: player.currentTime(),
          },
        })
        smartVideoPlayer.current._lastEndedTime = player.currentTime()
      })
      player.on('durationchange', (e: Event) => {
        if (smartVideoPlayer.current._lastEndedTime === null) {
          const progress = lastProgress > 0 && lastProgress < 1 ? lastProgress : 0
          player.currentTime(player.duration() * progress)
          smartVideoPlayer.current._lastEndedTime = player.duration() * progress
        }
      })
      player.on('ended', (e: Event) => {
        onEvent({
          ...e,
          type: e.type,
          target: e.target,
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
        const texttrackUrls: string[] = []
        const client = new XMLHttpRequest()
        client.open('GET', texttrackUrl)
        client.onreadystatechange = () => {
          if (
            client.readyState === XMLHttpRequest.DONE &&
            client.status === 200 &&
            client.responseText.length > 0 &&
            !client.responseText.includes('NoSuchKey') &&
            !client.responseText.startsWith('WEBVTT')
          ) {
            const content =
              'WEBVTT - Generated using SRT2VTT\r\n\r\n' + client.responseText.replace(/(\d+:\d+:\d+)+,(\d+)/g, '$1.$2')
            const blob = new Blob([content], { type: 'text/vtt' })
            texttrackUrl = window.URL.createObjectURL(blob)
            texttrackUrls.push(texttrackUrl)
          }

          setUrls({
            video: videoUrl,
            texttracks: texttrackUrls,
          })
        }
        client.send()
      })
    })
  }, [apiHost, appId, authToken, programContentBodyId])

  return urls
}

export default React.memo(ProgramContentPlayer)
