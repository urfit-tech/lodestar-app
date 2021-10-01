import { Icon } from '@chakra-ui/icons'
import { Button, Divider, Popover } from 'antd'
import { ButtonProps } from 'antd/lib/button'
import axios from 'axios'
import isMobile from 'is-mobile'
import { throttle } from 'lodash'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
import { defineMessages, useIntl } from 'react-intl'
import ReactPlayer from 'react-player'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import PodcastPlayerContext, { PlaylistModeType } from '../../contexts/PodcastPlayerContext'
import { desktopViewMixin } from '../../helpers'
import {
  Backward5Icon,
  EllipsisIcon,
  Forward5Icon,
  LoopIcon,
  NextIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  PlaylistIcon,
  PlayRate05xIcon,
  PlayRate10xIcon,
  PlayRate15xIcon,
  PlayRate20xIcon,
  PrevIcon,
  ShuffleIcon,
  SingleLoopIcon,
  TimesIcon,
} from '../../images'
import Responsive, { BREAK_POINT } from '../common/Responsive'
import PlaylistOverlay from './PlaylistOverlay'

const messages = defineMessages({
  playRate: { id: 'podcast.label.playRate', defaultMessage: '播放速度' },
  listLoop: { id: 'podcast.label.listLoop', defaultMessage: '列表循環' },
  singleLoop: { id: 'podcast.label.singleLoop', defaultMessage: '單曲循環' },
  random: { id: 'podcast.label.random', defaultMessage: '隨機播放' },
})

const StyledWrapper = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
`
const StyledSlider = styled(Slider)<{ height?: number }>`
  && {
    z-index: 1003;
    padding: 0;
    width: 100%;
    height: ${props => (props.height ? `${props.height}px;` : '0.25em')};
    border-radius: 0;
  }
  .rc-slider-rail {
    border-radius: 0;
    ${props => (props.height ? `height: ${props.height}px;` : '')}
  }
  .rc-slider-track {
    ${props => (props.height ? `height: ${props.height}px;` : '')}
    background: ${props => props.theme['@primary-color']};
    border-radius: 0;
  }
  .rc-slider-step {
    cursor: pointer;
    ${props => (props.height ? `height: ${props.height}px;` : '')}
  }
  .rc-slider-handle {
    display: none;
    width: 20px;
    height: 20px;
    margin-top: -9px;
    cursor: pointer;
  }
`
const OverlayBlock = styled.div<{ active?: boolean }>`
  position: absolute;
  top: 1rem;
  z-index: 1001;
  width: 100%;
  transition: transform 0.2s ease-in-out;
  transform: translateY(${props => (props.active ? '-100%' : '0%')});
`
const ActionBlock = styled.div<{ active?: boolean }>`
  padding: 0.75rem 0;
  background: white;
  color: ${props => props.theme['@primary-color']};
  font-size: 14px;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  box-shadow: 0 -1px 6px 1px rgba(0, 0, 0, 0.1);
`
const BarBlock = styled.div`
  position: relative;
  bottom: 0;
  z-index: 1002;
  background: #323232;
  color: white;
`
const StyledLink = styled(Link)`
  overflow: hidden;
`
const StyledTitle = styled.div`
  overflow: hidden;
  color: white;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.2px;
  white-space: nowrap;
  text-overflow: ellipsis;
  ${desktopViewMixin(css`
    font-size: 16px;
  `)}
`
const StyledDuration = styled.div`
  color: var(--gray-dark);
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.6px;
`
const StyledButtonGroup = styled.div`
  margin: 0 12px;

  @media (min-width: ${BREAK_POINT}px) {
    margin: 0 20px;
  }
`
const StyledButton = styled(Button)<{ variant?: 'overlay' | 'bar'; height?: string }>`
  && {
    padding: 0;
    height: ${props => (props.height ? props.height : props.variant === 'overlay' ? '52px' : '24px')};
    line-height: 24px;
    color: white;
  }
  span {
    line-height: 1.5;
  }
  div {
    color: var(--gray-darker);
  }
  .chakra-icon {
    font-size: 24px;
    color: ${props => (props.variant === 'overlay' ? 'var(--gray-darker)' : 'white')};
  }
  ${props =>
    props.variant === 'bar'
      ? css`
          &:hover .chakra-icon {
            color: #cdcdcd;
          }
        `
      : ''}
`
const StyledShiftButton = styled(StyledButton)`
  @media (max-width: 320px) {
    display: none;
  }
`
const CloseBlock = styled.div`
  .chakra-icon {
    font-size: 16px;
  }
  ${desktopViewMixin(css`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    .chakra-icon {
      font-size: 20px;
    }
  `)}
`

const durationFormat: (time: number) => string = time => {
  return `${Math.floor(time / 60)}:${Math.floor(time % 60)
    .toString()
    .padStart(2, '0')}`
}

const PodcastPlayer: React.VFC<{
  memberId: string
}> = ({ memberId }) => {
  const {
    playlist,
    playlistMode,
    isPlaying,
    currentPlayingId,
    currentPodcastProgram,
    loadingPodcastProgram,
    maxDuration,
    isPodcastProgramChanged,
    progress: totalProgress,
    lastProgress,
    togglePlaylistMode,
    shift,
    closePlayer,
    setIsPlaying,
    setMaxDuration,
    refetchPodcastProgramProgress,
  } = useContext(PodcastPlayerContext)
  const { authToken } = useAuth()
  const playerRef = useRef<ReactPlayer | null>(null)
  const [progress, setProgress] = useState(0)
  const [isSeeking, setIsSeeking] = useState(false)
  const [playRate, setPlayRate] = useState(1)
  const [showAction, setShowAction] = useState(false)
  const [isAudioLoading, setIsAudioLoading] = useState(false)
  const [podcastAlbumId] = useQueryParam('podcastAlbumId', StringParam)

  const handlePlayRate = () => {
    playRate < 1 ? setPlayRate(1) : playRate < 1.5 ? setPlayRate(1.5) : playRate < 2 ? setPlayRate(2) : setPlayRate(0.5)
  }

  // initialize when changing podcast program
  useEffect(() => {
    if (isPodcastProgramChanged && setMaxDuration) {
      setMaxDuration(0)
      setProgress(0)
    }
  }, [isPodcastProgramChanged, setMaxDuration])

  const upsertPodcastProgramProgress = throttle(async (progress: number) => {
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_ROOT}/tasks/podcast-program-progress`,
        {
          podcastProgramId: currentPlayingId,
          memberId: memberId,
          progress: progress > totalProgress ? progress : totalProgress,
          lastProgress: progress,
          podcastAlbumId: podcastAlbumId,
        },
        { headers: { authorization: `Bearer ${authToken}` } },
      )
      .then(({ data: { code } }) => {
        if (code === 'SUCCESS') {
          refetchPodcastProgramProgress?.()
          return
        }
      })
      .catch(() => {})
  }, 3000)

  return (
    <StyledWrapper>
      {!loadingPodcastProgram && currentPodcastProgram && (
        <ReactPlayer
          ref={playerRef}
          url={currentPodcastProgram.url}
          style={{ display: 'none' }}
          playsinline
          playing={isPlaying && currentPodcastProgram.id === currentPlayingId}
          playbackRate={playRate}
          progressInterval={500}
          onDuration={duration => {
            setMaxDuration && setMaxDuration(parseFloat(duration.toFixed(1)))
          }}
          onProgress={progress => {
            if (progress.played !== 0 && !isSeeking) {
              setProgress(progress.playedSeconds)
              upsertPodcastProgramProgress(progress.played)
            }
          }}
          onEnded={() => {
            setIsPlaying && setIsPlaying(false)
            if (playlistMode === 'single-loop') {
              setTimeout(() => {
                setProgress(0)
                setIsPlaying && setIsPlaying(true)
              }, 500)
            } else {
              setTimeout(() => {
                setProgress(maxDuration)
                shift && shift(1)
              }, 500)
            }
          }}
        />
      )}

      <Responsive.Default>
        <OverlayBlock active={showAction}>
          <ActionBlock className="d-flex align-items-center justify-content-around">
            <div className="flex-grow-1 text-center">
              <PlayRateButton variant="overlay" playRate={playRate} onChange={handlePlayRate} />
            </div>
            <Divider type="vertical" style={{ height: '49px' }} />
            <div className="flex-grow-1 text-center">
              <PlayModeButton variant="overlay" mode={playlistMode} onChange={togglePlaylistMode} />
            </div>
          </ActionBlock>
        </OverlayBlock>
      </Responsive.Default>

      <div className="pt-3">
        <StyledSlider
          height={8}
          max={maxDuration}
          step={0.1}
          value={progress}
          onBeforeChange={() => setIsSeeking(true)}
          onChange={value => setProgress(value)}
          onAfterChange={value => {
            setIsSeeking(false)
            playerRef.current && playerRef.current.seekTo(value, 'seconds')
          }}
        />
      </div>

      <BarBlock className="py-1">
        <div className="container">
          <Responsive.Default>
            <div className="d-flex align-items-center justify-content-between">
              <StyledLink to={`/podcasts/${currentPodcastProgram?.id || ''}`}>
                <StyledTitle className="flex-grow-1">{currentPodcastProgram?.title}</StyledTitle>
              </StyledLink>
              <StyledDuration className="flex-shrink-0">
                {durationFormat(progress)}/{durationFormat(maxDuration)}
              </StyledDuration>
            </div>
          </Responsive.Default>

          <div className="row flex-nowrap py-2">
            <CloseBlock className="col-1 d-flex align-items-center">
              <StyledButton type="link" variant="bar" onClick={() => closePlayer && closePlayer()}>
                <Icon as={TimesIcon} />
              </StyledButton>
            </CloseBlock>

            <div className="col-2 col-lg-4 d-flex d-lg-block align-items-center justify-content-start">
              <Responsive.Desktop>
                <Link to={`/podcasts/${currentPodcastProgram?.id || ''}`}>
                  <StyledTitle>{currentPodcastProgram?.title}</StyledTitle>
                </Link>
                <StyledDuration>
                  {durationFormat(progress)}/{durationFormat(maxDuration)}
                </StyledDuration>
              </Responsive.Desktop>
            </div>
            <div className="col-6 col-lg-4 d-flex align-items-center justify-content-center">
              <StyledShiftButton type="link" variant="bar" onClick={() => shift && shift(-1)}>
                <Icon as={PrevIcon} />
              </StyledShiftButton>
              <StyledButtonGroup className="d-flex align-items-center justify-content-center">
                <StyledButton
                  type="link"
                  variant="bar"
                  onClick={() => playerRef.current?.seekTo(playerRef.current.getCurrentTime() - 5)}
                >
                  <Icon as={Backward5Icon} />
                </StyledButton>
                <StyledButton
                  type="link"
                  variant="bar"
                  className="mx-2 mx-lg-3"
                  height="44px"
                  onClick={() => {
                    setIsPlaying?.(!isPlaying)
                    if (isMobile() && progress === 0) {
                      setIsAudioLoading(true)
                      setTimeout(() => {
                        setIsAudioLoading(false)
                      }, 2500)
                    } else {
                      setIsAudioLoading(false)
                    }
                  }}
                >
                  {loadingPodcastProgram || maxDuration === 0 || isAudioLoading ? (
                    <Icon as={AiOutlineLoading} style={{ fontSize: '44px' }} />
                  ) : (
                    <Icon as={isPlaying ? PauseCircleIcon : PlayCircleIcon} style={{ fontSize: '44px' }} />
                  )}
                </StyledButton>
                <StyledButton
                  type="link"
                  variant="bar"
                  onClick={() => playerRef.current?.seekTo(playerRef.current.getCurrentTime() + 5)}
                >
                  <Icon as={Forward5Icon} />
                </StyledButton>
              </StyledButtonGroup>
              <StyledShiftButton type="link" variant="bar" onClick={() => shift && shift(1)}>
                <Icon as={NextIcon} />
              </StyledShiftButton>
            </div>
            <div className="col-3 col-lg-4 d-flex align-items-center justify-content-end">
              <Responsive.Desktop>
                <PlayRateButton variant="bar" playRate={playRate} onChange={handlePlayRate} />
                <PlayModeButton variant="bar" mode={playlistMode} className="ml-4" onChange={togglePlaylistMode} />
              </Responsive.Desktop>

              {!playlist?.isPreview && (
                <Popover
                  placement="topRight"
                  trigger="click"
                  content={<PlaylistOverlay memberId={memberId} defaultPlaylistId={playlist?.id || ''} />}
                >
                  <StyledButton type="link" variant="bar" className="ml-lg-4" onClick={() => setShowAction(false)}>
                    <Icon as={PlaylistIcon} />
                  </StyledButton>
                </Popover>
              )}

              <Responsive.Default>
                <StyledButton
                  type="link"
                  variant="bar"
                  className="ml-2 ml-lg-4"
                  onClick={() => setShowAction(!showAction)}
                >
                  <Icon as={EllipsisIcon} />
                </StyledButton>
              </Responsive.Default>
            </div>
          </div>
        </div>
      </BarBlock>
    </StyledWrapper>
  )
}

const PlayRateButton: React.VFC<
  ButtonProps & {
    variant: 'overlay' | 'bar'
    playRate: number
    onChange?: () => void
  }
> = ({ variant, playRate, onChange, ...props }) => {
  const { formatMessage } = useIntl()

  return (
    <StyledButton type="link" variant={variant} onClick={() => onChange && onChange()} {...props}>
      {playRate < 1 ? (
        <Icon as={PlayRate05xIcon} />
      ) : playRate < 1.5 ? (
        <Icon as={PlayRate10xIcon} />
      ) : playRate < 2 ? (
        <Icon as={PlayRate15xIcon} />
      ) : (
        <Icon as={PlayRate20xIcon} />
      )}
      {variant === 'overlay' && <div>{formatMessage(messages.playRate)}</div>}
    </StyledButton>
  )
}

const PlayModeButton: React.VFC<
  ButtonProps & {
    variant: 'overlay' | 'bar'
    mode: PlaylistModeType
    onChange?: () => void
  }
> = ({ variant, mode, onChange, ...props }) => {
  const { formatMessage } = useIntl()

  return (
    <StyledButton type="link" variant={variant} onClick={() => onChange && onChange()} {...props}>
      {mode === 'loop' ? (
        <Icon as={LoopIcon} />
      ) : mode === 'single-loop' ? (
        <Icon as={SingleLoopIcon} />
      ) : (
        <Icon as={ShuffleIcon} />
      )}

      {variant === 'overlay' && (
        <div>
          {formatMessage(
            mode === 'loop' ? messages.listLoop : mode === 'single-loop' ? messages.singleLoop : messages.random,
          )}
        </div>
      )}
    </StyledButton>
  )
}

export default PodcastPlayer
