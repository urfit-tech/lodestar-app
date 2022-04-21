import React from 'react'

type AzureMediaPlayerProps = {
  id: string
  url: string
  initialSpeed?: number
  onReady?: (player: any) => void
  onDurationChange?: (event: Event) => void
  onVolumeChange?: (event: Event) => void
  onRateChange?: (event: Event) => void
  onEnded?: (event: Event) => void
  onTimeUpdate?: (event: Event) => void
  onPause?: (event: Event) => void
  onPlay?: (event: Event) => void
  onPlaying?: (event: Event) => void
  onSeeking?: (event: Event) => void
  onSeeked?: (event: Event) => void
  onLoadStart?: (event: Event) => void
  onLoadedMetadata?: (event: Event) => void
  onLoadedData?: (event: Event) => void
  onFullscreenChange?: (event: Event) => void
  onWaiting?: (event: Event) => void
  onCanPlaythrough?: (event: Event) => void
  onError?: (event: Event) => void
}
const AzureMediaPlayer = React.forwardRef(
  (
    {
      id,
      url,
      initialSpeed,
      onReady,
      onDurationChange,
      onVolumeChange,
      onRateChange,
      onEnded,
      onTimeUpdate,
      onPause,
      onPlay,
      onPlaying,
      onSeeking,
      onSeeked,
      onLoadStart,
      onLoadedMetadata,
      onLoadedData,
      onFullscreenChange,
      onWaiting,
      onCanPlaythrough,
      onError,
    }: AzureMediaPlayerProps,

    // FIXME: this type should be fixed
    playerRef: any,
  ) => {
    const amp = (window as any).amp || null

    if (amp && playerRef?.current) {
      const player = amp(
        id,
        {
          logo: { enabled: false },
          playbackSpeed: {
            enabled: true,
            initialSpeed: initialSpeed || 1.0,
            speedLevels: [
              { name: 'x4.0', value: 4.0 },
              { name: 'x3.0', value: 3.0 },
              { name: 'x2.0', value: 2.0 },
              { name: 'x1.75', value: 1.75 },
              { name: 'x1.5', value: 1.5 },
              { name: 'x1.25', value: 1.25 },
              { name: 'normal', value: 1.0 },
              { name: 'x0.75', value: 0.75 },
              { name: 'x0.5', value: 0.5 },
            ],
          },
        },
        onReady,
      )
      onDurationChange && player.addEventListener(amp.eventName.durationchange, onDurationChange)
      onVolumeChange && player.addEventListener(amp.eventName.volumechange, onVolumeChange)
      onRateChange && player.addEventListener(amp.eventName.ratechange, onRateChange)
      onEnded && player.addEventListener(amp.eventName.ended, onEnded)
      onTimeUpdate && player.addEventListener(amp.eventName.timeupdate, onTimeUpdate)
      onPause && player.addEventListener(amp.eventName.pause, onPause)
      onPlay && player.addEventListener(amp.eventName.play, onPlay)
      onPlaying && player.addEventListener(amp.eventName.playing, onPlaying)
      onSeeking && player.addEventListener(amp.eventName.seeking, onSeeking)
      onSeeked && player.addEventListener(amp.eventName.seeked, onSeeked)
      onLoadStart && player.addEventListener(amp.eventName.loadstart, onLoadStart)
      onLoadedMetadata && player.addEventListener(amp.eventName.loadedmetadata, onLoadedMetadata)
      onLoadedData && player.addEventListener(amp.eventName.loadeddata, onLoadedData)
      onFullscreenChange && player.addEventListener(amp.eventName.fullscreenchange, onFullscreenChange)
      onWaiting && player.addEventListener(amp.eventName.waiting, onWaiting)
      onCanPlaythrough && player.addEventListener(amp.eventName.canplaythrough, onCanPlaythrough)
      onError && player.addEventListener(amp.eventName.error, onError)
    }

    //Register for events after intialization not in Ready function to ensure all event are captured

    return (
      <video
        id={id}
        ref={ref => {
          if (playerRef) {
            playerRef.current = ref
          }
        }}
        autoPlay
        controls
        className="azuremediaplayer amp-default-skin amp-big-play-centered"
      >
        <source src={url} type="application/vnd.ms-sstr+xml" />
        <p className="amp-no-js">
          To view this video please enable JavaScript, and consider upgrading to a web browser that supports HTML5 video
        </p>
      </video>
    )
  },
)

export default AzureMediaPlayer
