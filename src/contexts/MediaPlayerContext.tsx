import axios from 'axios'
import { throttle } from 'lodash'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useEffect, useRef, useState } from 'react'
import 'video.js/dist/video-js.css'
import AudioPlayer from '../components/common/AudioPlayer'
import { getFileDownloadableLink } from '../helpers'
import { useInsertProgress, useProgramContentProgress } from './ProgressContext'

type MediaResource = {
  title: string
  type: 'ProgramContent'
  target: string
  options?: { [key: string]: any }
}
type MediaPlayerValue = {
  resourceList: MediaResource[]
  currentResource: MediaResource | null
  updateElementList?: (resourceList: MediaResource[]) => void
  play?: (index: number) => void
  visible: boolean
  setMediaPlayerVisible?: (visible: boolean) => void
}
const defaultMediaPlayValue = { resourceList: [] as MediaResource[], currentResource: null, visible: false }
const MediaPlayerContext = React.createContext<MediaPlayerValue>(defaultMediaPlayValue)

export const MediaPlayerProvider: React.FC = ({ children }) => {
  const { id: appId, settings } = useApp()
  const { authToken, currentMemberId } = useAuth()
  const [resourceList, setSourceList] = useState(defaultMediaPlayValue.resourceList)
  const [currentIndex, setCurrentIndex] = useState<number>()
  const [sourceUrl, setSourceUrl] = useState('')
  const [visible, setVisible] = useState(defaultMediaPlayValue.visible)
  const currentResource = currentIndex === undefined ? null : resourceList[currentIndex]
  const endedAtRef = useRef(0)

  const { programContentProgress, refetchProgress } = useProgramContentProgress(
    currentResource?.options?.programId,
    currentMemberId || '',
  )
  const currentProgramContentProgress = programContentProgress?.find(
    progress => progress.programContentId === currentResource?.target,
  )

  const lastProgress =
    (!!currentProgramContentProgress?.lastProgress && currentProgramContentProgress?.lastProgress !== 1) ||
    currentProgramContentProgress?.progress !== 1
      ? currentProgramContentProgress?.lastProgress || 0
      : 0

  const insertProgress = useInsertProgress(currentMemberId || '')

  const insertProgramProgress = throttle(async (progress: number) => {
    if (currentResource) {
      const initialProgress =
        programContentProgress?.find(progress => progress.programContentId === currentResource?.target)?.progress || 0
      const currentProgress = Math.ceil(progress * 20) / 20 // every 5% as a tick
      return await insertProgress?.(currentResource.target, {
        progress: currentProgress > 1 ? 1 : Math.max(currentProgress, initialProgress),
        lastProgress: progress,
      }).catch(() => {})
    }
  }, 5000)

  useEffect(() => {
    if (currentResource?.type === 'ProgramContent') {
      if (currentResource?.options?.contentType === 'audio') {
        getFileDownloadableLink(
          `audios/${appId}/${currentResource.options.programId}/${currentResource.target}`,
          authToken,
        ).then(url => {
          setSourceUrl(url)
        })
      } else if (currentResource?.options?.contentType === 'video') {
        axios
          .post(
            `${process.env.REACT_APP_API_BASE_ROOT}/videos/${currentResource.options.videoId}/token`,
            {},
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            },
          )
          .then(({ data }) => {
            if (data.code === 'SUCCESS') {
              setSourceUrl(`https://cloudflarestream.com/${data.result.token}/manifest/video.m3u8`)
            }
          })
      }
      document.title = `${currentResource.title}${settings['title_concat'] || false ? ` | ${settings['title']}` : ''}`
    }
  }, [currentResource?.options?.contentType, currentResource?.options?.programId, currentResource?.target])

  const insertPlayerEventLog = async (data: { playbackRate: number; startedAt: number; endedAt: number }) => {
    try {
      currentResource &&
        (await axios.post(
          `${process.env.REACT_APP_API_BASE_ROOT}/tasks/player-event-logs/`,
          {
            programContentId: currentResource.target,
            data,
          },
          { headers: { authorization: `Bearer ${authToken}` } },
        ))
    } catch (error) {
      console.error(`Failed to insert player event log`, error)
    }
  }

  return (
    <MediaPlayerContext.Provider
      value={{
        resourceList,
        currentResource,
        updateElementList: sList => setSourceList(sList),
        play: index => {
          setVisible(true)
          setCurrentIndex(index)
        },
        visible,
        setMediaPlayerVisible: visible => {
          setVisible(visible)
        },
      }}
    >
      {children}
      {visible && currentResource?.type === 'ProgramContent' && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
          }}
        >
          <AudioPlayer
            title={currentResource.title}
            audioUrl={sourceUrl}
            lastProgress={lastProgress}
            onPrev={
              currentIndex !== 0
                ? () => {
                    setCurrentIndex(index => (index === undefined ? undefined : index - 1))
                  }
                : undefined
            }
            onNext={
              currentIndex !== resourceList.length - 1
                ? () => {
                    setCurrentIndex(index => (index === undefined ? undefined : index + 1))
                  }
                : undefined
            }
            onAudioEvent={e => {
              if (Math.abs(e.audioState.endedAt - endedAtRef.current) >= 5) {
                insertPlayerEventLog({ ...e.audioState, startedAt: endedAtRef.current || e.audioState.startedAt })
                if (e.type === 'progress') {
                  insertProgramProgress(e.progress)
                }
                endedAtRef.current = e.audioState.endedAt
              }
              if (e.type === 'ended') {
                insertPlayerEventLog({ ...e.audioState, startedAt: endedAtRef.current || e.audioState.startedAt })
                insertProgramProgress(1)?.then(() => refetchProgress())
              }
            }}
            onClose={() => {
              setSourceList([])
              setVisible(false)
            }}
          />
        </div>
      )}
    </MediaPlayerContext.Provider>
  )
}

export default MediaPlayerContext
