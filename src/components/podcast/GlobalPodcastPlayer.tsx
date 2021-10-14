import { useInterval } from '@chakra-ui/hooks'
import axios from 'axios'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useContext, useState } from 'react'
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
    podcastProgramIds,
    currentIndex,
    currentPodcastProgramContent,
  } = useContext(PodcastPlayerContext)
  const { currentMemberId, authToken } = useAuth()
  useInterval(() => {
    sound && setProgress(sound.seek())
  }, 500)
  useInterval(() => {
    axios.post(
      `${process.env.REACT_APP_API_BASE_ROOT}/tasks/podcast-program-progress`,
      {
        podcastProgramId: podcastProgramIds[currentIndex],
        memberId: currentMemberId,
        progress: progress, // TODO: changed if progress more than before
        lastProgress: progress,
        podcastAlbumId: null, // TODO: check what to do here
      },
      { headers: { authorization: `Bearer ${authToken}` } },
    )
  }, 3000)
  return visible ? (
    <PodcastPlayer
      loading={loading}
      title={currentPodcastProgramContent?.title || '---'}
      link={`/podcasts/${podcastProgramIds[currentIndex]}`}
      duration={sound?.duration() || 0}
      progress={progress}
      playing={playing}
      mode={mode}
      playRate={sound?.rate()}
      onPlay={() => sound?.play()}
      onPause={() => sound?.pause()}
      onBackward={(seconds = 5) => sound?.seek(sound.seek() - seconds)}
      onForward={(seconds = 5) => sound?.seek(sound.seek() + seconds)}
      onPlayRateChange={rate => sound?.rate(rate)}
      onModeChange={mode => changeMode?.(mode)}
      onSeek={progress => sound?.seek(progress)}
      onClose={() => close?.()}
      onPrev={() => shift?.(-1)}
      onNext={() => shift?.(1)}
    />
  ) : null
}

export default GlobalPodcastPlayer
