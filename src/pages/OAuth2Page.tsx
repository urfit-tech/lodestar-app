import { message } from 'antd'
import React, { useCallback, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../components/auth/AuthContext'
import { handleError } from '../helpers'
import { profileMessages } from '../helpers/translation'
import { useUpdateMemberYouTubeChannelIds } from '../hooks/member'
import LoadingPage from './LoadingPage'

const OAuth2Page: React.FC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { isAuthenticating, currentMemberId, socialLogin } = useAuth()
  const updateYoutubeChannelIds = useUpdateMemberYouTubeChannelIds()

  const params = new URLSearchParams('?' + window.location.hash.replace('#', ''))
  const accessToken = params.get('access_token')
  const state: {
    provider: string
    redirect: string
  } = JSON.parse(params.get('state') || '{}')

  const handleSocialLogin = useCallback(() => {
    socialLogin?.({
      provider: state.provider,
      providerToken: accessToken,
    })
      .then(() => history.push(state.redirect))
      .catch(handleError)
  }, [accessToken, history, socialLogin, state])

  const handleFetchYoutubeApi = useCallback(() => {
    fetch('https://www.googleapis.com/youtube/v3/channels?part=id&mine=true', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        try {
          const youtubeIds: string[] = data.items.map((item: any) => item.id)
          updateYoutubeChannelIds({
            variables: {
              memberId: currentMemberId,
              data: youtubeIds,
            },
          }).then(() => history.push(state.redirect))
        } catch (error) {
          message.error(formatMessage(profileMessages.form.message.noYouTubeChannel))
          history.push(state.redirect)
        }
      })
  }, [accessToken, currentMemberId, formatMessage, history, state, updateYoutubeChannelIds])

  useEffect(() => {
    if (!isAuthenticating && currentMemberId && state.provider === 'google') {
      handleFetchYoutubeApi()
    }
  }, [currentMemberId, handleFetchYoutubeApi, isAuthenticating, state.provider])

  useEffect(() => {
    if (!isAuthenticating && !currentMemberId && state.provider) {
      handleSocialLogin()
    }
  }, [currentMemberId, handleSocialLogin, isAuthenticating, state.provider])

  return <LoadingPage />
}

export default OAuth2Page
