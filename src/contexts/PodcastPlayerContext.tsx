import React, { createContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import ReactHowler from 'react-howler'
import { v4 } from 'uuid'
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
  currentPodcastProgramContent: PodcastProgramContent | null
  durationInfo: { progress: number; duration: number }
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
  setDurationInfo?: React.Dispatch<React.SetStateAction<{ progress: number; duration: number }>>
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
  durationInfo: { progress: 0, duration: 0 },
}
const PodcastPlayerContext = createContext<PodcastPlayerContextValue>(defaultPodcastPlayerContext)

export const PodcastPlayerProvider: React.FC = ({ children }) => {
  const howlerRef = useRef<ReactHowler>()
  const [title, setTitle] = useState('')
  const [visible, setVisible] = useState(false)
  const [mode, setMode] = useState(defaultPodcastPlayerContext.mode)
  const [currentIndex, setCurrentIndex] = useState(defaultPodcastPlayerContext.currentIndex)
  const [podcastProgramIds, setPodcastProgramIds] = useState<string[]>(defaultPodcastPlayerContext.podcastProgramIds)
  const [podcastAlbumId, setPodcastAlbumId] = useState<string>(defaultPodcastPlayerContext.podcastAlbumId)
  const currentPodcastProgramId = podcastProgramIds[currentIndex]
  const { loadingPodcastProgram, podcastProgram } = usePodcastProgramContent(currentPodcastProgramId)
  const [playing, setPlaying] = useState(defaultPodcastPlayerContext.playing)
  const [rate, setRate] = useState(defaultPodcastPlayerContext.rate)
  // const { podcastProgramProgress, refetchPodcastProgramProgress } = usePodcastProgramProgress(currentPodcastProgramId)
  const [seek, setSeek] = useState(0)

  // memo duration and progress
  const [durationInfo, setDurationInfo] = useState({ progress: 0, duration: 0 })

  useLayoutEffect(() => {
    howlerRef.current?.seek(seek)
  }, [seek])

  useEffect(() => {
    localStorage.setItem('podcast.playing', Number(playing).toString())
  }, [playing])

  useEffect(() => {
    localStorage.setItem('podcastProgramIds', JSON.stringify(podcastProgramIds))
  }, [podcastProgramIds])

  useEffect(() => {
    localStorage.setItem('podcast.currentIndex', JSON.stringify(currentIndex))
  }, [currentIndex])

  useEffect(() => {
    localStorage.setItem('podcast.rate', JSON.stringify(rate))
  }, [rate])

  useEffect(() => {
    localStorage.setItem('podcastAlbumId', podcastAlbumId)
  }, [podcastAlbumId])

  // reInit howler to set rate or mode
  const podcastProgramUrl = `${podcastProgram?.url}&hash=${v4()}`

  return (
    <PodcastPlayerContext.Provider
      value={{
        title,
        sound: howlerRef.current || null,
        loading: loadingPodcastProgram,
        playing,
        rate,
        currentIndex,
        podcastProgramIds,
        podcastAlbumId,
        currentPodcastProgramContent: podcastProgram,
        visible,
        mode,
        durationInfo,
        setSeek: currentSeek => setSeek(currentSeek),
        changePlayingState: state => setPlaying(state),
        changeRate: rate => {
          setRate(rate)
        },
        changeMode: mode => {
          setMode(mode || (mode === 'loop' ? 'single-loop' : mode === 'single-loop' ? 'random' : 'loop'))
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
        setDurationInfo: durationInfo => setDurationInfo(durationInfo),
      }}
    >
      {podcastProgram?.url && (
        <ReactHowler
          html5
          ref={ref => ref && (howlerRef.current = ref)}
          src={podcastProgramUrl}
          playing={playing}
          rate={rate}
          onPlay={() => {
            setVisible(true)
            setPlaying(true)
          }}
          onPause={() => setPlaying(false)}
          onStop={() => setPlaying(false)}
          onEnd={() => {
            if (mode === 'single-loop') {
              howlerRef.current?.seek(0)
            } else if (mode === 'loop') {
              setCurrentIndex(index => (index + 1) % podcastProgramIds.length)
            } else if (mode === 'random') {
              setCurrentIndex(
                index =>
                  (index + Math.floor(Math.random() * (podcastProgramIds.length - 1))) % podcastProgramIds.length,
              )
            }
          }}
        />
      )}
      {children}
    </PodcastPlayerContext.Provider>
  )
}

export default PodcastPlayerContext
