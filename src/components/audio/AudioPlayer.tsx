import { ButtonProps } from '@chakra-ui/button'
import { useInterval } from '@chakra-ui/hooks'
import { Icon } from '@chakra-ui/icons'
import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react'
import { Divider, Popover, Tooltip } from 'antd'
import HLS from 'hls.js'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
import { TbArrowsRight } from 'react-icons/tb'
import { defineMessages, useIntl } from 'react-intl'
import { Link, useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { AudioPlayerMode } from '../../contexts/AudioPlayerContext'
import { desktopViewMixin } from '../../helpers'
import {
  Backward15Icon,
  EllipsisIcon,
  Forward15Icon,
  LoopIcon,
  NextIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  PlaylistIcon,
  PlayRate05xIcon,
  PlayRate075xIcon,
  PlayRate075xIcon_white,
  PlayRate10xIcon,
  PlayRate125xIcon,
  PlayRate125xIcon_white,
  PlayRate15xIcon,
  PlayRate175xIcon,
  PlayRate175xIcon_white,
  PlayRate20xIcon,
  PlayRate40xIcon,
  PlayRate40xIcon_white,
  PrevIcon,
  ShuffleIcon,
  SingleLoopIcon,
  TimesIcon,
} from '../../images'
import { ProgramContent } from '../../types/program'
import { BREAK_POINT } from '../common/Responsive'
import PlaylistOverlay from './PlaylistOverlay'

const messages = defineMessages({
  playRate: { id: 'common.AudioPlayer.playRate', defaultMessage: '播放速度' },
  sequential: { id: 'common.AudioPlayer.sequential', defaultMessage: '循序播放' },
  listLoop: { id: 'common.AudioPlayer.listLoop', defaultMessage: '全部循環' },
  singleLoop: { id: 'common.AudioPlayer.singleLoop', defaultMessage: '單曲循環' },
  random: { id: 'common.AudioPlayer.random', defaultMessage: '隨機播放' },
})

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

const OverlayBlock = styled(Box)<{ variant?: 'active' | '' }>`
  position: absolute;
  top: 1rem;
  z-index: 1001;
  width: 100%;
  transition: transform 0.2s ease-in-out;
  transform: translateY(${props => (props.variant === 'active' ? '-100%' : '0%')});
`

const ActionBlock = styled(Flex)`
  padding: 0.75rem 0;
  background: white;
  color: ${props => props.theme['@primary-color']};
  font-size: 14px;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  box-shadow: 0 -1px 6px 1px rgba(0, 0, 0, 0.1);
`

const StyledTitle = styled(Text)`
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
const StyledButtonGroup = styled(HStack)`
  margin: 0 12px;

  @media (min-width: ${BREAK_POINT}px) {
    margin: 0 20px;
  }
`
const StyledLink = styled(Link)`
  overflow: hidden;
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

const PlayRateButton: React.VFC<
  Omit<ButtonProps, 'variant' | 'mode' | 'onChange'> & {
    variant: 'overlay' | 'bar'
    playRate: number
    onChange?: (playRate: number) => void
  }
> = ({ variant, playRate, onChange, ...buttonProps }) => {
  const { formatMessage } = useIntl()
  return (
    <StyledButton
      type="link"
      variant={variant}
      onClick={() => {
        const changedRate =
          playRate < 0.75
            ? 0.75
            : playRate < 1
            ? 1
            : playRate < 1.25
            ? 1.25
            : playRate < 1.5
            ? 1.5
            : playRate < 1.75
            ? 1.75
            : playRate < 2
            ? 2
            : playRate < 4
            ? 4
            : 0.5
        onChange?.(changedRate)
      }}
      {...buttonProps}
    >
      {playRate < 0.75 ? (
        <Tooltip placement="top" title="0.5 倍速">
          <Icon as={PlayRate05xIcon} />
        </Tooltip>
      ) : playRate < 1 ? (
        <Tooltip placement="top" title="0.75 倍速">
          <Icon as={PlayRate075xIcon_white} display={{ base: 'none', md: 'unset' }} />
          <Icon as={PlayRate075xIcon} display={{ base: 'unset', md: 'none' }} />
        </Tooltip>
      ) : playRate < 1.25 ? (
        <Tooltip placement="top" title="1 倍速">
          <Icon as={PlayRate10xIcon} />
        </Tooltip>
      ) : playRate < 1.5 ? (
        <Tooltip placement="top" title="1.25 倍速">
          <Icon as={PlayRate125xIcon_white} display={{ base: 'none', md: 'unset' }} />
          <Icon as={PlayRate125xIcon} display={{ base: 'unset', md: 'none' }} />
        </Tooltip>
      ) : playRate < 1.75 ? (
        <Tooltip placement="top" title="1.5 倍速">
          <Icon as={PlayRate15xIcon} />
        </Tooltip>
      ) : playRate < 2 ? (
        <Tooltip placement="top" title="1.75 倍速">
          <Icon as={PlayRate175xIcon_white} display={{ base: 'none', md: 'unset' }} />
          <Icon as={PlayRate175xIcon} display={{ base: 'unset', md: 'none' }} />
        </Tooltip>
      ) : playRate < 4 ? (
        <Tooltip placement="top" title="2 倍速">
          <Icon as={PlayRate20xIcon} />
        </Tooltip>
      ) : (
        <Tooltip placement="top" title="4 倍速">
          <Icon as={PlayRate40xIcon_white} display={{ base: 'none', md: 'unset' }} />
          <Icon as={PlayRate40xIcon} display={{ base: 'unset', md: 'none' }} />
        </Tooltip>
      )}
      {variant === 'overlay' && <div>{formatMessage(messages.playRate)}</div>}
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
    const changedMode =
      mode === 'sequential'
        ? 'single-loop'
        : mode === 'single-loop'
        ? 'list-loop'
        : mode === 'list-loop'
        ? 'random'
        : 'sequential'
    onChange?.(changedMode)
  }
  return (
    <StyledButton type="link" variant={variant} onClick={handleClick} {...buttonProps}>
      {mode === 'sequential' ? (
        <Tooltip placement="top" title={formatMessage(messages.sequential)}>
          <Icon as={TbArrowsRight} />
        </Tooltip>
      ) : mode === 'list-loop' ? (
        <Tooltip placement="top" title={formatMessage(messages.listLoop)}>
          <Icon as={LoopIcon} />
        </Tooltip>
      ) : mode === 'single-loop' ? (
        <Tooltip placement="top" title={formatMessage(messages.singleLoop)}>
          <Icon as={SingleLoopIcon} />
        </Tooltip>
      ) : (
        <Tooltip placement="top" title={formatMessage(messages.random)}>
          <Icon as={ShuffleIcon} />
        </Tooltip>
      )}
      {variant === 'overlay' && (
        <div>
          {formatMessage(
            mode === 'sequential'
              ? messages.sequential
              : 'list-loop'
              ? messages.listLoop
              : mode === 'single-loop'
              ? messages.singleLoop
              : messages.random,
          )}
        </div>
      )}
    </StyledButton>
  )
}

const durationFormat: (time: number) => string = time => {
  return `${Math.floor(time / 60)}:${Math.floor(time % 60)
    .toString()
    .padStart(2, '0')}`
}

const AudioControls: React.FC<{
  isPlaying: boolean
  isLoading: boolean
  isFirst: boolean
  isLast: boolean
  onPrev: () => void
  onBackward: () => void
  onPlay: () => void
  onForward: () => void
  onNext: () => void
}> = ({ isPlaying, isLoading, isFirst, isLast, onPrev, onBackward, onPlay, onForward, onNext }) => {
  return (
    <>
      <StyledShiftButton type="link" variant="bar" onClick={onPrev} minWidth="0px" disabled={isFirst}>
        <Icon as={PrevIcon} />
      </StyledShiftButton>
      <StyledButtonGroup alignItems="center" justifyContent="center" spacing={{ base: '0px', lg: '10px' }}>
        <StyledButton type="link" variant="bar" onClick={onBackward}>
          <Icon as={Backward15Icon} />
        </StyledButton>

        <StyledButton type="link" variant="bar" height="44px" onClick={onPlay}>
          {isLoading ? (
            <StyledRotateIcon as={AiOutlineLoading} />
          ) : (
            <Icon as={isPlaying ? PauseCircleIcon : PlayCircleIcon} style={{ fontSize: '44px' }} />
          )}
        </StyledButton>

        <StyledButton type="link" variant="bar" onClick={onForward}>
          <Icon as={Forward15Icon} />
        </StyledButton>
      </StyledButtonGroup>
      <StyledShiftButton type="link" variant="bar" onClick={onNext} minWidth="0px" disabled={isLast}>
        <Icon as={NextIcon} />
      </StyledShiftButton>
    </>
  )
}

type audioEvent = {
  type: 'pause' | 'seeked' | 'progress' | 'ended'
  progress: number
  audioState: { playbackRate: number; startedAt: number; endedAt: number }
}

const AudioPlayer: React.VFC<{
  isPlaying: boolean
  title: string
  contentSectionTitle: string
  audioUrl: string
  mode: AudioPlayerMode
  lastEndedAt: number
  playList: (ProgramContent & { programId?: string; contentSectionTitle?: string; progress?: number })[]
  currentIndex: number
  mimeType: string
  onPlay: (state: boolean) => void
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  onAudioEvent: (event: audioEvent) => void
  onPlayModeChange: (mode: AudioPlayerMode) => void
}> = ({
  title,
  mode,
  contentSectionTitle,
  currentIndex,
  lastEndedAt,
  playList,
  isPlaying,
  audioUrl,
  mimeType,
  onPlay,
  onClose,
  onPrev,
  onNext,
  onAudioEvent,
  onPlayModeChange,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [showAction, setShowAction] = useState(false)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState(0)
  const [playRate, setPlayRate] = useState(Number(localStorage.getItem('playRate')) || 1)
  const lastEndedTime = useRef<number>(0)
  const location = useLocation()
  const pathname = location.pathname
  const { id: contentId, programId } = playList[currentIndex]
  const link = `/programs/${programId}/contents/${contentId}`
  const isLoading = duration === 0
  const isLast = playList.length - 1 === currentIndex
  const isFirst = currentIndex === 0

  useInterval(() => {
    setProgress(audioRef.current?.currentTime || 0)
  }, 500)

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      if (mimeType === 'application/x-mpegURL' && HLS.isSupported()) {
        const hls = new HLS()
        hls.loadSource(audioUrl)
        hls.attachMedia(audioRef.current)
      } else {
        audioRef.current.src = audioUrl
      }
    }
  }, [audioUrl, mimeType])

  return (
    <>
      <Box position="fixed" right="0" bottom="0" left="0" zIndex="1000">
        <OverlayBlock variant={showAction ? 'active' : ''} display={{ base: 'block', md: 'none' }}>
          <ActionBlock alignItems="center" justifyContent="space-around" marginBottom="5px">
            <div className="flex-grow-1 text-center">
              <PlayRateButton
                variant="overlay"
                playRate={playRate}
                onChange={rate => {
                  setPlayRate(rate)
                  localStorage.setItem('playRate', rate.toString())
                  audioRef.current && (audioRef.current.playbackRate = rate)
                }}
              />
            </div>
            <Divider type="vertical" style={{ height: '49px' }} />
            <div className="flex-grow-1 text-center">
              <PlayModeButton variant="overlay" mode={mode} onChange={mode => onPlayModeChange(mode)} />
            </div>
          </ActionBlock>
        </OverlayBlock>

        <Box>
          <StyledSlider
            height={8}
            max={duration}
            step={0.1}
            value={progress}
            onChange={value => audioRef.current && (audioRef.current.currentTime = value)}
          />
        </Box>

        <Box position="relative" bottom="0" zIndex="1002" background="#323232" color="white" paddingY="0.25rem">
          <Box>
            <Flex
              alignContent="center"
              justifyContent="space-between"
              marginTop="5px"
              marginX="15px"
              display={{ base: 'flex', lg: 'none' }}
            >
              <StyledLink to={link}>
                <StyledTitle className="flex-grow-1">{title}</StyledTitle>
              </StyledLink>
              <StyledDuration>{`${durationFormat(progress)} / ${durationFormat(duration)}`}</StyledDuration>
            </Flex>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              margin={{ base: '15px 0px 15px 15px', lg: '8px 10px 5px 10px' }}
            >
              <Flex alignItems="center" zIndex="1000">
                <HStack spacing="5px">
                  {!pathname.includes('contents') && (
                    <>
                      <StyledButton
                        type="link"
                        variant="bar"
                        onClick={() => onClose()}
                        marginRight={{ base: '0px', lg: '10px' }}
                        minWidth="0px"
                      >
                        <Icon as={TimesIcon} />
                      </StyledButton>
                    </>
                  )}
                  <Popover
                    placement="topRight"
                    trigger="click"
                    content={
                      <PlaylistOverlay title={contentSectionTitle} playList={playList} currentIndex={currentIndex} />
                    }
                  >
                    <StyledButton
                      type="link"
                      variant="bar"
                      onClick={() => setShowAction(false)}
                      display={{ base: 'block', lg: 'none' }}
                      minWidth="0px"
                    >
                      <Tooltip placement="top" title="播放清單">
                        <Icon as={PlaylistIcon} />
                      </Tooltip>
                    </StyledButton>
                  </Popover>
                </HStack>
                <Flex
                  justifyContent="start"
                  alignItems="center"
                  display={{ base: 'none', lg: 'block' }}
                  marginLeft="10px"
                >
                  <Link to={link}>
                    <StyledTitle>{title}</StyledTitle>
                  </Link>
                  <StyledDuration>{`${durationFormat(progress)} / ${durationFormat(duration)}`}</StyledDuration>
                </Flex>
              </Flex>
              <Flex
                alignItems="center"
                justifyContent="center"
                width="100%"
                position="absolute"
                bottom="10px"
                right="0px"
                left="0px"
              >
                <AudioControls
                  isLoading={isLoading}
                  isPlaying={isPlaying}
                  isLast={isLast}
                  isFirst={isFirst}
                  onPrev={() => onPrev?.()}
                  onBackward={() => audioRef.current && (audioRef.current.currentTime = progress - 15)}
                  onPlay={() => {
                    onPlay(!isPlaying)
                    audioRef.current && (isPlaying ? audioRef.current.pause() : audioRef.current.play())
                    if (isPlaying && audioRef.current) {
                      onAudioEvent({
                        type: 'pause',
                        progress: audioRef.current.currentTime / duration,
                        audioState: {
                          playbackRate: playRate,
                          startedAt: lastEndedTime.current,
                          endedAt: audioRef.current.currentTime,
                        },
                      })
                      lastEndedTime.current = audioRef.current.currentTime
                    }
                  }}
                  onForward={() => audioRef.current && (audioRef.current.currentTime = progress + 15)}
                  onNext={() => onNext?.()}
                />
              </Flex>
              <HStack spacing={{ base: '0px', lg: '10px' }} alignItems="center" justifyContent="end">
                <HStack display={{ base: 'none', md: 'flex' }}>
                  <PlayRateButton
                    variant="bar"
                    playRate={playRate}
                    onChange={rate => {
                      setPlayRate(rate)
                      localStorage.setItem('playRate', rate.toString())
                      audioRef.current && (audioRef.current.playbackRate = rate)
                    }}
                  />
                  <PlayModeButton
                    variant="bar"
                    mode={mode}
                    onChange={mode => {
                      onPlayModeChange(mode)
                      audioRef.current && (audioRef.current.loop = mode === 'single-loop')
                    }}
                  />
                </HStack>
                <Popover
                  placement="topRight"
                  trigger="click"
                  content={
                    <PlaylistOverlay title={contentSectionTitle} playList={playList} currentIndex={currentIndex} />
                  }
                >
                  <StyledButton
                    type="link"
                    variant="bar"
                    onClick={() => setShowAction(false)}
                    display={{ base: 'none', lg: 'block' }}
                  >
                    <Tooltip placement="top" title="播放清單">
                      <Icon as={PlaylistIcon} />
                    </Tooltip>
                  </StyledButton>
                </Popover>
                <Box display={{ base: 'block', md: 'none' }}>
                  <StyledButton type="link" variant="bar" onClick={() => setShowAction(!showAction)}>
                    <Icon as={EllipsisIcon} />
                  </StyledButton>
                </Box>
              </HStack>
            </Flex>
          </Box>
        </Box>
      </Box>
      <audio
        ref={ref => {
          audioRef.current = ref
        }}
        src={audioUrl}
        autoPlay={true}
        loop={mode === 'single-loop'}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            audioRef.current.currentTime = lastEndedAt === audioRef.current.duration ? 0 : lastEndedAt
            audioRef.current.playbackRate = playRate
            setDuration(audioRef.current.duration)
            onPlay(true)
          }
        }}
        onEnded={() => {
          audioRef.current &&
            onAudioEvent?.({
              type: 'ended',
              progress: audioRef.current.currentTime / duration,
              audioState: {
                playbackRate: playRate,
                startedAt: lastEndedTime.current,
                endedAt: duration,
              },
            })
          lastEndedTime.current = duration
          playList.length === 1 ? onPlay(true) : isLast && mode === 'sequential' ? onPlay(false) : onNext()
        }}
        onTimeUpdate={() =>
          audioRef.current &&
          onAudioEvent({
            type: 'progress',
            progress: audioRef.current.currentTime / duration,
            audioState: {
              playbackRate: playRate,
              startedAt: lastEndedTime.current,
              endedAt: audioRef.current.currentTime,
            },
          })
        }
        onError={() => {
          onClose()
          localStorage.removeItem('playing')
        }}
      />
    </>
  )
}

export default AudioPlayer
