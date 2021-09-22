import React, { createContext, useCallback, useState } from 'react'
import { usePodcastProgramContent } from '../hooks/podcast'
import { PodcastProgramContent } from '../types/podcast'

type PlaylistContentProps = {
  id: string | null
  podcastProgramIds: string[]
  currentIndex: number
  isPreview?: boolean
}
export type PlaylistModeType = 'loop' | 'single-loop' | 'random'

type PodcastPlayerProps = {
  visible: boolean
  isPlaying: boolean
  maxDuration: number
  playlist: PlaylistContentProps | null
  playlistMode: PlaylistModeType
  currentPlayingId: string
  currentPodcastProgram: PodcastProgramContent | null
  loadingPodcastProgram: boolean
  togglePlaylistMode?: () => void
  setIsPlaying?: React.Dispatch<React.SetStateAction<boolean>>
  setPlaylist?: (playlist: PlaylistContentProps) => void
  setupPlaylist?: (playlist: PlaylistContentProps) => void
  playNow?: (playlist: PlaylistContentProps) => void
  shift?: (quantity: 1 | -1) => void
  closePlayer?: () => void
  setMaxDuration?: React.Dispatch<React.SetStateAction<number>>
}

const PodcastPlayerContext = createContext<PodcastPlayerProps>({
  visible: false,
  isPlaying: false,
  playlist: null,
  playlistMode: 'loop',
  currentPlayingId: '',
  currentPodcastProgram: null,
  loadingPodcastProgram: false,
  maxDuration: 0,
})

export const PodcastPlayerProvider: React.FC = ({ children }) => {
  const [visible, setVisible] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [maxDuration, setMaxDuration] = useState(0)
  const [playlist, setPlaylist] = useState<PlaylistContentProps | null>(null)
  const [playlistMode, setPlaylistMode] = useState<PlaylistModeType>('loop')
  const [shuffledPodcastProgramIds, setShuffledPodcastProgramIds] = useState<string[]>([])

  const currentPlayingId = playlist?.podcastProgramIds[playlist.currentIndex] || ''
  const { loadingPodcastProgram, podcastProgram } = usePodcastProgramContent(currentPlayingId)

  return (
    <PodcastPlayerContext.Provider
      value={{
        visible,
        isPlaying,
        playlist,
        playlistMode,
        currentPlayingId,
        loadingPodcastProgram,
        currentPodcastProgram: podcastProgram,
        maxDuration,
        togglePlaylistMode: () => {
          if (playlistMode === 'loop') {
            setPlaylistMode('single-loop')
          } else if (playlistMode === 'single-loop') {
            setPlaylistMode('random')
            const currentPodcastProgramId = playlist?.podcastProgramIds[playlist.currentIndex] || ''
            const tmpList = [
              ...(playlist?.podcastProgramIds.filter(
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
        setPlaylist,
        setupPlaylist: useCallback(
          playlist => {
            setPlaylist(playlist)
            setPlaylistMode('loop')
            !visible && setVisible(true)
            setIsPlaying(false)
          },
          [visible],
        ),
        playNow: playlist => {
          setPlaylist(playlist)
          setPlaylistMode('loop')
          !visible && setVisible(true)
          setIsPlaying(true)
        },
        shift: quantity => {
          if (!playlist) {
            return
          }

          if (playlistMode === 'random') {
            const currentShuffledIndex = shuffledPodcastProgramIds.findIndex(
              podcastProgramId => podcastProgramId === playlist.podcastProgramIds[playlist.currentIndex],
            )
            const targetPodcastProgramId = shuffledPodcastProgramIds[currentShuffledIndex + quantity]
            if (!targetPodcastProgramId) {
              return
            }
            const targetIndex = playlist.podcastProgramIds.findIndex(
              podcastProgramId => podcastProgramId === targetPodcastProgramId,
            )
            if (targetIndex > -1) {
              setPlaylist({
                ...playlist,
                currentIndex: targetIndex,
              })
            }
          } else if (playlistMode === 'loop') {
            setPlaylist({
              ...playlist,
              currentIndex: playlist.podcastProgramIds[playlist.currentIndex + quantity]
                ? playlist.currentIndex + quantity
                : quantity > 0
                ? 0
                : playlist.podcastProgramIds.length - 1,
            })
          }
        },
        closePlayer: () => {
          setVisible(false)
          setPlaylist(null)
        },
        setMaxDuration,
      }}
    >
      {children}
    </PodcastPlayerContext.Provider>
  )
}

export default PodcastPlayerContext
