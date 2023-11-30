import axios from 'axios'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useContext, useEffect, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import AudioPlayerContext, { AudioPlayerMode } from '../../contexts/AudioPlayerContext'
import { useInsertProgress, useProgramContentProgress } from '../../contexts/ProgressContext'
import { useProgram, useProgramContent, useProgramContentLog } from '../../hooks/program'
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
    lastEndedAt,
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
  const { programContentProgress, refetchProgress } = useProgramContentProgress(programId, currentMemberId || '')
  const { program } = useProgram(programId)
  const { programContentLog, loadingContentLog, refetchContentLog } = useProgramContentLog(
    programId,
    currentMemberId || '',
  )
  const { programContent } = useProgramContent(programContentId)
  // const { recentProgramContent, RefetchRecentProgramContentId } = useRecentProgramContentLogContentId(
  //   currentMemberId || '',
  // )
  // const { recentProgramId, RefetchRecentProgramId } = useProgramId(recentProgramContent?.contentId)

  const programContentBodyType = programContent?.programContentBody?.type
  const pathname = location.pathname
  const playList = program.contentSections
    .map(p => p.contents)
    .flat()
    .map(content => {
      const contentId = content.id
      const progress = programContentProgress?.find(progress => progress.programContentId === contentId)
      const lastEndedAt =
        !loadingContentLog && programContentLog?.find(contentLog => contentLog.contentId === contentId)?.endedAt
      const lastContentProgress = progress?.lastProgress
      const contentProgress = progress?.progress

      return {
        ...content,
        lastProgress: lastContentProgress,
        progress: contentProgress,
        lastEndedAt: lastEndedAt,
      }
    })

  const currentIndex = playList.findIndex(p => p.id === contentId)

  useEffect(() => {
    function visibilitychange() {
      setDocumentVisible(!documentVisible)
    }
    document.addEventListener('visibilitychange', visibilitychange)
    // RefetchRecentProgramContentId()
    // RefetchRecentProgramId()
    if (
      playList[currentIndex] &&
      audioPlayerVisibleState !== 'close' &&
      ((playList[currentIndex].contentType === 'audio' && playList[currentIndex].audios.length !== 0) ||
        (isBackgroundMode &&
          playList[currentIndex].contentType === 'video' &&
          playList[currentIndex].videos.length !== 0))
    ) {
      document.title = `${playList[currentIndex].title} | ${settings['title']}`
      changeGlobalPlayingState?.(true)
    } else {
      changeGlobalPlayingState?.(false)
    }
    // const memberId = pathname.split('/')[2]
    // if (pathname.includes('members') && recentProgramId && memberId === currentMemberId && playList[currentIndex]) {
    //   if (programId === recentProgramId) {
    //     setup?.({
    //       backgroundMode: isBackgroundMode,
    //       contentType,
    //       programId,
    //       contentId,
    //       videoId,
    //       source,
    //       lastEndedAt,
    //     })
    //   }
    //   if (programId !== recentProgramId) {
    //     setup?.({
    //       backgroundMode: isBackgroundMode,
    //       programId: recentProgramId,
    //       videoId: recentProgramContent?.videoId,
    //       contentId: recentProgramContent?.contentId,
    //       lastEndedAt: recentProgramContent?.endedAt,
    //       contentType: recentProgramContent?.contentType,
    //       source: recentProgramContent?.source,
    //     })
    //   }
    //   changeGlobalPlayingState?.(true)
    //   if (audioPlayerVisibleState === 'close') {
    //     changeGlobalPlayingState?.(false)
    //   }
    // }
    if (pathname.includes('contents')) {
      const programId = pathname.split('/')[2]
      const contentId = pathname.split('/')[4]
      setProgramContentId(contentId)
      if (programContentBodyType === 'audio' && programContent?.audios.length !== 0) {
        refetchContentLog()
        const lastEndedAt = programContentLog?.find(contentLog => contentLog.contentId === programContentId)?.endedAt
        setup?.({
          backgroundMode: isBackgroundMode,
          title: programContent?.title || '',
          contentSectionTitle: programContent?.contentSectionTitle || '',
          programId: programId,
          contentId,
          contentType: programContent?.contentType || '',
          lastEndedAt,
        })
        if (programContent?.audios.length === 0) {
          close?.()
        }
      } else if (
        programContent &&
        programContentBodyType === 'video' &&
        isBackgroundMode &&
        programContent.videos[0]?.data?.source !== 'youtube' &&
        programContent.videos.length !== 0
      ) {
        setup?.({
          backgroundMode: true,
          title: programContent?.title || '',
          contentSectionTitle: programContent.contentSectionTitle || '',
          programId: programId,
          contentId: programContentId,
          contentType: programContent.contentType || '',
          videoId: programContent.videos[0]?.id,
          source: programContent.videos[0]?.options?.cloudflare ? 'cloudflare' : programContent.videos[0]?.data?.source,
        })
        if (programContent.videos.length === 0) {
          close?.()
        }
      } else {
        close?.()
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
    audioPlayerVisibleState,
    changeGlobalPlayingState,
    close,
    currentIndex,
    documentVisible,
    isBackgroundMode,
    pathname,
    playList,
    programContent,
    programContentBodyType,
    programContentId,
    programContentLog,
    refetchContentLog,
    settings,
    setup,
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

      if (isBackgroundMode) {
        const nextContentType = playList[nextIndex].contentType
        const nextVideo = playList[nextIndex].videos
        const nextAudio = playList[nextIndex].audios
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
        if (playList[nextIndex].contentType === 'audio' && playList[nextIndex].audios?.length !== 0) {
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
          lastEndedAt={playList[currentIndex]?.lastEndedAt || lastEndedAt}
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
            const { id: contentId, progress } = playList[currentIndex]
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
                  initialProgress: progress || 0,
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
                initialProgress: progress || 0,
              }).then(() => refetchProgress())
            }
          }}
        />
      ) : null}
    </>
  )
}

export default GlobalAudioPlayer
