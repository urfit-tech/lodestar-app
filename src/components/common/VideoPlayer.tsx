import { Skeleton } from '@chakra-ui/skeleton'
import { Stream, StreamProps } from '@cloudflare/stream-react'
import axios from 'axios'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useContext, useEffect, useState } from 'react'
import LanguageContext from '../../contexts/LanguageContext'

const VideoPlayer: React.VFC<{ videoId: string; animated?: boolean } & Partial<StreamProps>> = ({
  videoId,
  animated,
  ...streamProps
}) => {
  const { currentLanguage } = useContext(LanguageContext)
  const { authToken, isAuthenticating } = useAuth()
  const [streamOptions, setStreamOptions] = useState<{
    data: {
      token: string
      poster: string
    } | null
    error: Error | null
  }>()
  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_ROOT}/videos/${videoId}/token`,
        {},
        {
          headers: {
            Authorization: authToken && `Bearer ${authToken}`,
          },
        },
      )
      .then(({ data }) => {
        if (data.code === 'SUCCESS') {
          setStreamOptions({
            data: {
              token: data.result.token,
              poster: data.result.cloudflareOptions.thumbnail,
            },
            error: null,
          })
        } else {
          setStreamOptions({
            data: null,
            error: new Error(data.error),
          })
        }
      })
  }, [authToken, videoId])
  return isAuthenticating ? (
    <div className="text-center">Authenticating...</div>
  ) : streamOptions?.data ? (
    <Stream
      controls
      defaultTextTrack={currentLanguage}
      poster={animated ? streamOptions.data.poster.replace('jpg', 'gif') : streamOptions.data.poster}
      {...streamProps}
      src={streamOptions.data.token}
    />
  ) : streamOptions?.error ? (
    <div>Cannot play the video.</div>
  ) : (
    <Skeleton width="100%" height="400px" />
  )
}

export default VideoPlayer
