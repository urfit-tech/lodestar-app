import { Skeleton } from '@chakra-ui/skeleton'
import { first, last } from 'lodash'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { IconType } from 'react-icons'
import { MdForward10, MdForward30, MdReplay10, MdReplay30 } from 'react-icons/md'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'
import 'video.js/dist/video-js.min.css'
import 'videojs-contrib-quality-levels'
import 'videojs-hls-quality-selector'
import LocaleContext from '../../contexts/LocaleContext'
import { isIOS, isMobile } from '../../helpers'

const messages = defineMessages({
  skipBackward: { id: 'common.VideoPlayer.skipBackward', defaultMessage: '倒退 {seconds} 秒' },
  skipForward: { id: 'common.VideoPlayer.skipForward', defaultMessage: '快轉 {seconds} 秒' },
})

// shown right after the play button, in this order
const SKIP_BUTTONS: { seconds: number; icon: IconType }[] = [
  { seconds: -30, icon: MdReplay30 },
  { seconds: -10, icon: MdReplay10 },
  { seconds: 10, icon: MdForward10 },
  { seconds: 30, icon: MdForward30 },
]

type SkipButtonOptions = videojs.ComponentOptions & { seconds: number; label: string }

const VideoJsButton = videojs.getComponent('Button')

class SkipButton extends VideoJsButton {
  constructor(player: VideoJsPlayer, options: SkipButtonOptions) {
    super(player, options)
    this.controlText(options.label)
  }

  buildCSSClass() {
    const { seconds } = this.options_ as SkipButtonOptions
    return `vjs-skip-button vjs-skip-button-${Math.abs(seconds)} ${super.buildCSSClass()}`
  }

  handleClick() {
    const { seconds } = this.options_ as SkipButtonOptions
    const player = this.player()
    const duration = player.duration()
    const targetTime = Math.max(0, player.currentTime() + seconds)
    player.currentTime(Number.isFinite(duration) && duration > 0 ? Math.min(duration, targetTime) : targetTime)
  }
}

videojs.registerComponent('SkipButton', SkipButton)

const StyledVideoWrapper = styled.div`
  .vjs-skip-button {
    cursor: pointer;
  }
  .vjs-skip-button .vjs-icon-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .vjs-skip-button svg {
    width: 2.2em;
    height: 2.2em;
  }
  /* narrow players already hide the time and speed controls; keep only the 10-second buttons there */
  .video-js.vjs-layout-tiny .vjs-skip-button-30,
  .video-js.vjs-layout-x-small .vjs-skip-button-30,
  .video-js.vjs-layout-small .vjs-skip-button-30 {
    display: none;
  }
`

type VideoJsPlayerProps = {
  autoPlay?: boolean
  loading?: boolean
  error?: string | null
  sources: { src: string; type: string; withCredentials?: boolean }[]
  captions?: string[]
  poster?: string
  onReady?: (player: VideoJsPlayer) => void
  onDurationChange?: (player: VideoJsPlayer, event: Event) => void
  onVolumeChange?: (player: VideoJsPlayer, event: Event) => void
  onRateChange?: (player: VideoJsPlayer, event: Event) => void
  onEnded?: (player: VideoJsPlayer, event: Event) => void
  onTimeUpdate?: (player: VideoJsPlayer, event: Event) => void
  onPause?: (player: VideoJsPlayer, event: Event) => void
  onPlay?: (player: VideoJsPlayer, event: Event) => void
  onPlaying?: (player: VideoJsPlayer, event: Event) => void
  onSeeking?: (player: VideoJsPlayer, event: Event) => void
  onSeeked?: (player: VideoJsPlayer, event: Event) => void
  onLoadStart?: (player: VideoJsPlayer, event: Event) => void
  onLoadedMetadata?: (player: VideoJsPlayer, event: Event) => void
  onLoadedData?: (player: VideoJsPlayer, event: Event) => void
  onFullscreenChange?: (player: VideoJsPlayer, event: Event) => void
  onWaiting?: (player: VideoJsPlayer, event: Event) => void
  onCanPlaythrough?: (player: VideoJsPlayer, event: Event) => void
  onError?: (player: VideoJsPlayer, event: Event) => void
}
const VideoPlayer: React.FC<VideoJsPlayerProps> = props => {
  const playerRef = useRef<VideoJsPlayer | null>(null)
  const { currentLocale } = useContext(LocaleContext)
  const { enabledModules } = useApp()
  const { formatMessage } = useIntl()
  const [skipIconTargets, setSkipIconTargets] = useState<{ element: Element; icon: IconType }[]>([])
  const videoOptions: VideoJsPlayerOptions = {
    html5: {
      vhs: {
        overrideNative: !(isMobile && isIOS),
        limitRenditionByPlayerDimensions: false,
        useBandwidthFromLocalStorage: true,
        useNetworkInformationApi: true,
      },
      nativeTextTracks: isMobile && isIOS,
      nativeAudioTracks: isMobile && isIOS,
      nativeVideoTracks: isMobile && isIOS,
    },
    language: currentLocale,
    playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4],
    poster: props.poster,
    autoplay: props.autoPlay,
    responsive: true,
    fluid: true,
    aspectRatio: '16:9',
    plugins: {
      hlsQualitySelector: {
        displayCurrentQuality: true,
      },
    },
    sources: props.sources,
    textTrackSettings: {
      persistTextTrackSettings: true,
    },
    userActions: {
      hotkeys: function (event) {
        event.preventDefault()
        // `this` is the player in this context
        const player = this as VideoJsPlayer

        switch (event.which) {
          // whitespace
          case 32:
            player.paused() ? player.play() : player.pause()
            break
          // left arrow
          case 37:
            player.currentTime(player.currentTime() - 10)
            break
          // right arrow
          case 39:
            player.currentTime(player.currentTime() + 10)
            break
        }
      },
    },
    controlBar:
      isMobile && isIOS && enabledModules.background_mode
        ? {
            pictureInPictureToggle: false,
          }
        : undefined,
  }

  const remoteTrackOptionFormatter = (src: string): videojs.TextTrackOptions => {
    const trackSettings = [
      { srclang: 'zh', language: 'Mandarin Chinese', label: '中文' },
      { srclang: 'en', language: 'English', label: 'English' },
      { srclang: 'ko', language: 'Korean', label: '조선말' },
      { srclang: 'ja', language: 'Japanese', label: '日本語' },
      { srclang: 'hi', language: 'Hindi', label: 'हिन्दी' },
      { srclang: 'es', language: 'Spanish', label: 'Español' },
      { srclang: 'ar', language: 'Arabic', label: 'Arabic' },
      { srclang: 'pt', language: 'Portuguese', label: 'Portuguese' },
      { srclang: 'bn', language: 'Bengali', label: 'Bengali' },
      { srclang: 'ru', language: 'Russian', label: 'Russian' },
      { srclang: 'de', language: 'German', label: 'German' },
      { srclang: 'pa', language: 'Panjabi', label: 'Panjabi' },
      { srclang: 'jv', language: 'Javanese', label: 'Javanese' },
      { srclang: 'vi', language: 'Vietnamese', label: 'Vietnamese' },
      { srclang: 'fr', language: 'French', label: 'French' },
      { srclang: 'ur', language: 'Urdu', label: 'Urdu' },
      { srclang: 'it', language: 'Italian', label: 'Italian' },
      { srclang: 'tr', language: 'Turkish', label: 'Turkish' },
      { srclang: 'fa', language: 'Persian', label: 'Persian' },
      { srclang: 'pl', language: 'Polish', label: 'Polish' },
      { srclang: 'uk', language: 'Ukrainian', label: 'Ukrainian' },
      { srclang: 'my', language: 'Burmese', label: 'Burmese' },
      { srclang: 'th', language: 'Thai', label: 'Thai' },
    ]
    const filename = last(src.split('/'))
    const currentLang = trackSettings.find(setting => setting.srclang === first(filename?.split('.')))
    return { src, kind: 'subtitles', default: true, ...currentLang }
  }

  const setCaption = (player: VideoJsPlayer) => {
    const textTracks = player?.textTracks() ?? []

    // REFACTOR: remove this loop after backend fixed api video/.*m3u8
    props.captions?.forEach(src => {
      const labels = []
      for (let i = 0; i < textTracks.length; i++) {
        let track = textTracks[i]
        labels.push(track.label)
      }
      const textTrackOption = remoteTrackOptionFormatter(src)
      if (!labels.includes(textTrackOption.label || '')) player.addRemoteTextTrack(textTrackOption, false)
    })
    //

    for (let i = 0; i < textTracks.length; i++) {
      let track = textTracks[i]

      if (track.kind === 'captions') {
        track.mode = 'hidden'
        break
      }
      if (track.kind === 'subtitles') {
        track.mode = 'showing'
        break
      }
    }
  }

  const addSkipButtons = (player: VideoJsPlayer) => {
    const controlBar = player.getChild('ControlBar')
    if (!controlBar) {
      return
    }
    const iconTargets = SKIP_BUTTONS.map(({ seconds, icon }, index) => {
      const button = controlBar.addChild(
        'SkipButton',
        {
          seconds,
          label: formatMessage(seconds < 0 ? messages.skipBackward : messages.skipForward, {
            seconds: Math.abs(seconds),
          }),
        },
        index + 1,
      )
      return { element: button.el().querySelector('.vjs-icon-placeholder'), icon }
    })
    setSkipIconTargets(
      iconTargets.filter((target): target is { element: Element; icon: IconType } => target.element !== null),
    )
  }

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerRef])

  if (props.loading) return <Skeleton width="100%" height="400px" />
  if (props.error) return <div>{props.error}</div>

  return (
    <StyledVideoWrapper>
      <video
        controlsList="nodownload"
        width="100%"
        className="video-js vjs-big-play-centered"
        ref={ref => {
          if (ref && !playerRef.current && Number(videoOptions.sources?.length) > 0) {
            playerRef.current = videojs(ref, videoOptions, function () {
              addSkipButtons(this)
              this.on('loadeddata', () => {
                setCaption(playerRef.current as VideoJsPlayer)
                props.onLoadedData && props.onLoadedData.bind(null, this)
              })
              props.onDurationChange && this.on('durationchange', props.onDurationChange.bind(null, this))
              props.onVolumeChange && this.on('volumechange', props.onVolumeChange.bind(null, this))
              props.onRateChange && this.on('ratechange', props.onRateChange.bind(null, this))
              props.onEnded && this.on('ended', props.onEnded.bind(null, this))
              props.onTimeUpdate && this.on('timeupdate', props.onTimeUpdate.bind(null, this))
              props.onPause && this.on('pause', props.onPause.bind(null, this))
              props.onPlay && this.on('play', props.onPlay.bind(null, this))
              props.onPlaying && this.on('playing', props.onPlaying.bind(null, this))
              props.onSeeking && this.on('seeking', props.onSeeking.bind(null, this))
              props.onSeeked && this.on('seeked', props.onSeeked.bind(null, this))
              props.onLoadStart && this.on('loadstart', props.onLoadStart.bind(null, this))
              props.onLoadedMetadata && this.on('loadedmetadata', props.onLoadedMetadata.bind(null, this))
              props.onFullscreenChange && this.on('fullscreenchange', props.onFullscreenChange.bind(null, this))
              props.onWaiting && this.on('waiting', props.onWaiting.bind(null, this))
              props.onCanPlaythrough && this.on('canplaythrough', props.onCanPlaythrough.bind(null, this))
              props.onError && this.on('error', props.onError.bind(null, this))
            })
          }
        }}
        autoPlay={props.autoPlay}
        controls
      ></video>
      {skipIconTargets.map(({ element, icon: SkipIcon }, index) =>
        createPortal(<SkipIcon />, element, `skip-icon-${index}`),
      )}
    </StyledVideoWrapper>
  )
}

export default VideoPlayer
