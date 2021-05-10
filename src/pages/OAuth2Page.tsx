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
  const [code] = useQueryParam('code', StringParam)
  const [state] = useQueryParam('state', StringParam)
  const history = useHistory()
  const { settings } = useApp()
  const { isAuthenticating, currentMemberId, socialLogin } = useAuth()
  const updateYoutubeChannelIds = useUpdateMemberYouTubeChannelIds()

  const params = new URLSearchParams('?' + window.location.hash.replace('#', ''))
  const accessToken = params.get('access_token')

  const {
    provider = null,
    redirect = '/',
  }: {
    provider: 'facebook' | 'google' | 'line' | 'parenting' | null
    redirect: string
  } = JSON.parse(atob(decodeURIComponent(state || params.get('state') || '')) || '{}')

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
  }, [accessToken, updateYoutubeChannelIds, currentMemberId, history, redirect, formatMessage])

  useEffect(() => {
    if (!isAuthenticating && currentMemberId && provider === 'google') {
      handleFetchYoutubeApi()
    }
  }, [currentMemberId, handleFetchYoutubeApi, isAuthenticating, provider])

  // Authorization Code Flow
  useEffect(() => {
    const clientId = settings['auth.line_client_id']
    const clientSecret = settings['auth.line_client_secret']
    if (!isAuthenticating && !currentMemberId && code && provider === 'line' && clientId && clientSecret) {
      const redirectUri = `https://${window.location.hostname}:${window.location.port}/oauth2`

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
  }, [isAuthenticating, currentMemberId, code, settings, provider, socialLogin, history, redirect])

  // Implicit Flow
  useEffect(() => {
    if (!isAuthenticating && !currentMemberId && (provider === 'google' || provider === 'facebook')) {
      socialLogin?.({
        provider,
        providerToken: accessToken,
      })
        .then(() => history.push(redirect))
        .catch(handleError)
    }
  }, [isAuthenticating, currentMemberId, socialLogin, provider, accessToken, history, redirect])

  return <LoadingPage />
}

export default OAuth2Page
