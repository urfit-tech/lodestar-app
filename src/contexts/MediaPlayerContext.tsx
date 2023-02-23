import { Button } from '@chakra-ui/react'
import axios from 'axios'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useState } from 'react'
import 'video.js/dist/video-js.css'
import ProgramContentPlayer from '../components/program/ProgramContentPlayer'

type MediaResource = {
  title: string
  type: 'ProgramContent'
  target: string
}
type MediaPlayerValue = {
  resourceList: MediaResource[]
  currentResource: MediaResource | null
  updateElementList?: (resourceList: MediaResource[]) => void
  play?: (index: number) => void
}
const defaultMediaPlayValue = { resourceList: [] as MediaResource[], currentResource: null }
const MediaPlayerContext = React.createContext<MediaPlayerValue>(defaultMediaPlayValue)

export const MediaPlayerProvider: React.FC = ({ children }) => {
  const { authToken } = useAuth()
  const [resourceList, setSourceList] = useState(defaultMediaPlayValue.resourceList)
  const [currentIndex, setCurrentIndex] = useState<number>()
  const currentResource = currentIndex === undefined ? null : resourceList[currentIndex]
  return (
    <MediaPlayerContext.Provider
      value={{
        resourceList,
        currentResource,
        updateElementList: sList => setSourceList(sList),
        play: index => setCurrentIndex(index),
      }}
    >
      {children}
      {currentResource?.type === 'ProgramContent' && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            margin: 16,
            width: 600,
            maxWidth: '100%',
            boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div className="d-flex justify-content-end p-1" style={{ background: 'white', border: '1px solid gray' }}>
            <Button variant="link" onClick={() => setCurrentIndex(undefined)}>
              X
            </Button>
          </div>
          <ProgramContentPlayer
            programContentId={currentResource.target}
            onVideoEvent={e => {
              if (e.type === 'progress') {
                // FIXME: insert progress strategy
                // insertProgramProgress(e.progress)
              } else {
                axios
                  .post(
                    `${process.env.REACT_APP_API_BASE_ROOT}/tasks/player-event-logs/`,
                    {
                      programContentId: currentResource.target,
                      data: e.videoState,
                    },
                    { headers: { authorization: `Bearer ${authToken}` } },
                  )
                  .then(({ data: { code, result } }) => {
                    if (code === 'SUCCESS') {
                      return
                    }
                  })
                  .catch(() => {})
                if (e.type === 'ended') {
                  // FIXME: insert progress strategy
                  // insertProgramProgress(1)?.then(() => refetchProgress())
                  setCurrentIndex(index => (index === undefined ? undefined : index + 1))
                }
              }
            }}
          />
        </div>
      )}
    </MediaPlayerContext.Provider>
  )
}

export default MediaPlayerContext
