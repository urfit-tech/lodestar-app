import { Icon } from '@chakra-ui/icons'
import { Button, Divider, Icon as AntdIcon, Popover } from 'antd'
import { ButtonProps } from 'antd/lib/button'
import isMobile from 'is-mobile'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import React, { useContext, useRef, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import ReactPlayer from 'react-player'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import PodcastPlayerContext, { PlaylistModeType } from '../../contexts/PodcastPlayerContext'
import { desktopViewMixin } from '../../helpers'
import { ReactComponent as Backward5Icon } from '../../images/backward-5.svg'
import { ReactComponent as EllipsisIcon } from '../../images/ellipsis.svg'
import { ReactComponent as Forward5Icon } from '../../images/forward-5.svg'
import { ReactComponent as NextIcon } from '../../images/icon-next.svg'
import { ReactComponent as PrevIcon } from '../../images/icon-prev.svg'
import { ReactComponent as LoopIcon } from '../../images/loop.svg'
import { ReactComponent as PlayRate05xIcon } from '../../images/multiple-0-5.svg'
import { ReactComponent as PlayRate10xIcon } from '../../images/multiple-1-0.svg'
import { ReactComponent as PlayRate15xIcon } from '../../images/multiple-1-5.svg'
import { ReactComponent as PlayRate20xIcon } from '../../images/multiple-2-0.svg'
import { ReactComponent as PauseCircleIcon } from '../../images/pause-circle.svg'
import { ReactComponent as PlayCircleIcon } from '../../images/play-circle.svg'
import { ReactComponent as PlaylistIcon } from '../../images/playlist.svg'
import { ReactComponent as ShuffleIcon } from '../../images/shuffle.svg'
import { ReactComponent as SingleLoopIcon } from '../../images/single-loop.svg'
import { ReactComponent as TimesIcon } from '../../images/times.svg'
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
  .anticon {
    font-size: 24px;
    color: ${props => (props.variant === 'overlay' ? 'var(--gray-darker)' : 'white')};
  }
  ${props =>
    props.variant === 'bar'
      ? css`
          &:hover .anticon {
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
  .anticon {
    font-size: 16px;
  }
  ${desktopViewMixin(css`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    .anticon {
      font-size: 20px;
    }
  `)}
`

const durationFormat: (time: number) => string = time => {
  return `${Math.floor(time / 60)}:${Math.floor(time % 60)
    .toString()
    .padStart(2, '0')}`
}

const PodcastPlayer: React.FC<{
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
    togglePlaylistMode,
    shift,
    closePlayer,
    setIsPlaying,
    setMaxDuration,
  } = useContext(PodcastPlayerContext)
  const playerRef = useRef<ReactPlayer | null>(null)
  const [progress, setProgress] = useState(0)
  const [isSeeking, setIsSeeking] = useState(false)
  const [playRate, setPlayRate] = useState(1)
  const [showAction, setShowAction] = useState(false)
  const [isAudioLoading, setIsAudioLoading] = useState(false)

  const handlePlayRate = () => {
    playRate < 1 ? setPlayRate(1) : playRate < 1.5 ? setPlayRate(1.5) : playRate < 2 ? setPlayRate(2) : setPlayRate(0.5)
  }

  // initialize when changing podcast program
  if (currentPodcastProgram?.id !== currentPlayingId && maxDuration > 0 && setMaxDuration) {
    setMaxDuration(0)
    setProgress(0)
  }

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
            if (!isSeeking) {
              setProgress(progress.playedSeconds)
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
                    setIsPlaying && setIsPlaying(!isPlaying)
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
                    <AntdIcon type="loading" style={{ fontSize: '44px' }} />
                  ) : (
                    <AntdIcon
                      component={() => (isPlaying ? <Icon as={PauseCircleIcon} /> : <Icon as={PlayCircleIcon} />)}
                      style={{ fontSize: '44px' }}
                    />
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

const PlayRateButton: React.FC<
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

const PlayModeButton: React.FC<
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
