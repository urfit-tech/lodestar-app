import { CircularProgress, Icon } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { ReactPlayerProps } from 'react-player'
import { useHistory, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
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
    programContentBody: ProgramContentBodyProps
    nextProgramContent?: {
      id: string
      title: string
    }
    lastProgress?: number
    onVideoEvent?: (event: VideoEvent) => void
  }
> = ({ programContentBody, nextProgramContent, lastProgress = 0, onVideoEvent }) => {
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
          videoId={videoId}
          urls={urls}
          initialProgress={lastProgress}
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
  videoId: string
  urls: { video: string; texttracks: string[] }
  initialProgress: number
  onEvent?: (e: VideoEvent) => void
}> = ({ videoId, urls, initialProgress, onEvent }) => {
  const [lastEndedTime, setLastEndedTime] = useState(0)
  useSmartVideoPlayer(videoId, {
    onPause: player => e => {
      onEvent?.({
        ...e,
        type: e.type,
        target: e.target,
        videoState: {
          playbackRate: player.playbackRate(),
          startedAt: lastEndedTime,
          endedAt: player.currentTime(),
        },
      })
      setLastEndedTime(player.currentTime())
    },
    onDurationChange: player => e => {
      if (!lastEndedTime) {
        player.currentTime(player.duration() * (initialProgress === 1 ? 0 : initialProgress))
        setLastEndedTime(player.duration() * (initialProgress === 1 ? 0 : initialProgress))
      }
    },
    onProgress: player => e => {
      onEvent?.({
        ...e,
        type: e.type,
        target: e.target,
        videoState: {
          playbackRate: player.playbackRate(),
          startedAt: lastEndedTime,
          endedAt: player.currentTime(),
        },
      })
      setLastEndedTime(player.currentTime())
    },
    onSeeked: player => e => {
      onEvent?.({
        ...e,
        type: e.type,
        target: e.target,
        videoState: {
          playbackRate: 0,
          startedAt: lastEndedTime,
          endedAt: player.currentTime(),
        },
      })
      setLastEndedTime(player.currentTime())
    },
    onEnded: player => e => {
      onEvent?.({
        ...e,
        type: e.type,
        target: e.target,
        videoState: {
          playbackRate: player.playbackRate(),
          startedAt: lastEndedTime,
          endedAt: player.currentTime(),
        },
      })
      setLastEndedTime(player.currentTime())
    },
  })

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

const useSmartVideoPlayer = (
  videoId: string,
  callbacks?: {
    onPause?: (videoPlayer: any) => (e: Event) => void
    onSeeked?: (videoPlayer: any) => (e: Event) => void
    onProgress?: (videoPlayer: any) => (e: Event) => void
    onDurationChange?: (videoPlayer: any) => (e: Event) => void
    onEnded?: (videoPlayer: any) => (e: Event) => void
  },
) => {
  const [videoPlayer, setVideoPlayer] = useState<any>()
  useEffect(() => {
    if (!videoPlayer) {
      getVideoPlayer(videoId).then(player => {
        // FIXME: it will be added three times QQ
        player.on('pause', callbacks?.onPause?.(player))
        player.on('seeked', callbacks?.onSeeked?.(player))
        player.on('progress', callbacks?.onProgress?.(player))
        player.on('durationchange', callbacks?.onDurationChange?.(player))
        player.on('ended', callbacks?.onEnded?.(player))
        setVideoPlayer(player)
      })
    }
  }, [callbacks, videoId, videoPlayer])
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
  const [urls, setUrls] = useState<{ video: string; texttracks: string[] }>()
  const { authToken, apiHost } = useAuth()
  useEffect(() => {
    getFileDownloadableLink(`videos/${appId}/${programContentBodyId}`, authToken, apiHost).then(videoUrl => {
      getFileDownloadableLink(`texttracks/${appId}/${programContentBodyId}`, authToken, apiHost).then(texttrackUrl => {
        const texttrackUrls: string[] = []
        const client = new XMLHttpRequest()
        client.open('GET', texttrackUrl)
        client.onreadystatechange = () => {
          if (client.responseText.length > 0 && !client.responseText.includes('NoSuchKey')) {
            if (!client.responseText.startsWith('WEBVTT')) {
              const content =
                'WEBVTT - Generated using SRT2VTT\r\n\r\n' +
                client.responseText.replace(/(\d+:\d+:\d+)+,(\d+)/g, '$1.$2')
              const blob = new Blob([content], { type: 'text/vtt' })
              texttrackUrl = window.URL.createObjectURL(blob)
              texttrackUrls.push(texttrackUrl)
            }
          }
          setUrls({ video: videoUrl, texttracks: texttrackUrls })
        }
        client.send()
      })
    })
  }, [apiHost, appId, authToken, programContentBodyId])
  return urls
}

export default React.memo(ProgramContentPlayer)
