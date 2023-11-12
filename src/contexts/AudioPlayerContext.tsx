import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { createContext, useEffect, useState } from 'react'
import { getFileDownloadableLink } from '../helpers'

export type AudioPlayerMode = 'list-loop' | 'single-loop' | 'random' | 'sequential'

type AudioPlayerContextValue = {
  title: string
  contentSectionTitle: string
  audioUrl: string
  isPlaying: boolean
  programId: string
  contentId: string
  visible: boolean
  lastEndedAt: number
  changePlayingState?: (state: boolean) => void
  changeGlobalPlayingState?: (state: boolean) => void
  close?: () => void
  setup?: (options: {
    title?: string
    contentSectionTitle?: string
    programId?: string
    contentId: string
    lastEndedAt?: number
  }) => void
}

const defaultAudioPlayerContext: AudioPlayerContextValue = {
  title: '',
  contentSectionTitle: '',
  audioUrl: '',
  programId: '',
  lastEndedAt: 0,
  contentId: '',
  visible: false,
  isPlaying: true,
}

const AudioPlayerContext = createContext<AudioPlayerContextValue>(defaultAudioPlayerContext)

export const AudioPlayerProvider: React.FC = ({ children }) => {
  const { id: appId } = useApp()
  const { authToken } = useAuth()
  const localPlaying = localStorage.getItem('playing')
  const playing: { isPlaying: boolean; programId: string; contentId: string } =
    localPlaying !== null && JSON.parse(localPlaying)
  const [visible, setVisible] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [title, setTitle] = useState('')
  const [contentSectionTitle, setContentSectionTitle] = useState('')
  const [programId, setProgramId] = useState(playing.programId)
  const [contentId, setContentId] = useState(playing.contentId)
  const [lastEndedAt, setLastEndAt] = useState(0)
  const [audioUrl, setAudioUrl] = useState('')

  useEffect(() => {
    getFileDownloadableLink(`audios/${appId}/${programId}/${contentId}`, authToken).then(audioUrl =>
      setAudioUrl(audioUrl),
    )
  }, [appId, authToken, contentId, programId])

  return (
    <AudioPlayerContext.Provider
      value={{
        visible,
        title,
        contentSectionTitle,
        audioUrl,
        lastEndedAt,
        isPlaying,
        programId,
        contentId,
        changePlayingState: state => {
          setIsPlaying(state)
        },
        changeGlobalPlayingState: state => {
          setVisible(state)
        },
        close: () => {
          setVisible(false)
          const playing = {
            isPlaying: false,
            programId: '',
            contentId: '',
          }
          localStorage.setItem('playing', JSON.stringify(playing))
          localStorage.setItem('audioPlayerVisibleState', 'close')
        },
        setup: options => {
          const { title, contentSectionTitle, programId, contentId, lastEndedAt } = options
          title && setTitle(title)
          contentSectionTitle && setContentSectionTitle(contentSectionTitle)
          programId && setProgramId(programId)
          contentId && setContentId(contentId)
          lastEndedAt && setLastEndAt(lastEndedAt)
          const playing = {
            isPlaying: true,
            programId,
            contentId,
          }
          localStorage.setItem('playing', JSON.stringify(playing))
          localStorage.setItem('audioPlayerVisibleState', 'open')
        },
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  )
}

export default AudioPlayerContext
