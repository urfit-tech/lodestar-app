import axios from 'axios'
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
  isBackgroundMode: boolean
  programId: string
  videoId: string
  mimeType: string
  contentType: string
  source: string
  contentId: string
  visible: boolean
  lastEndedAt: number
  changePlayingState?: (state: boolean) => void
  changeGlobalPlayingState?: (state: boolean) => void
  changeBackgroundMode?: (state: boolean) => void
  close?: () => void
  setup?: (options: {
    title?: string
    contentSectionTitle?: string
    programId?: string
    contentId: string
    lastEndedAt?: number
    backgroundMode?: boolean
    contentType?: string
    videoId?: string
    source?: string
  }) => void
}

const defaultAudioPlayerContext: AudioPlayerContextValue = {
  title: '',
  contentSectionTitle: '',
  audioUrl: '',
  programId: '',
  mimeType: '',
  lastEndedAt: 0,
  source: '',
  contentId: '',
  videoId: '',
  visible: false,
  contentType: '',
  isPlaying: true,
  isBackgroundMode: false,
}

const AudioPlayerContext = createContext<AudioPlayerContextValue>(defaultAudioPlayerContext)

export const AudioPlayerProvider: React.FC = ({ children }) => {
  const { id: appId } = useApp()
  const { authToken } = useAuth()
  const localPlaying = localStorage.getItem('playing')
  const playing: {
    visible: boolean
    programId: string
    contentId: string
    videoId: string
    backgroundMode: boolean
    contentType: string
    source: string
  } = localPlaying !== null && JSON.parse(localPlaying)
  const [visible, setVisible] = useState(playing.visible || false)
  const [programId, setProgramId] = useState(playing.programId || '')
  const [contentId, setContentId] = useState(playing.contentId || '')
  const [isBackgroundMode, setIsBackgroundMode] = useState(playing.backgroundMode || false)
  const [contentType, setContentType] = useState(playing.contentType || '')
  const [source, setSource] = useState(playing.source || '')
  const [videoId, setVideoId] = useState(playing.videoId || '')
  const [isPlaying, setIsPlaying] = useState(false)
  const [lastEndedAt, setLastEndAt] = useState(0)
  const [title, setTitle] = useState('')
  const [contentSectionTitle, setContentSectionTitle] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [mimeType, setMimeType] = useState('')

  useEffect(() => {
    if (contentType === 'audio') {
      getFileDownloadableLink(`audios/${appId}/${programId}/${contentId}`, authToken).then(audioUrl => {
        if (!audioUrl) {
          setVisible(false)
          localStorage.removeItem('playing')
        }
        setAudioUrl(audioUrl)
        setMimeType('')
      })
    }
    if (contentType === 'video') {
      if (source === 'azure') {
        setMimeType('application/x-mpegURL')
        setAudioUrl(`${source}(format=m3u8-cmaf)`)
      } else if (source === 'cloudflare') {
        axios
          .post(
            `${process.env.REACT_APP_API_BASE_ROOT}/videos/${videoId}/token`,
            {},
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            },
          )
          .then(({ data }) => {
            if (data.code !== 'SUCCESS') {
              setVisible(false)
              localStorage.removeItem('playing')
            }
            if (data.code === 'SUCCESS') {
              setMimeType('application/x-mpegURL')
              setAudioUrl(`https://cloudflarestream.com/${data.result.token}/manifest/video.m3u8`)
            }
          })
      }
    }
  }, [appId, authToken, contentId, contentType, programId, source, videoId])

  return (
    <AudioPlayerContext.Provider
      value={{
        visible,
        title,
        contentSectionTitle,
        audioUrl,
        lastEndedAt,
        mimeType,
        contentType,
        isPlaying,
        videoId,
        source,
        isBackgroundMode,
        programId,
        contentId,
        changePlayingState: state => {
          setIsPlaying(state)
        },
        changeBackgroundMode: state => {
          setIsBackgroundMode(state)
        },
        changeGlobalPlayingState: state => {
          setVisible(state)
        },
        close: () => {
          setVisible(false)
          const playing = {
            backgroundMode: isBackgroundMode,
            isPlaying: false,
            visible: false,
            programId: '',
            contentId: '',
          }
          localStorage.setItem('playing', JSON.stringify(playing))
          localStorage.setItem('audioPlayerVisibleState', 'close')
        },
        setup: options => {
          const {
            title,
            contentSectionTitle,
            programId,
            contentId,
            lastEndedAt,
            backgroundMode,
            contentType,
            videoId,
            source,
          } = options
          title && setTitle(title)
          contentSectionTitle && setContentSectionTitle(contentSectionTitle)
          programId && setProgramId(programId)
          contentId && setContentId(contentId)
          lastEndedAt && setLastEndAt(lastEndedAt)
          contentType && setContentType(contentType)
          videoId && setVideoId(videoId)
          source && setSource(source)
          const playing = {
            backgroundMode,
            visible,
            programId,
            contentId,
            videoId,
            source,
            contentType,
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
