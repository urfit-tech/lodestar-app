import { message } from 'antd'
import axios from 'axios'
import React, { useCallback, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import { StringParam, useQueryParam } from 'use-query-params'
import { useAuth } from '../components/auth/AuthContext'
import { useApp } from '../containers/common/AppContext'
import { handleError } from '../helpers'
import { profileMessages } from '../helpers/translation'
import { useUpdateMemberYouTubeChannelIds } from '../hooks/member'
import LoadingPage from './LoadingPage'

type ProviderType = 'facebook' | 'google' | 'line' | 'parenting'

const OAuth2Page: React.FC = () => {
  const { formatMessage } = useIntl()
  const { provider } = useParams<{ provider: ProviderType }>()
  const [code] = useQueryParam('code', StringParam)
  const [state] = useQueryParam('state', StringParam)
  const history = useHistory()
  const { id: appId, settings } = useApp()
  const { isAuthenticating, currentMemberId, socialLogin, apiHost } = useAuth()
  const updateYoutubeChannelIds = useUpdateMemberYouTubeChannelIds()

  const params = new URLSearchParams('?' + window.location.hash.replace('#', ''))
  const accessToken = params.get('access_token')

  const {
    providerParams = null,
    redirect = '/',
  }: {
    providerParams: ProviderType | null
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
    if (!isAuthenticating && currentMemberId && providerParams === 'google') {
      handleFetchYoutubeApi()
    }
  }, [currentMemberId, handleFetchYoutubeApi, isAuthenticating, providerParams])

  // Authorization Code Flow
  useEffect(() => {
    const clientId = settings['auth.line_client_id']
    const clientSecret = settings['auth.line_client_secret']
    if (!isAuthenticating && !currentMemberId && code && providerParams === 'line' && clientId && clientSecret) {
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
            provider: providerParams,
            providerToken: data.id_token,
          })
        })
        .then(() => history.push(redirect))
        .catch(handleError)
    }
  }, [isAuthenticating, currentMemberId, code, settings, providerParams, socialLogin, history, redirect])

  // Implicit Flow
  useEffect(() => {
    if (!isAuthenticating && !currentMemberId && (providerParams === 'google' || providerParams === 'facebook')) {
      socialLogin?.({
        provider: providerParams,
        providerToken: accessToken,
      })
        .then(() => history.push(redirect))
        .catch(handleError)
    }
  }, [isAuthenticating, currentMemberId, socialLogin, providerParams, accessToken, history, redirect])

  useEffect(() => {
    if (!isAuthenticating && !currentMemberId && provider === 'parenting' && appId && code) {
      const redirectUri = `https://${window.location.hostname}:${window.location.port}/oauth2/parenting`
      axios
        .post(
          `https://${apiHost}/auth/get-oauth-token`,
          {
            appId,
            provider,
            redirectUri,
            code,
          },
          { withCredentials: true },
        )
        .then(({ data: { code, message, result } }) => {
          if (code === 'SUCCESS') {
            return socialLogin?.({
              provider,
              providerToken: result.token,
            })
          }
        })
        .then(() => {
          history.push(redirect)
        })
        .catch(handleError)
    }
  }, [apiHost, appId, code, currentMemberId, history, isAuthenticating, provider, redirect, socialLogin])

  return <LoadingPage />
}

export default OAuth2Page
