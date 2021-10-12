import React, { createContext, useCallback, useState } from 'react'
import { usePodcastProgramContent, usePodcastProgramProgress } from '../hooks/podcast'
import { PodcastProgramContent } from '../types/podcast'

type PlaylistContentProps = {
  id: string | null
  podcastProgramIds: string[]
  currentIndex: number
  title?: string
  podcastAlbumId?: string
  isPreview?: boolean
}
export type PlaylistModeType = 'loop' | 'single-loop' | 'random'

type PodcastPlayerProps = {
  visible: boolean
  isPlaying: boolean
  maxDuration: number
  playlistContent: PlaylistContentProps | null
  playlistMode: PlaylistModeType
  currentPlayingId: string
  currentPodcastProgram: PodcastProgramContent | null
  isPodcastProgramChanged: boolean
  loadingPodcastProgram: boolean
  progress: number
  lastProgress: number
  togglePlaylistMode?: () => void
  setIsPlaying?: React.Dispatch<React.SetStateAction<boolean>>
  setPlaylistContent?: (playlistContent: PlaylistContentProps) => void
  setupPlaylist?: (playlistContent: PlaylistContentProps) => void
  playNow?: (playlistContent: PlaylistContentProps) => void
  shift?: (quantity: 1 | -1) => void
  closePlayer?: () => void
  setMaxDuration?: React.Dispatch<React.SetStateAction<number>>
  refetchPodcastProgramProgress?: () => void
}

const PodcastPlayerContext = createContext<PodcastPlayerProps>({
  visible: false,
  isPlaying: false,
  playlistContent: null,
  playlistMode: 'loop',
  currentPlayingId: '',
  currentPodcastProgram: null,
  isPodcastProgramChanged: false,
  loadingPodcastProgram: false,
  maxDuration: 0,
  progress: 0,
  lastProgress: 0,
})

export const PodcastPlayerProvider: React.FC = ({ children }) => {
  const [visible, setVisible] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [maxDuration, setMaxDuration] = useState(0)
  const [playlistContent, setPlaylistContent] = useState<PlaylistContentProps | null>(null)
  const [playlistMode, setPlaylistMode] = useState<PlaylistModeType>('loop')
  const [shuffledPodcastProgramIds, setShuffledPodcastProgramIds] = useState<string[]>([])
  const currentPlayingId = playlistContent?.podcastProgramIds[playlistContent.currentIndex] || ''
  const { loadingPodcastProgram, podcastProgram } = usePodcastProgramContent(currentPlayingId)
  const { podcastProgramProgress, refetchPodcastProgramProgress } = usePodcastProgramProgress(currentPlayingId)

  return (
    <PodcastPlayerContext.Provider
      value={{
        visible,
        isPlaying,
        playlistContent,
        playlistMode,
        loadingPodcastProgram,
        currentPlayingId,
        currentPodcastProgram: podcastProgram,
        progress: podcastProgramProgress?.progress || 0,
        lastProgress: podcastProgramProgress?.lastProgress || 0,
        maxDuration,
        isPodcastProgramChanged: podcastProgram?.id !== currentPlayingId && maxDuration > 0,
        togglePlaylistMode: () => {
          if (playlistMode === 'loop') {
            setPlaylistMode('single-loop')
          } else if (playlistMode === 'single-loop') {
            setPlaylistMode('random')
            const currentPodcastProgramId = playlistContent?.podcastProgramIds[playlistContent.currentIndex] || ''
            const tmpList = [
              ...(playlistContent?.podcastProgramIds.filter(
                podcastProgramId => podcastProgramId !== currentPodcastProgramId,
              ) || []),
            ]
            // shuffle the podcast programs in playlist
            for (let i = tmpList.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1))
              ;[tmpList[i], tmpList[j]] = [tmpList[j], tmpList[i]]
            }
            currentPodcastProgramId && tmpList.unshift(currentPodcastProgramId)
            setShuffledPodcastProgramIds(tmpList)
          } else {
            setPlaylistMode('loop')
          }
        },
        setIsPlaying,
        setPlaylistContent,
        setupPlaylist: useCallback(
          playlistContent => {
            setPlaylistContent(playlistContent)
            setPlaylistMode('loop')
            !visible && setVisible(true)
            setIsPlaying(false)
          },
          [visible],
        ),
        playNow: playlistContent => {
          setPlaylistContent(playlistContent)
          setPlaylistMode('loop')
          !visible && setVisible(true)
          setIsPlaying(true)
        },
        shift: quantity => {
          if (!playlistContent) {
            return
          }

          if (playlistMode === 'random') {
            const currentShuffledIndex = shuffledPodcastProgramIds.findIndex(
              podcastProgramId => podcastProgramId === playlistContent.podcastProgramIds[playlistContent.currentIndex],
            )
            const targetPodcastProgramId = shuffledPodcastProgramIds[currentShuffledIndex + quantity]
            if (!targetPodcastProgramId) {
              return
            }
            const targetIndex = playlistContent.podcastProgramIds.findIndex(
              podcastProgramId => podcastProgramId === targetPodcastProgramId,
            )
            if (targetIndex > -1) {
              setPlaylistContent({
                ...playlistContent,
                currentIndex: targetIndex,
              })
            }
          } else if (playlistMode === 'loop') {
            setPlaylistContent({
              ...playlistContent,
              currentIndex: playlistContent.podcastProgramIds[playlistContent.currentIndex + quantity]
                ? playlistContent.currentIndex + quantity
                : quantity > 0
                ? 0
                : playlistContent.podcastProgramIds.length - 1,
            })
          }
        },
        closePlayer: () => {
          setVisible(false)
          setPlaylistContent(null)
        },
        setMaxDuration,
        refetchPodcastProgramProgress,
      }}
    >
      {children}
    </PodcastPlayerContext.Provider>
  )
}

export default PodcastPlayerContext
