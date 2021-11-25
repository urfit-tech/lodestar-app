import { useInterval } from '@chakra-ui/react'
import axios from 'axios'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { createContext, useEffect, useRef, useState } from 'react'
import { usePodcastProgramContent } from '../hooks/podcast'
import { PodcastProgramContent } from '../types/podcast'

export type PodcastPlayerMode = 'loop' | 'single-loop' | 'random'

const dummyAudio =
  'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'
type PodcastPlayerContextValue = {
  title: string
  loading: boolean
  playing: boolean
  currentIndex: number
  podcastProgramIds: string[]
  podcastAlbumId: string
  visible: boolean
  mode: PodcastPlayerMode
  rate: number
  duration: number
  progress: number
  currentPodcastProgramContent: PodcastProgramContent | null
  changePlayingState?: (state: boolean) => void
  changeRate?: (rate: number) => void
  changeMode?: (mode: PodcastPlayerMode) => void
  close?: () => void
  shift?: (quantity: number) => void
  seek?: (position: number) => void
  setup?: (options: {
    title?: string
    podcastProgramIds?: string[]
    podcastAlbumId?: string
    currentIndex?: number
  }) => void
}

const defaultPodcastPlayerContext: PodcastPlayerContextValue = {
  title: '',
  loading: true,
  playing: false,
  currentIndex: Number(localStorage.getItem('podcast.currentIndex')) || 0,
  podcastProgramIds: JSON.parse(localStorage.getItem('podcastProgramIds') || '[]') || [],
  podcastAlbumId: localStorage.getItem('podcastAlbumId') || '',
  currentPodcastProgramContent: null,
  visible: Boolean(Number(localStorage.getItem('podcast.playing') || 0)),
  mode: (localStorage.getItem('podcast.mode') || 'loop') as PodcastPlayerMode,
  rate: Number(localStorage.getItem('podcast.rate')) || 1,
  duration: 0,
  progress: 0,
}
const PodcastPlayerContext = createContext<PodcastPlayerContextValue>(defaultPodcastPlayerContext)

export const PodcastPlayerProvider: React.FC = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const modeRef = useRef<PodcastPlayerMode>(defaultPodcastPlayerContext.mode)
  const { currentMemberId, authToken } = useAuth()
  const [title, setTitle] = useState('')
  const [visible, setVisible] = useState(defaultPodcastPlayerContext.visible)
  const [currentIndex, setCurrentIndex] = useState(defaultPodcastPlayerContext.currentIndex)
  const [podcastProgramIds, setPodcastProgramIds] = useState<string[]>(defaultPodcastPlayerContext.podcastProgramIds)
  const [podcastAlbumId, setPodcastAlbumId] = useState<string>(defaultPodcastPlayerContext.podcastAlbumId)
  const currentPodcastProgramId = podcastProgramIds[currentIndex]
  const { loadingPodcastProgram, podcastProgram } = usePodcastProgramContent(currentPodcastProgramId)
  const [playing, setPlaying] = useState(defaultPodcastPlayerContext.playing)
  const [rate, setRate] = useState(defaultPodcastPlayerContext.rate)
  const [duration, setDuration] = useState(0)
  // const { podcastProgramProgress, refetchPodcastProgramProgress } = usePodcastProgramProgress(currentPodcastProgramId)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    localStorage.setItem('podcast.rate', JSON.stringify(rate))
    audioRef.current && (audioRef.current.playbackRate = rate)
  }, [rate])

  useEffect(() => {
    localStorage.setItem('podcast.playing', Number(playing).toString())
    playing && setVisible(true)
    playing ? audioRef.current?.play() : audioRef.current?.pause()
  }, [playing])

  useEffect(() => {
    localStorage.setItem('podcastProgramIds', JSON.stringify(podcastProgramIds))
  }, [podcastProgramIds])

  useEffect(() => {
    setProgress(0)
    localStorage.setItem('podcast.currentIndex', JSON.stringify(currentIndex))
  }, [currentIndex])

  useEffect(() => {
    localStorage.setItem('podcastAlbumId', podcastAlbumId)
  }, [podcastAlbumId])

  useInterval(() => {
    audioRef.current && setProgress(audioRef.current.currentTime)
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
    <>
      <audio
        ref={ref => {
          audioRef.current = ref
        }}
        src={podcastProgram?.url}
        loop={modeRef.current === 'single-loop'}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          if (modeRef.current === 'loop') {
            setCurrentIndex(index => (index + 1) % podcastProgramIds.length)
          } else if (modeRef.current === 'random') {
            setCurrentIndex(
              index => (index + Math.floor(Math.random() * (podcastProgramIds.length - 1))) % podcastProgramIds.length,
            )
          }
        }}
      />
      <PodcastPlayerContext.Provider
        value={{
          title,
          loading: loadingPodcastProgram,
          playing,
          rate,
          currentIndex,
          podcastProgramIds,
          podcastAlbumId,
          currentPodcastProgramContent: podcastProgram,
          visible,
          mode: modeRef.current,
          duration,
          progress,
          changePlayingState: state => {
            audioRef.current && (audioRef.current.autoplay = state)
            setPlaying(state)
          },
          changeRate: rate => {
            setRate(rate)
          },
          changeMode: mode => {
            modeRef.current = mode
            localStorage.setItem('podcast.mode', mode)
            audioRef.current && (audioRef.current.loop = mode === 'single-loop')
          },
          close: () => {
            setPlaying(false)
            setVisible(false)
          },
          shift: quantity => {
            setCurrentIndex(index => (index + quantity + podcastProgramIds.length) % podcastProgramIds.length)
          },
          seek: position => {
            audioRef.current && (audioRef.current.currentTime = position)
          },
          setup: options => {
            options.title && setTitle(options.title)
            options.podcastProgramIds && setPodcastProgramIds(options.podcastProgramIds)
            options.podcastAlbumId && setPodcastAlbumId(options.podcastAlbumId)
            typeof options.currentIndex === 'number' && setCurrentIndex(options.currentIndex)
          },
        }}
      >
        {children}
      </PodcastPlayerContext.Provider>
    </>
  )
}

export default PodcastPlayerContext
