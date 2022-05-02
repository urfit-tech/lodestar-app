import { Skeleton } from '@chakra-ui/skeleton'
import React, { useContext, useRef } from 'react'
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'
import 'video.js/dist/video-js.min.css'
import 'videojs-contrib-quality-levels'
import 'videojs-hls-quality-selector'
import LocaleContext from '../../contexts/LocaleContext'

type VideoJsPlayerProps = {
  loading?: boolean
  error?: string | null
  source?: { src: string; type: string }
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
const VideoPlayer: React.VFC<VideoJsPlayerProps> = props => {
  const playerRef = useRef<VideoJsPlayer>()
  const { currentLocale } = useContext(LocaleContext)

  if (props.loading) return <Skeleton width="100%" height="400px" />
  if (props.error) return <div>{props.error}</div>

  const videoOptions: VideoJsPlayerOptions = {
    html5: {
      nativeTextTracks: false,
    },
    language: currentLocale,
    playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4],
    poster: props.poster,
    autoplay: true,
    responsive: true,
    fluid: true,
    plugins: {
      hlsQualitySelector: {
        displayCurrentQuality: true,
      },
    },
    sources: props.source ? [props.source] : [],
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
  }
  return (
    <div>
      <video
        width="100%"
        className="video-js vjs-big-play-centered"
        ref={ref => {
          if (playerRef.current) {
            // TODO: do something for rerender
          } else if (ref && props.source) {
            playerRef.current = videojs(ref, videoOptions, function () {
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
              props.onLoadedData && this.on('loadeddata', props.onLoadedData.bind(null, this))
              props.onFullscreenChange && this.on('fullscreenchange', props.onFullscreenChange.bind(null, this))
              props.onWaiting && this.on('waiting', props.onWaiting.bind(null, this))
              props.onCanPlaythrough && this.on('canplaythrough', props.onCanPlaythrough.bind(null, this))
              props.onError && this.on('error', props.onError.bind(null, this))
            })
          }
        }}
        autoPlay
        controls
      />
    </div>
  )
}

export default VideoPlayer
