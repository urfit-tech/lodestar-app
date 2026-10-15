import { Icon } from '@chakra-ui/icons'
import { Popover, Tooltip } from 'antd'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import React, { useEffect, useState } from 'react'
import { MdVolumeDown, MdVolumeOff, MdVolumeUp } from 'react-icons/md'
import { defineMessages, useIntl } from 'react-intl'
import styled, { css } from 'styled-components'

const messages = defineMessages({
  volume: { id: 'common.VolumeControl.volume', defaultMessage: '音量' },
  mute: { id: 'common.VolumeControl.mute', defaultMessage: '靜音' },
  unmute: { id: 'common.VolumeControl.unmute', defaultMessage: '取消靜音' },
})

const VOLUME_STORAGE_KEY = 'kolable.audioPlayer.volume'

// iOS and iPadOS ignore volume set by the page, so only the hardware buttons can change it there.
// iPadOS reports itself as a Mac, so a touch-capable "Mac" is treated as an iPad.
const isAppleMobileDevice =
  /iPhone|iPad|iPod/i.test(window.navigator.userAgent) ||
  (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)

export const canControlVolume: boolean = (() => {
  if (isAppleMobileDevice) {
    return false
  }
  try {
    const audio = document.createElement('audio')
    audio.volume = 0.5
    return audio.volume === 0.5
  } catch (error) {
    return false
  }
})()

const readStoredVolume = () => {
  try {
    const storedVolume = Number(localStorage.getItem(VOLUME_STORAGE_KEY)) || 1
    return Math.min(1, Math.max(0, storedVolume))
  } catch (error) {
    return 1
  }
}

const VOLUME_CHANGE_EVENT = 'kolable.audioPlayer.volumechange'

/**
 * Volume and mute state for the audio players.
 * The volume level is shared by every audio player on the page and remembered across visits;
 * mute only lasts for the current player.
 */
export const useAudioVolume = () => {
  const [volume, setVolumeState] = useState(readStoredVolume)
  const [muted, setMuted] = useState(false)

  // the podcast player stays mounted for the whole visit, so it has to hear about changes made in other players
  useEffect(() => {
    const handleVolumeChange = (event: Event) => setVolumeState((event as CustomEvent<number>).detail)
    window.addEventListener(VOLUME_CHANGE_EVENT, handleVolumeChange)
    return () => window.removeEventListener(VOLUME_CHANGE_EVENT, handleVolumeChange)
  }, [])

  const setVolume = (nextVolume: number) => {
    try {
      localStorage.setItem(VOLUME_STORAGE_KEY, nextVolume.toString())
    } catch (error) {}
    window.dispatchEvent(new CustomEvent(VOLUME_CHANGE_EVENT, { detail: nextVolume }))
  }

  return { volume, muted, setVolume, setMuted }
}

type VolumeControlVariant = 'bar' | 'overlay' | 'popover'

const StyledWrapper = styled.div<{ variant: VolumeControlVariant }>`
  display: flex;
  align-items: center;
  ${props =>
    props.variant === 'overlay' &&
    css`
      margin-top: 0.75rem;
      padding: 0.75rem 1.5rem 0;
      width: 100%;
      border-top: 1px solid rgba(0, 0, 0, 0.06);
    `}
`
const StyledIconButton = styled.button<{ variant: VolumeControlVariant }>`
  /* positioned so it stays above the lesson bar's absolutely positioned center controls, like the other bar buttons */
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 0;
  height: 24px;
  border: none;
  background: none;
  line-height: 24px;
  cursor: pointer;

  .chakra-icon {
    font-size: 24px;
    color: ${props => (props.variant === 'overlay' ? 'var(--gray-darker)' : 'white')};
  }
  ${props =>
    props.variant !== 'overlay' &&
    css`
      &:hover .chakra-icon {
        color: #cdcdcd;
      }
    `}
`
const StyledSlider = styled(Slider)<{ variant: VolumeControlVariant }>`
  && {
    ${props =>
      props.variant === 'bar'
        ? css`
            margin-left: 8px;
            width: 80px;
          `
        : props.variant === 'overlay'
        ? css`
            flex: 1;
            margin-left: 16px;
          `
        : css`
            margin: 0 auto;
            height: 100px;
          `}
  }
  /* the player bars are dark, so the bar variant stays white whatever the tenant's primary color is */
  .rc-slider-rail {
    background-color: ${props => (props.variant === 'bar' ? 'rgba(255, 255, 255, 0.3)' : '#e9e9e9')};
  }
  .rc-slider-track {
    background-color: ${props => (props.variant === 'bar' ? 'white' : props.theme['@primary-color'])};
  }
  .rc-slider-handle {
    border-color: ${props => (props.variant === 'bar' ? 'white' : props.theme['@primary-color'])};
    box-shadow: none;
  }
`
// the app removes the padding of every antd popover, so the content brings its own
const StyledPopoverContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 10px 10px;

  & > button {
    margin-top: 12px;
  }
`

const VolumeControl: React.FC<{
  variant: VolumeControlVariant
  volume: number
  muted: boolean
  onVolumeChange: (volume: number) => void
  onMutedChange: (muted: boolean) => void
}> = ({ variant, volume, muted, onVolumeChange, onMutedChange }) => {
  const { formatMessage } = useIntl()

  if (!canControlVolume) {
    return null
  }

  const isSilent = muted || volume === 0
  const volumeIcon = isSilent ? MdVolumeOff : volume < 0.5 ? MdVolumeDown : MdVolumeUp
  const muteLabel = formatMessage(isSilent ? messages.unmute : messages.mute)

  const handleMuteToggle = () => {
    if (isSilent) {
      onMutedChange(false)
      volume === 0 && onVolumeChange(1)
    } else {
      onMutedChange(true)
    }
  }

  const handleSliderChange = (value: number) => {
    onVolumeChange(value)
    muted && value > 0 && onMutedChange(false)
  }

  const muteButton = (
    <StyledIconButton
      type="button"
      variant={variant === 'popover' ? 'overlay' : variant}
      aria-label={muteLabel}
      onClick={handleMuteToggle}
    >
      <Icon as={volumeIcon} />
    </StyledIconButton>
  )

  const slider = (
    <StyledSlider
      variant={variant}
      vertical={variant === 'popover'}
      min={0}
      max={1}
      step={0.01}
      value={isSilent ? 0 : volume}
      onChange={handleSliderChange}
    />
  )

  if (variant === 'popover') {
    return (
      <Popover
        placement="top"
        trigger="click"
        content={
          <StyledPopoverContent>
            {slider}
            {muteButton}
          </StyledPopoverContent>
        }
      >
        <StyledIconButton type="button" variant="bar" aria-label={formatMessage(messages.volume)}>
          <Icon as={volumeIcon} />
        </StyledIconButton>
      </Popover>
    )
  }

  return (
    <StyledWrapper variant={variant}>
      {variant === 'bar' ? (
        <Tooltip placement="top" title={muteLabel}>
          {muteButton}
        </Tooltip>
      ) : (
        muteButton
      )}
      {slider}
    </StyledWrapper>
  )
}

export default VolumeControl
