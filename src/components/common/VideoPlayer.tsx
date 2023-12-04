import { Skeleton } from '@chakra-ui/skeleton'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { useContext, useEffect, useRef } from 'react'
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'
import 'video.js/dist/video-js.min.css'
import 'videojs-contrib-quality-levels'
import 'videojs-hls-quality-selector'
import LocaleContext from '../../contexts/LocaleContext'
import { isIOS, isMobile } from '../../helpers'

type VideoJsPlayerProps = {
  loading?: boolean
  error?: string | null
  sources: { src: string; type: string }[]
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
  const playerRef = useRef<VideoJsPlayer | null>(null)
  const { currentLocale } = useContext(LocaleContext)
  const { enabledModules } = useApp()

  const videoOptions: VideoJsPlayerOptions = {
    html5: {
      hls: {
        withCredentials: true,
      },
      vhs: {
        overrideNative: !videojs.browser.IS_SAFARI,
        limitRenditionByPlayerDimensions: false,
        useBandwidthFromLocalStorage: true,
        useNetworkInformationApi: true,
        withCredentials: true,
      },
      nativeTextTracks: videojs.browser.IS_SAFARI,
      nativeAudioTracks: videojs.browser.IS_SAFARI,
      nativeVideoTracks: videojs.browser.IS_SAFARI,
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

  const setCaption = (player: VideoJsPlayer) => {
    const textTracks = player?.textTracks() ?? []
    for (let i = 0; i < textTracks.length; i++) {
      let track = textTracks[i]
      if (track.kind === 'captions' || track.kind === 'subtitles') {
        track.mode = 'showing'
        break
      }
    }
  }

  const handleOnLoadedData = () => {
    if (!playerRef.current) {
      return
    }

    setCaption(playerRef.current)
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
    <div>
      <video
        controlsList="nodownload"
        width="100%"
        className="video-js vjs-big-play-centered"
        ref={ref => {
          if (ref && !playerRef.current && Number(videoOptions.sources?.length) > 0) {
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
        onLoadedData={handleOnLoadedData}
        autoPlay
        controls
      />
    </div>
  )
}

export default VideoPlayer
