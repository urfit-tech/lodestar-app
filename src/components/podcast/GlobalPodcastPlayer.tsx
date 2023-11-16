import { useContext, useEffect } from 'react'
import { useLocation } from 'react-router'
import PodcastPlayerContext from '../../contexts/PodcastPlayerContext'
import PodcastPlayer from './PodcastPlayer'

const GlobalPodcastPlayer: React.VFC = () => {
  const {
    visible,
    close,
    loading,
    shift,
    seek,
    mode,
    changeMode,
    playing,
    rate,
    duration,
    progress,
    changeRate,
    changePlayingState,
    podcastProgramIds,
    currentIndex,
    currentPodcastProgramContent,
  } = useContext(PodcastPlayerContext)

  const location = useLocation()
  const pathname = location.pathname

  useEffect(() => {
    if (pathname.includes('contents')) {
      const contentId = pathname.split('/')[4]
      if (contentId) {
        close?.()
      }
    } else if (pathname.includes('members')) {
      close?.()
    }
  }, [close, pathname])

  return (
    <>
      {visible ? (
        <PodcastPlayer
          loading={loading}
          title={currentPodcastProgramContent?.title || '---'}
          link={`/podcasts/${podcastProgramIds[currentIndex]}`}
          duration={duration}
          progress={progress}
          playing={playing}
          mode={mode}
          playRate={rate}
          onPlay={() => changePlayingState?.(true)}
          onPause={() => changePlayingState?.(false)}
          onBackward={(seconds = 5) => seek?.(progress - seconds)}
          onForward={(seconds = 5) => seek?.(progress + seconds)}
          onPlayRateChange={rate => changeRate?.(rate)}
          onPlayModeChange={mode => changeMode?.(mode)}
          onSeek={progress => seek?.(progress)}
          onClose={() => close?.()}
          onPrev={() => shift?.(-1)}
          onNext={() => shift?.(1)}
        />
      ) : null}
    </>
  )
}

export default GlobalPodcastPlayer
