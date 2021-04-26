import { message } from 'antd'
import axios from 'axios'
import React, { useCallback, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { StringParam, useQueryParam } from 'use-query-params'
import { useAuth } from '../components/auth/AuthContext'
import { useApp } from '../containers/common/AppContext'
import { handleError } from '../helpers'
import { profileMessages } from '../helpers/translation'
import { useUpdateMemberYouTubeChannelIds } from '../hooks/member'
import LoadingPage from './LoadingPage'

const OAuth2Page: React.FC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { isAuthenticating, currentMemberId, socialLogin } = useAuth()
  const updateYoutubeChannelIds = useUpdateMemberYouTubeChannelIds()
  const { settings } = useApp()
  const [code] = useQueryParam('code', StringParam)
  const [state] = useQueryParam('state', StringParam)

  const params = new URLSearchParams('?' + window.location.hash.replace('#', ''))
  const accessToken = params.get('access_token')

  const {
    provider,
    redirect,
  }: {
    provider: string
    redirect: string
  } = JSON.parse(atob(state || ''))

  const handleSocialLogin = useCallback(() => {
    socialLogin?.({
      provider,
      providerToken: accessToken,
    })
      .then(() => history.push(redirect))
      .catch(handleError)
  }, [accessToken, history, socialLogin, provider])

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
          }).then(() => history.push(redirect))
        } catch (error) {
          message.error(formatMessage(profileMessages.form.message.noYouTubeChannel))
          history.push(redirect)
        }
      })
  }, [accessToken, currentMemberId, formatMessage, history, state, updateYoutubeChannelIds])

  useEffect(() => {
    if (!isAuthenticating && currentMemberId && provider === 'google') {
      handleFetchYoutubeApi()
    }
  }, [currentMemberId, handleFetchYoutubeApi, isAuthenticating, provider])

  useEffect(() => {
    const clientId = settings['auth.line_client_id']
    const clientSecret = settings['auth.line_client_secret']
    if (code && clientId) {
      const redirectUri = `http://${location.hostname}:${location.port}/oauth2`

      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      })

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
      axios
        .post<{ id_token: string }>('https://api.line.me/oauth2/v2.1/token', params, config)
        .then(({ data }) => {
          return socialLogin?.({
            provider,
            providerToken: data.id_token,
          })
        })
        .then(() => history.push(redirect))
        .catch(handleError)
    }
  }, [code, settings])

  useEffect(() => {
    if (!isAuthenticating && !currentMemberId && provider) {
      handleSocialLogin()
    }
  }, [currentMemberId, handleSocialLogin, isAuthenticating, provider])

  return <LoadingPage />
}

export default OAuth2Page
