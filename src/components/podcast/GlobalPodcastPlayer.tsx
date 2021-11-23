import { useContext } from 'react'
import { Helmet } from 'react-helmet'
import PodcastPlayerContext from '../../contexts/PodcastPlayerContext'
import PodcastPlayer from './PodcastPlayer'

const GlobalPodcastPlayer: React.VFC = () => {
  const {
    visible,
    close,
    sound,
    loading,
    shift,
    mode,
    changeMode,
    playing,
    rate,
    progress,
    changeRate,
    changePlayingState,
    podcastProgramIds,
    currentIndex,
    currentPodcastProgramContent,
  } = useContext(PodcastPlayerContext)

  return (
    <>
      <Helmet>{currentPodcastProgramContent?.title && <title>{currentPodcastProgramContent.title}</title>}</Helmet>
      {visible ? (
        <PodcastPlayer
          loading={loading}
          title={currentPodcastProgramContent?.title || '---'}
          link={`/podcasts/${podcastProgramIds[currentIndex]}`}
          duration={sound?.duration() || 0}
          progress={progress}
          playing={playing}
          mode={mode}
          playRate={rate}
          onPlay={() => changePlayingState?.(true)}
          onPause={() => changePlayingState?.(false)}
          onBackward={(seconds = 5) => sound?.seek(sound.seek() - seconds)}
          onForward={(seconds = 5) => sound?.seek(sound.seek() + seconds)}
          onPlayRateChange={rate => changeRate?.(rate)}
          onPlayModeChange={mode => changeMode?.(mode)}
          onSeek={progress => sound?.seek(progress)}
          onClose={() => close?.()}
          onPrev={() => shift?.(-1)}
          onNext={() => shift?.(1)}
        />
      ) : null}
    </>
  )
}

export default GlobalPodcastPlayer
