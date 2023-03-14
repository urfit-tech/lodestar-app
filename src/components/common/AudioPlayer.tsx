import { ButtonProps } from '@chakra-ui/button'
import { Icon } from '@chakra-ui/icons'
import { useInterval } from '@chakra-ui/react'
import { Button } from 'antd'
import HLS from 'hls.js'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import styled, { css } from 'styled-components'
import { desktopViewMixin, isMobile } from '../../helpers'
import {
  Backward5Icon,
  Forward5Icon,
  LoopIcon,
  NextIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  PlayRate05xIcon,
  PlayRate075xIcon,
  PlayRate10xIcon,
  PlayRate125xIcon,
  PlayRate15xIcon,
  PlayRate175xIcon,
  PlayRate20xIcon,
  PlayRate40xIcon,
  PrevIcon,
  ShuffleIcon,
  SingleLoopIcon,
  TimesIcon,
} from '../../images'
import Responsive, { BREAK_POINT } from '../common/Responsive'
import commonMessages from './translation'

type AudioPlayerMode = 'loop' | 'single-loop' | 'random'
type AudioEvent = {
  type: 'pause' | 'seeked' | 'progress' | 'ended'
  progress: number
  audioState: { playbackRate: number; startedAt: number; endedAt: number }
}

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
const BarBlock = styled.div`
  position: relative;
  bottom: 0;
  z-index: 1002;
  background: #323232;
  color: white;
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
const StyledRotateIcon = styled(Icon)`
  font-size: 44px;
  -webkit-animation: spin 1s linear infinite;
  -moz-animation: spin 1s linear infinite;
  animation: spin 1s linear infinite;

  @-moz-keyframes spin {
    100% {
      -moz-transform: rotate(360deg);
    }
  }
  @-webkit-keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  @keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
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

const AudioPlayer: React.VFC<{
  title: string
  mode?: 'default' | 'preview'
  audioUrl?: string
  lastProgress?: number
  autoPlay?: boolean
  onPrev?: () => void
  onNext?: () => void
  onAudioEvent?: (event: AudioEvent) => void
  onClose?: () => void
}> = ({ title, mode = 'default', audioUrl, lastProgress, autoPlay, onPrev, onNext, onAudioEvent, onClose }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const modeRef = useRef<AudioPlayerMode>('loop')
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [playRate, setPlayRate] = useState(Number(localStorage.getItem('audioPlayer.rate')) || 1)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState(0)
  const lastEndedTime = useRef<number>(0)

  audioRef.current && (audioRef.current.defaultPlaybackRate = playRate)

  const handlePauseOrPlay = (state: boolean) => {
    audioRef.current && (audioRef.current.autoplay = !state)
    setPlaying(!state)
  }

  useEffect(() => {
    if (audioRef.current && audioUrl?.includes('.m3u8') && HLS.isSupported()) {
      const hls = new HLS()
      hls.loadSource(audioUrl)
      hls.attachMedia(audioRef.current)
    }
  }, [audioUrl])

  useEffect(() => {
    duration > 0 && setLoading(false)
  }, [duration])

  useEffect(() => {
    localStorage.setItem('audioPlayer.rate', JSON.stringify(playRate))
    audioRef.current && (audioRef.current.playbackRate = playRate)
  }, [playRate])

  useEffect(() => {
    playing && setVisible(true)
    playing ? audioRef.current?.play() : audioRef.current?.pause()
  }, [playing])

  useInterval(() => {
    audioRef.current && setProgress(audioRef.current.currentTime)
  }, 500)

  return (
    <div>
      <StyledSlider
        height={8}
        max={duration}
        step={0.1}
        value={progress}
        onChange={value => audioRef.current && (audioRef.current.currentTime = value)}
      />

      <BarBlock className="py-1">
        <div className="container">
          <Responsive.Default>
            <div className="d-flex align-items-center justify-content-between">
              <StyledTitle className="flex-grow-1">{title}</StyledTitle>
              <StyledDuration>{`${durationFormat(progress)} / ${durationFormat(duration)}`}</StyledDuration>
            </div>
          </Responsive.Default>

          <div className="row flex-nowrap py-2">
            {onClose && (
              <CloseBlock className="col-1 d-flex align-items-center">
                <StyledButton type="link" variant="bar" onClick={() => onClose?.()}>
                  <Icon as={TimesIcon} />
                </StyledButton>
              </CloseBlock>
            )}
            <Responsive.Desktop>
              <div className="col-2 col-lg-4 d-flex d-lg-block align-items-center justify-content-start">
                <StyledTitle>{title}</StyledTitle>
                <StyledDuration>{`${durationFormat(progress)} / ${durationFormat(duration)}`}</StyledDuration>
              </div>
            </Responsive.Desktop>
            <div className="col-10 col-lg-4 d-flex align-items-center justify-content-center">
              {mode === 'default' && onPrev ? (
                <StyledShiftButton type="link" variant="bar" onClick={() => onPrev?.()}>
                  <Icon as={PrevIcon} />
                </StyledShiftButton>
              ) : null}
              <StyledButtonGroup className="d-flex align-items-center justify-content-center">
                <StyledButton
                  type="link"
                  variant="bar"
                  onClick={() => {
                    audioRef.current && (audioRef.current.currentTime = progress - 5)
                  }}
                >
                  <Icon as={Backward5Icon} />
                </StyledButton>
                <StyledButton
                  type="link"
                  variant="bar"
                  className="mx-2 mx-lg-3"
                  height="44px"
                  onClick={() => handlePauseOrPlay(playing)}
                >
                  {loading ? (
                    <StyledRotateIcon as={AiOutlineLoading} />
                  ) : (
                    <Icon as={playing ? PauseCircleIcon : PlayCircleIcon} style={{ fontSize: '44px' }} />
                  )}
                </StyledButton>
                <StyledButton
                  type="link"
                  variant="bar"
                  onClick={() => {
                    audioRef.current && (audioRef.current.currentTime = progress + 5)
                  }}
                >
                  <Icon as={Forward5Icon} />
                </StyledButton>
              </StyledButtonGroup>
              {mode === 'default' && onNext ? (
                <StyledShiftButton type="link" variant="bar" onClick={() => onNext?.()}>
                  <Icon as={NextIcon} />
                </StyledShiftButton>
              ) : null}
            </div>
            <div className="col-1 col-lg-4 d-flex align-items-center justify-content-end">
              <PlayRateButton variant="bar" playRate={playRate} onChange={rate => setPlayRate(rate)} />
              {/* // TODO: 循環播放視情況再來進行擴充 */}
              {/* <PlayModeButton
                variant="bar"
                mode={modeRef.current}
                className="ml-2 ml-md-3 ml-lg-3"
                onChange={mode => {
                  modeRef.current = mode
                  localStorage.setItem('audioPlayer.mode', mode)
                }}
              /> */}
              {/* // TODO: 播放清單視情況再來進行擴充 */}
              {/* <Popover placement="topRight" trigger="click">
                  <StyledButton
                    type="link"
                    variant="bar"
                    className="ml-2 ml-md-3 ml-lg-3"
                    onClick={() => setShowAction(false)}
                  >
                    <Icon as={PlaylistIcon} />
                  </StyledButton>
                </Popover> */}
            </div>
          </div>
        </div>
      </BarBlock>
      <audio
        ref={ref => {
          audioRef.current = ref
        }}
        src={audioUrl}
        loop={modeRef.current === 'single-loop'}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            const duration = audioRef.current.duration
            const progress = lastProgress && lastProgress > 0 && lastProgress < 1 ? lastProgress : 0
            audioRef.current.currentTime = duration * progress
            lastEndedTime.current = duration * progress
            setDuration(audioRef.current.duration)
          }
        }}
        onTimeUpdate={() => {
          const currentTime = audioRef.current?.currentTime || 0
          onAudioEvent?.({
            type: 'progress',
            progress: currentTime / duration,
            audioState: {
              playbackRate: playRate || 1,
              startedAt: lastEndedTime.current || 0,
              endedAt: currentTime,
            },
          })
        }}
        onPause={() => {
          setPlaying(false)
          const currentTime = audioRef.current?.currentTime || 0
          onAudioEvent?.({
            type: 'pause',
            progress: currentTime / duration,
            audioState: {
              playbackRate: playRate || 1,
              startedAt: lastEndedTime.current || 0,
              endedAt: currentTime || 0,
            },
          })
          lastEndedTime.current = currentTime
        }}
        onSeeked={() => {
          const currentTime = audioRef.current?.currentTime || 0
          onAudioEvent?.({
            type: 'seeked',
            progress: currentTime / duration,
            audioState: {
              playbackRate: 0,
              startedAt: lastEndedTime.current || 0,
              endedAt: currentTime,
            },
          })
          lastEndedTime.current = currentTime
        }}
        onPlay={() => setPlaying(true)}
        onEnded={() => {
          const currentTime = audioRef.current?.currentTime || 0
          const endedAt = currentTime || duration || 0
          onAudioEvent?.({
            type: 'ended',
            progress: currentTime / duration,
            audioState: {
              playbackRate: playRate || 1,
              startedAt: lastEndedTime.current || 0,
              endedAt,
            },
          })
          lastEndedTime.current = endedAt
          onNext?.()
        }}
        onCanPlay={
          isMobile
            ? undefined
            : () => {
                audioRef.current?.play()
              }
        }
        autoPlay={autoPlay}
      />
    </div>
  )
}

const PlayRateButton: React.VFC<
  Omit<ButtonProps, 'mode' | 'onChange'> & {
    playRate: number
    onChange?: (playRate: number) => void
  }
> = ({ playRate, onChange, ...buttonProps }) => {
  return (
    <StyledButton
      type="link"
      onClick={() => {
        const changedRate =
          playRate === 0.5
            ? 0.75
            : playRate === 0.75
            ? 1
            : playRate === 1
            ? 1.25
            : playRate === 1.25
            ? 1.5
            : playRate === 1.5
            ? 1.75
            : playRate === 1.75
            ? 2
            : playRate === 2
            ? 4
            : 0.5
        onChange?.(changedRate)
      }}
      {...buttonProps}
    >
      {playRate === 0.5 ? (
        <Icon as={PlayRate05xIcon} />
      ) : playRate === 0.75 ? (
        <Icon as={PlayRate075xIcon} />
      ) : playRate === 1 ? (
        <Icon as={PlayRate10xIcon} />
      ) : playRate === 1.25 ? (
        <Icon as={PlayRate125xIcon} />
      ) : playRate === 1.5 ? (
        <Icon as={PlayRate15xIcon} />
      ) : playRate === 1.75 ? (
        <Icon as={PlayRate175xIcon} />
      ) : playRate === 2 ? (
        <Icon as={PlayRate20xIcon} />
      ) : (
        <Icon as={PlayRate40xIcon} />
      )}
    </StyledButton>
  )
}

const PlayModeButton: React.VFC<
  Omit<ButtonProps, 'variant' | 'mode' | 'onChange'> & {
    variant: 'overlay' | 'bar'
    mode: AudioPlayerMode
    onChange?: (mode: AudioPlayerMode) => void
  }
> = ({ variant, mode, onChange, ...buttonProps }) => {
  const { formatMessage } = useIntl()
  const handleClick = () => {
    const changedMode = mode === 'loop' ? 'single-loop' : mode === 'single-loop' ? 'random' : 'loop'
    onChange?.(changedMode)
  }
  return (
    <StyledButton type="link" variant={variant} onClick={handleClick} {...buttonProps}>
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
            mode === 'loop'
              ? commonMessages.AudioPlayer.listLoop
              : mode === 'single-loop'
              ? commonMessages.AudioPlayer.singleLoop
              : commonMessages.AudioPlayer.random,
          )}
        </div>
      )}
    </StyledButton>
  )
}

export default AudioPlayer
