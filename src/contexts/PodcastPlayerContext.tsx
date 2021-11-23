import { useInterval } from '@chakra-ui/react'
import axios from 'axios'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { createContext, useEffect, useRef, useState } from 'react'
import ReactHowler from 'react-howler'
import { usePodcastProgramContent } from '../hooks/podcast'
import { PodcastProgramContent } from '../types/podcast'

export type PodcastPlayerMode = 'loop' | 'single-loop' | 'random'

type PodcastPlayerContextValue = {
  title: string
  sound: ReactHowler | null
  loading: boolean
  playing: boolean
  currentIndex: number
  podcastProgramIds: string[]
  podcastAlbumId: string
  visible: boolean
  mode: PodcastPlayerMode
  rate: number
  progress: number
  currentPodcastProgramContent: PodcastProgramContent | null
  changePlayingState?: (state: boolean) => void
  changeRate?: (rate: number) => void
  changeMode?: (mode: PodcastPlayerMode) => void
  close?: () => void
  shift?: (quantity: number) => void
  setup?: (options: {
    title?: string
    podcastProgramIds?: string[]
    podcastAlbumId?: string
    currentIndex?: number
  }) => void
  setSeek?: React.Dispatch<React.SetStateAction<number>>
}

const defaultPodcastPlayerContext: PodcastPlayerContextValue = {
  title: '',
  sound: null,
  loading: true,
  playing: Boolean(Number(localStorage.getItem('podcast.playing') || 1)),
  currentIndex: Number(localStorage.getItem('podcast.currentIndex')) || 0,
  podcastProgramIds: JSON.parse(localStorage.getItem('podcastProgramIds') || '[]') || [],
  podcastAlbumId: localStorage.getItem('podcastAlbumId') || '',
  currentPodcastProgramContent: null,
  visible: false,
  mode: 'loop',
  rate: Number(localStorage.getItem('podcast.rate')) || 1,
  progress: 0,
}
const PodcastPlayerContext = createContext<PodcastPlayerContextValue>(defaultPodcastPlayerContext)

export const PodcastPlayerProvider: React.FC = ({ children }) => {
  const howlerRef = useRef<ReactHowler>()
  const modeRef = useRef<PodcastPlayerMode>(defaultPodcastPlayerContext.mode)
  const { currentMemberId, authToken } = useAuth()
  const [title, setTitle] = useState('')
  const [visible, setVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(defaultPodcastPlayerContext.currentIndex)
  const [podcastProgramIds, setPodcastProgramIds] = useState<string[]>(defaultPodcastPlayerContext.podcastProgramIds)
  const [podcastAlbumId, setPodcastAlbumId] = useState<string>(defaultPodcastPlayerContext.podcastAlbumId)
  const currentPodcastProgramId = podcastProgramIds[currentIndex]
  const { loadingPodcastProgram, podcastProgram } = usePodcastProgramContent(currentPodcastProgramId)
  const [playing, setPlaying] = useState(defaultPodcastPlayerContext.playing)
  const [rate, setRate] = useState(defaultPodcastPlayerContext.rate)
  const [soundLoading, setSoundLoading] = useState(true)
  // const { podcastProgramProgress, refetchPodcastProgramProgress } = usePodcastProgramProgress(currentPodcastProgramId)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    howlerRef.current && howlerRef.current.howler.rate(rate)
  }, [rate])

  useEffect(() => {
    localStorage.setItem('podcast.playing', Number(playing).toString())
  }, [playing])

  useEffect(() => {
    localStorage.setItem('podcastProgramIds', JSON.stringify(podcastProgramIds))
  }, [podcastProgramIds])

  useEffect(() => {
    setSoundLoading(true)
    setProgress(0)
    localStorage.setItem('podcast.currentIndex', JSON.stringify(currentIndex))
  }, [currentIndex])

  useEffect(() => {
    localStorage.setItem('podcast.rate', JSON.stringify(rate))
  }, [rate])

  useEffect(() => {
    localStorage.setItem('podcastAlbumId', podcastAlbumId)
  }, [podcastAlbumId])

  useInterval(() => {
    howlerRef.current && setProgress(howlerRef.current.seek())
  }, 500)

  useInterval(() => {
    if (playing && podcastProgramIds[currentIndex] && currentMemberId && authToken) {
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
    }
  }, 5000)
  return (
    <PodcastPlayerContext.Provider
      value={{
        title,
        sound: howlerRef.current || null,
        loading: loadingPodcastProgram || soundLoading,
        playing,
        rate,
        currentIndex,
        podcastProgramIds,
        podcastAlbumId,
        currentPodcastProgramContent: podcastProgram,
        visible,
        mode: modeRef.current,
        progress,
        changePlayingState: state => setPlaying(state),
        changeRate: rate => {
          setRate(rate)
        },
        changeMode: mode => {
          modeRef.current = mode
        },
        close: () => {
          setPlaying(false)
          setVisible(false)
        },
        shift: quantity => {
          setCurrentIndex(index => (index + quantity + podcastProgramIds.length) % podcastProgramIds.length)
        },
        setup: options => {
          options.title && setTitle(options.title)
          options.podcastProgramIds && setPodcastProgramIds(options.podcastProgramIds)
          options.podcastAlbumId && setPodcastAlbumId(options.podcastAlbumId)
          typeof options.currentIndex === 'number' && setCurrentIndex(options.currentIndex)
        },
      }}
    >
      {podcastProgram?.url && (
        <ReactHowler
          html5
          ref={ref => ref && (howlerRef.current = ref)}
          src={podcastProgram.url}
          playing={playing}
          onPlay={() => {
            setVisible(true)
            setPlaying(true)
          }}
          onPause={() => setPlaying(false)}
          onStop={() => setPlaying(false)}
          onEnd={() => {
            if (modeRef.current === 'single-loop') {
              howlerRef.current?.seek(0)
            } else if (modeRef.current === 'loop') {
              setCurrentIndex(index => (index + 1) % podcastProgramIds.length)
            } else if (modeRef.current === 'random') {
              setCurrentIndex(
                index =>
                  (index + Math.floor(Math.random() * (podcastProgramIds.length - 1))) % podcastProgramIds.length,
              )
            }
          }}
          onLoad={() => setSoundLoading(false)}
          onLoadError={() => {
            alert('無法載入此音檔，請重新整理頁面')
          }}
        />
      )}
      {children}
    </PodcastPlayerContext.Provider>
  )
}

export default PodcastPlayerContext
