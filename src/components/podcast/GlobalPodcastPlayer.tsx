import { useInterval } from '@chakra-ui/hooks'
import axios from 'axios'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useContext, useState } from 'react'
import { Helmet } from 'react-helmet'
import PodcastPlayerContext from '../../contexts/PodcastPlayerContext'
import PodcastPlayer from './PodcastPlayer'

const GlobalPodcastPlayer: React.VFC = () => {
  const [progress, setProgress] = useState(0)
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
    changeRate,
    changePlayingState,
    podcastProgramIds,
    currentIndex,
    currentPodcastProgramContent,
    podcastAlbumId,
  } = useContext(PodcastPlayerContext)
  const { currentMemberId, authToken } = useAuth()
  useInterval(() => {
    sound && setProgress(sound.seek())
  }, 500)
  useInterval(() => {
    playing &&
      podcastProgramIds[currentIndex] &&
      currentMemberId &&
      authToken &&
      axios.post(
        `${process.env.REACT_APP_API_BASE_ROOT}/tasks/podcast-program-progress`,
        {
          podcastProgramId: podcastProgramIds[currentIndex],
          memberId: currentMemberId,
          progress: progress, // TODO: changed if progress more than before
          lastProgress: progress,
          podcastAlbumId: podcastAlbumId,
        },
        { headers: { authorization: `Bearer ${authToken}` } },
      )
  }, 3000)
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
          onModeChange={mode => changeMode?.(mode)}
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
