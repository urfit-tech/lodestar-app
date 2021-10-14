import { Howl } from 'howler'
import React, { createContext, useEffect, useState } from 'react'
import { usePodcastProgramContent } from '../hooks/podcast'
import { PodcastProgramContent } from '../types/podcast'

export type PodcastPlayerMode = 'loop' | 'single-loop' | 'random'

type PodcastPlayerContextValue = {
  title: string
  sound: Howl | null
  loading: boolean
  playing: boolean
  currentIndex: number
  podcastProgramIds: string[]
  visible: boolean
  mode: PodcastPlayerMode
  currentPodcastProgramContent: PodcastProgramContent | null
  changeMode?: (mode: PodcastPlayerMode) => void
  close?: () => void
  shift?: (quantity: number) => void
  setup?: (options: { title?: string; podcastProgramIds?: string[]; currentIndex?: number }) => void
}

const defaultPodcastPlayerContext: PodcastPlayerContextValue = {
  title: '',
  sound: null,
  loading: true,
  playing: false,
  currentIndex: Number(localStorage.getItem('podcast.currentIndex')) || 0,
  podcastProgramIds: JSON.parse(localStorage.getItem('podcastProgramIds') || '[]') || [],
  currentPodcastProgramContent: null,
  visible: false,
  mode: 'loop',
}
const PodcastPlayerContext = createContext<PodcastPlayerContextValue>(defaultPodcastPlayerContext)

export const PodcastPlayerProvider: React.FC = ({ children }) => {
  const [title, setTitle] = useState('')
  const [visible, setVisible] = useState(false)
  const [sound, setSound] = useState<Howl | null>(null)
  const [mode, setMode] = useState(defaultPodcastPlayerContext.mode)
  const [currentIndex, setCurrentIndex] = useState(defaultPodcastPlayerContext.currentIndex)
  const [podcastProgramIds, setPodcastProgramIds] = useState<string[]>(defaultPodcastPlayerContext.podcastProgramIds)
  const currentPodcastProgramId = podcastProgramIds[currentIndex]
  const { loadingPodcastProgram, podcastProgram } = usePodcastProgramContent(currentPodcastProgramId)
  const [playing, setPlaying] = useState(defaultPodcastPlayerContext.playing)
  // const { podcastProgramProgress, refetchPodcastProgramProgress } = usePodcastProgramProgress(currentPodcastProgramId)

  useEffect(() => {
    localStorage.setItem('podcastProgramIds', JSON.stringify(podcastProgramIds))
  }, [podcastProgramIds])

  useEffect(() => {
    localStorage.setItem('podcast.currentIndex', JSON.stringify(currentIndex))
  }, [currentIndex])

  useEffect(() => {
    setSound(sound => {
      sound?.unload()
      if (podcastProgram?.url) {
        return new Howl({
          html5: true,
          autoplay: true,
          src: podcastProgram.url,
          onplay: () => {
            setVisible(true)
            setPlaying(true)
          },
          onpause: () => {
            setPlaying(false)
          },
          onstop: () => {
            setPlaying(false)
          },
          onend: () => {
            setPlaying(false)
            if (mode === 'single-loop') {
              sound?.seek(0)
              sound?.play()
            } else if (mode === 'loop') {
              setCurrentIndex(index => (index + 1) % podcastProgramIds.length)
            } else if (mode === 'random') {
              setCurrentIndex(
                index =>
                  (index + Math.floor(Math.random() * (podcastProgramIds.length - 1))) % podcastProgramIds.length,
              )
            }
          },
        })
      } else {
        return null
      }
    })
  }, [podcastProgram?.url, podcastProgramIds.length])
  return (
    <PodcastPlayerContext.Provider
      value={{
        title,
        sound,
        loading: loadingPodcastProgram,
        playing,
        currentIndex,
        podcastProgramIds,
        currentPodcastProgramContent: podcastProgram,
        visible,
        mode,
        changeMode: mode => {
          setMode(mode || (mode === 'loop' ? 'single-loop' : mode === 'single-loop' ? 'random' : 'loop'))
        },
        close: () => {
          sound?.pause()
          setVisible(false)
        },
        shift: quantity => {
          setCurrentIndex(index => (index + quantity + podcastProgramIds.length) % podcastProgramIds.length)
        },
        setup: options => {
          options.title && setTitle(options.title)
          options.podcastProgramIds && setPodcastProgramIds(options.podcastProgramIds)
          options.currentIndex && setCurrentIndex(options.currentIndex)
        },
      }}
    >
      {children}
    </PodcastPlayerContext.Provider>
  )
}

export default PodcastPlayerContext
