import axios from 'axios'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useContext, useEffect, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import AudioPlayerContext, { AudioPlayerMode } from '../../contexts/AudioPlayerContext'
import { useInsertProgress } from '../../contexts/ProgressContext'
import {
  useProgram,
  useProgramContent,
  useProgramContentLastProgress,
  useProgramId,
  useRecentProgramContent,
} from '../../hooks/program'
import AudioPlayer from './AudioPlayer'

const GlobalAudioPlayer: React.VFC = () => {
  const {
    visible,
    isPlaying,
    isBackgroundMode,
    programId,
    mimeType,
    changePlayingState,
    changeGlobalPlayingState,
    audioUrl,
    contentId,
    videoId,
    contentType,
    title,
    source,
    contentSectionTitle,
    setup,
    close,
  } = useContext(AudioPlayerContext)
  const audioPlayerVisibleState = localStorage.getItem('audioPlayerVisibleState')
  const endedAtRef = useRef(0)
  const history = useHistory()
  const location = useLocation()
  const { authToken, currentMemberId } = useAuth()
  const { settings } = useApp()

  const [mode, setMode] = useState<AudioPlayerMode>('sequential')
  const [programContentId, setProgramContentId] = useState('')
  const [documentVisible, setDocumentVisible] = useState(false)

  const insertProgress = useInsertProgress(currentMemberId || '')
  const { program } = useProgram(programId)
  const { programContent } = useProgramContent(programContentId)
  const { programContentLastProgress, loadingContentLastProgress, refetchContentLastProgress } =
    useProgramContentLastProgress(programId, currentMemberId || '')
  const { recentProgramContent, RefetchRecentProgramContent } = useRecentProgramContent(currentMemberId || '')
  const { recentProgramId, RefetchRecentProgramId } = useProgramId(recentProgramContent?.contentId)

  const pathname = location.pathname
  const playList = program.contentSections
    .map(p => p.contents)
    .flat()
    .map(content => {
      const contentId = content.id
      const lastProgress =
        !loadingContentLastProgress &&
        programContentLastProgress?.find(contentLastProgress => contentLastProgress.contentId === contentId)
          ?.lastProgress

      return {
        ...content,
        lastProgress,
      }
    })

  const currentIndex = playList.findIndex(p => p.id === contentId)

  useEffect(() => {
    function visibilitychange() {
      setDocumentVisible(!documentVisible)
    }
    document.addEventListener('visibilitychange', visibilitychange)
    RefetchRecentProgramContent()
    RefetchRecentProgramId()

    if (playList[currentIndex] && audioPlayerVisibleState !== 'close') {
      const currentContentType = playList[currentIndex].contentType
      const currentAudiosLength = playList[currentIndex].audios.length
      const currentVideosLength = playList[currentIndex].videos.length
      if (
        (currentContentType === 'audio' && currentAudiosLength !== 0) ||
        (isBackgroundMode && currentContentType === 'video' && currentVideosLength !== 0)
      )
        document.title = `${playList[currentIndex].title} | ${settings['title']}`
      changeGlobalPlayingState?.(true)
    } else {
      changeGlobalPlayingState?.(false)
    }

    if (pathname.includes('members')) {
      const memberId = pathname.split('/')[2]
      if (memberId === currentMemberId && recentProgramId && recentProgramContent) {
        if (programId === recentProgramId) {
          setup?.({
            backgroundMode: isBackgroundMode,
            contentType,
            programId,
            contentId,
            videoId,
            source,
          })
        } else {
          setup?.({
            backgroundMode: isBackgroundMode,
            programId: recentProgramId,
            videoId: recentProgramContent.videoId,
            contentId: recentProgramContent.contentId,
            contentType: recentProgramContent.contentType,
            source: recentProgramContent.source,
          })
        }
        changeGlobalPlayingState?.(true)
        if (audioPlayerVisibleState === 'close') {
          changeGlobalPlayingState?.(false)
        }
      }
    }

    if (pathname.includes('contents')) {
      const programId = pathname.split('/')[2]
      const contentId = pathname.split('/')[4]
      setProgramContentId(contentId)
      if (programContent) {
        const programContentBodyType = programContent.programContentBody?.type
        if (programContentBodyType === 'audio' && programContent.audios.length !== 0) {
          refetchContentLastProgress()
          setup?.({
            backgroundMode: isBackgroundMode,
            title: programContent.title,
            contentSectionTitle: programContent.contentSectionTitle,
            programId: programId,
            contentId,
            contentType: programContent.contentType,
          })
        } else if (
          programContent &&
          programContentBodyType === 'video' &&
          isBackgroundMode &&
          programContent.videos[0] &&
          programContent.videos[0].data?.source !== 'youtube' &&
          programContent.videos.length !== 0
        ) {
          const programContentVideo = programContent.videos[0]
          setup?.({
            backgroundMode: true,
            title: programContent.title,
            contentSectionTitle: programContent.contentSectionTitle,
            programId: programId,
            contentId: programContentId,
            contentType: programContent.contentType,
            videoId: programContentVideo.id,
            source: programContentVideo.options?.cloudflare ? 'cloudflare' : programContentVideo.data?.source,
          })
        } else {
          close?.()
        }
      }
    }

    if (pathname.includes('podcasts')) {
      const podcastId = pathname.split('/')[2]
      if (podcastId) {
        changeGlobalPlayingState?.(false)
      }
    }
    return () => document.removeEventListener('visibilitychange', visibilitychange)
  }, [
    RefetchRecentProgramContent,
    RefetchRecentProgramId,
    audioPlayerVisibleState,
    changeGlobalPlayingState,
    close,
    contentId,
    contentType,
    currentIndex,
    currentMemberId,
    documentVisible,
    isBackgroundMode,
    pathname,
    playList,
    programContent,
    programContentId,
    programContentLastProgress,
    programId,
    recentProgramContent,
    recentProgramId,
    refetchContentLastProgress,
    settings,
    setup,
    source,
    videoId,
  ])

  const insertProgramProgress = async ({
    programContentId,
    progress,
    initialProgress,
  }: {
    progress: number
    programContentId: string
    initialProgress: number
  }) => {
    try {
      const currentProgress = Math.ceil(progress * 20) / 20 // every 5% as a tick
      await insertProgress(programContentId, {
        progress: currentProgress > 1 ? 1 : Math.max(currentProgress, initialProgress),
        lastProgress: progress,
      })
    } catch (error) {
      console.error(`Failed to insert program progress`, error)
    }
  }

  const insertPlayerEventLog = async ({
    programContentId,
    data,
  }: {
    programContentId: string
    data: {
      playbackRate: number
      startedAt: number
      endedAt: number
    }
  }) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_ROOT}/tasks/player-event-logs/`,
        {
          programContentId,
          data,
        },
        { headers: { authorization: `Bearer ${authToken}` } },
      )
    } catch (error) {
      console.error(`Failed to insert player event log`, error)
    }
  }

  const nextProgramContent = (quantity: number) => {
    const nextIndex = (currentIndex + quantity + playList.length) % playList.length
    const { id: contentId, programId } = playList[nextIndex]
    history.push(`/programs/${programId}/contents/${contentId}`)
    setup?.({
      backgroundMode: isBackgroundMode,
      programId,
      contentId,
    })
  }

  const nextAudioProgramContent = (quantity: number) => {
    let nextIndex = currentIndex

    while (true) {
      nextIndex = (nextIndex + quantity + playList.length) % playList.length
      const nextContentType = playList[nextIndex].contentType
      const nextAudio = playList[nextIndex].audios
      if (isBackgroundMode) {
        const nextVideo = playList[nextIndex].videos
        const nextContentVideoSource = nextVideo[0]?.data?.source
        if (
          (nextContentType === 'video' && nextContentVideoSource !== 'youtube' && nextVideo.length !== 0) ||
          (nextContentType === 'audio' && nextAudio.length !== 0)
        ) {
          const { id: contentId, programId, title, contentSectionTitle, contentType, videos } = playList[nextIndex]

          setup?.({
            backgroundMode: true,
            title: title || '',
            contentSectionTitle: contentSectionTitle || '',
            programId,
            contentId,
            contentType: contentType || '',
            videoId: videos[0]?.id,
            source: videos[0]?.options?.cloudflare ? 'cloudflare' : videos[0]?.data?.source,
          })
          if (pathname.includes('contents') && documentVisible) {
            history.push(`/programs/${programId}/contents/${contentId}`)
          }

          return
        }
      } else {
        if (nextContentType === 'audio' && nextAudio.length !== 0) {
          const { id: contentId, programId, title, contentSectionTitle, contentType } = playList[nextIndex]

          setup?.({
            backgroundMode: isBackgroundMode,
            title,
            contentSectionTitle: contentSectionTitle || '',
            programId,
            contentId,
            contentType: contentType || '',
          })
          if (pathname.includes('contents') && documentVisible) {
            history.push(`/programs/${programId}/contents/${contentId}`)
          }
          return
        }
      }
    }
  }

  return (
    <>
      {playList.length !== 0 && visible ? (
        <AudioPlayer
          title={playList[currentIndex]?.title || title}
          contentSectionTitle={contentSectionTitle}
          playList={playList}
          isPlaying={isPlaying}
          lastProgress={
            pathname.includes('members') ? recentProgramContent?.lastProgress : playList[currentIndex]?.lastProgress
          }
          audioUrl={audioUrl}
          mimeType={mimeType}
          mode={mode}
          currentIndex={currentIndex}
          onPlay={state => changePlayingState?.(state)}
          onClose={() => close?.()}
          onPrev={() => {
            const quantity = mode === 'random' ? Math.floor(Math.random() * playList.length) : -1
            if (!pathname.includes('contents') || documentVisible) {
              nextAudioProgramContent(quantity)
            } else {
              nextProgramContent(quantity)
            }
          }}
          onPlayModeChange={mode => setMode(mode)}
          onNext={() => {
            const quantity = mode === 'random' ? Math.floor(Math.random() * playList.length) : 1
            if (!pathname.includes('contents') || documentVisible) {
              nextAudioProgramContent(quantity)
            } else {
              nextProgramContent(quantity)
            }
          }}
          onAudioEvent={e => {
            const { playbackRate, startedAt, endedAt } = e.audioState
            const { id: contentId, lastProgress } = playList[currentIndex]
            if (Math.abs(e.audioState.endedAt - endedAtRef.current) >= 5) {
              insertPlayerEventLog({
                programContentId: contentId,
                data: {
                  playbackRate,
                  startedAt: endedAtRef.current || startedAt,
                  endedAt,
                },
              })
              if (e.type === 'progress') {
                insertProgramProgress({
                  programContentId: contentId,
                  progress: e.progress,
                  initialProgress: lastProgress || 0,
                })
              }
              endedAtRef.current = endedAt
            }

            if (e.type === 'ended') {
              insertPlayerEventLog({
                programContentId: contentId,
                data: {
                  playbackRate,
                  startedAt: endedAtRef.current || startedAt,
                  endedAt,
                },
              })
              insertProgramProgress({
                programContentId: contentId,
                progress: 1,
                initialProgress: lastProgress || 0,
              })
            }
          }}
        />
      ) : null}
    </>
  )
}

export default GlobalAudioPlayer
