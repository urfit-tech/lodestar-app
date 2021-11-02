import { ButtonProps } from '@chakra-ui/button'
import { Icon } from '@chakra-ui/icons'
import { Button, Divider, Popover } from 'antd'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import React, { useContext, useState } from 'react'
import { AiOutlineLoading } from 'react-icons/ai'
import { defineMessages, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import PodcastPlayerContext, { PodcastPlayerMode } from '../../contexts/PodcastPlayerContext'
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

const durationFormat: (time: number) => string = time => {
  return `${Math.floor(time / 60)}:${Math.floor(time % 60)
    .toString()
    .padStart(2, '0')}`
}

const PodcastPlayer: React.VFC<{
  loading?: boolean
  playing?: boolean
  title: string
  link: string
  duration: number
  progress: number
  playRate?: number
  mode: PodcastPlayerMode
  onPlay?: () => void
  onPause?: () => void
  onBackward?: (seconds?: number) => void
  onForward?: (seconds?: number) => void
  onPlayRateChange?: (playRate: number) => void
  onPlayModeChange?: (mode: PodcastPlayerMode) => void
  onBeforeSeek?: (progress: number) => void
  onSeek?: (progress: number) => void
  onAfterSeek?: (progress: number) => void
  onClose?: () => void
  onPrev?: () => void
  onNext?: () => void
}> = ({
  loading,
  playing,
  title,
  link,
  duration,
  progress,
  playRate = 1,
  mode = 'loop',
  onPlay,
  onPause,
  onBackward,
  onForward,
  onPlayRateChange,
  onPlayModeChange,
  onBeforeSeek,
  onSeek,
  onAfterSeek,
  onClose,
  onPrev,
  onNext,
}) => {
  const [showAction, setShowAction] = useState(false)
  const { sound, setSeek, durationInfo, setDurationInfo } = useContext(PodcastPlayerContext)

  const onRateChange = (rate: number) => {
    const tmpSeek = sound?.seek()
    onPlayRateChange?.(rate)
    setSeek?.(tmpSeek || 0)
    setDurationInfo?.({ progress, duration })
  }

  const onModeChange = (mode: PodcastPlayerMode) => {
    const tmpSeek = sound?.seek()
    onPlayModeChange?.(mode)
    setSeek?.(tmpSeek || 0)
    setDurationInfo?.({ progress, duration })
  }

  return (
    <StyledWrapper>
      <Responsive.Default>
        <OverlayBlock active={showAction}>
          <ActionBlock className="d-flex align-items-center justify-content-around">
            <div className="flex-grow-1 text-center">
              <PlayRateButton variant="overlay" playRate={playRate} onChange={rate => onRateChange(rate)} />
            </div>
            <Divider type="vertical" style={{ height: '49px' }} />
            <div className="flex-grow-1 text-center">
              <PlayModeButton variant="overlay" mode={mode} onChange={mode => onModeChange?.(mode)} />
            </div>
          </ActionBlock>
        </OverlayBlock>
      </Responsive.Default>

      <div className="pt-3">
        <StyledSlider
          height={8}
          max={duration}
          step={0.1}
          value={progress}
          onBeforeChange={value => onBeforeSeek?.(value)}
          onChange={value => onSeek?.(value)}
          onAfterChange={value => onAfterSeek?.(value)}
        />
      </div>

      <BarBlock className="py-1">
        <div className="container">
          <Responsive.Default>
            <div className="d-flex align-items-center justify-content-between">
              <StyledLink to={link}>
                <StyledTitle className="flex-grow-1">{title}</StyledTitle>
              </StyledLink>
              <StyledDuration className="flex-shrink-0">
                {durationInfo.duration === 0
                  ? `${durationFormat(progress)} / ${durationFormat(duration)}`
                  : `${durationFormat(durationInfo.progress)} / ${durationFormat(durationInfo.duration)}`}
              </StyledDuration>
            </div>
          </Responsive.Default>

          <div className="row flex-nowrap py-2">
            <CloseBlock className="col-1 d-flex align-items-center">
              <StyledButton type="link" variant="bar" onClick={() => onClose?.()}>
                <Icon as={TimesIcon} />
              </StyledButton>
            </CloseBlock>

            <div className="col-2 col-lg-4 d-flex d-lg-block align-items-center justify-content-start">
              <Responsive.Desktop>
                <Link to={link}>
                  <StyledTitle>{title}</StyledTitle>
                </Link>
                <StyledDuration>
                  {durationInfo.duration === 0
                    ? `${durationFormat(progress)} / ${durationFormat(duration)}`
                    : `${durationFormat(durationInfo.progress)} / ${durationFormat(durationInfo.duration)}`}
                </StyledDuration>
              </Responsive.Desktop>
            </div>
            <div className="col-6 col-lg-4 d-flex align-items-center justify-content-center">
              <StyledShiftButton type="link" variant="bar" onClick={() => onPrev?.()}>
                <Icon as={PrevIcon} />
              </StyledShiftButton>
              <StyledButtonGroup className="d-flex align-items-center justify-content-center">
                <StyledButton type="link" variant="bar" onClick={() => onBackward?.()}>
                  <Icon as={Backward5Icon} />
                </StyledButton>
                <StyledButton
                  type="link"
                  variant="bar"
                  className="mx-2 mx-lg-3"
                  height="44px"
                  onClick={() => (playing ? onPause?.() : onPlay?.())}
                >
                  {loading ? (
                    <StyledRotateIcon as={AiOutlineLoading} />
                  ) : (
                    <Icon as={playing ? PauseCircleIcon : PlayCircleIcon} style={{ fontSize: '44px' }} />
                  )}
                </StyledButton>
                <StyledButton type="link" variant="bar" onClick={() => onForward?.()}>
                  <Icon as={Forward5Icon} />
                </StyledButton>
              </StyledButtonGroup>
              <StyledShiftButton type="link" variant="bar" onClick={() => onNext?.()}>
                <Icon as={NextIcon} />
              </StyledShiftButton>
            </div>
            <div className="col-3 col-lg-4 d-flex align-items-center justify-content-end">
              <Responsive.Desktop>
                <PlayRateButton variant="bar" playRate={playRate} onChange={rate => onRateChange(rate)} />
                <PlayModeButton variant="bar" mode={mode} className="ml-4" onChange={mode => onModeChange?.(mode)} />
              </Responsive.Desktop>
              <Popover placement="topRight" trigger="click" content={<PlaylistOverlay />}>
                <StyledButton type="link" variant="bar" className="ml-lg-4" onClick={() => setShowAction(false)}>
                  <Icon as={PlaylistIcon} />
                </StyledButton>
              </Popover>
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
        const changedRate = playRate < 1 ? 1 : playRate < 1.5 ? 1.5 : playRate < 2 ? 2 : 0.5
        onChange?.(changedRate)
      }}
      {...buttonProps}
    >
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
  Omit<ButtonProps, 'variant' | 'mode' | 'onChange'> & {
    variant: 'overlay' | 'bar'
    mode: PodcastPlayerMode
    onChange?: (mode: PodcastPlayerMode) => void
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
            mode === 'loop' ? messages.listLoop : mode === 'single-loop' ? messages.singleLoop : messages.random,
          )}
        </div>
      )}
    </StyledButton>
  )
}

export default PodcastPlayer
