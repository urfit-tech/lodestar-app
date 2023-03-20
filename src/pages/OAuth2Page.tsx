// import { message } from 'antd'
import axios from 'axios'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useEffect } from 'react'
// import { useIntl } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import { StringParam, useQueryParam } from 'use-query-params'
import { handleError } from '../helpers'
// import { profileMessages } from '../helpers/translation'
// import { useUpdateMemberYouTubeChannelIds } from '../hooks/member'
import LoadingPage from '../pages/LoadingPage'

type ProviderType = 'facebook' | 'google' | 'line' | 'parenting' | 'commonhealth' | 'cw'

const OAuth2Page: React.VFC = () => {
  const { provider } = useParams<{ provider: ProviderType }>()

  if (['parenting', 'commonhealth', 'cw'].includes(provider)) {
    return <Oauth2Section />
  }

  return <DefaultOauth2Section />
}

// TODO: add oauth2 sections of Facebook, Google, Line
const DefaultOauth2Section: React.VFC = () => {
  // const { formatMessage } = useIntl()
  const history = useHistory()
  const [code] = useQueryParam('code', StringParam)
  const [state] = useQueryParam('state', StringParam)
  const { settings } = useApp()
  const { isAuthenticating, currentMemberId, socialLogin } = useAuth()
  // const updateYoutubeChannelIds = useUpdateMemberYouTubeChannelIds()

  const params = new URLSearchParams('?' + window.location.hash.replace('#', ''))
  const accessToken = params.get('access_token')

  const {
    provider = null,
    redirect = '/',
    accountLinkToken = '',
  }: {
    provider: ProviderType | null
    redirect: string
    accountLinkToken: string
  } = JSON.parse(atob(decodeURIComponent(state || params.get('state') || '')) || '{}')

  // const handleFetchYoutubeApi = useCallback(() => {
  //   fetch('https://www.googleapis.com/youtube/v3/channels?part=id&mine=true', {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //       accept: 'application/json',
  //     },
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       try {
  //         const youtubeIds: string[] = data.items.map((item: any) => item.id)
  //         updateYoutubeChannelIds({
  //           variables: {
  //             memberId: currentMemberId,
  //             data: youtubeIds,
  //           },
  //         }).then(() => (window.location.href = redirect))
  //       } catch (error) {
  //         message.error(formatMessage(profileMessages.form.message.noYouTubeChannel))
  //         window.location.href = redirect
  //       }
  //     })
  // }, [accessToken, updateYoutubeChannelIds, currentMemberId, history, redirect, formatMessage])

  // useEffect(() => {
  //   if (!isAuthenticating && currentMemberId && provider === 'google') {
  //     handleFetchYoutubeApi()
  //   }
  // }, [currentMemberId, handleFetchYoutubeApi, isAuthenticating, provider])

  // Authorization Code Flow
  useEffect(() => {
    const clientId = settings['auth.line_client_id']
    const clientSecret = settings['auth.line_client_secret']
    if (!isAuthenticating && !currentMemberId && code && provider === 'line' && clientId && clientSecret) {
      const hostPath = window.location.port
        ? `https://${window.location.hostname}:${window.location.port}`
        : `https://${window.location.hostname}`
      const redirectUri = `${hostPath}/oauth2`

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
            provider: provider,
            providerToken: data.id_token,
            accountLinkToken: accountLinkToken,
          })
        })
        .then(() => (window.location.href = redirect))
        .catch(handleError)
    }
  }, [accountLinkToken, isAuthenticating, currentMemberId, code, settings, provider, socialLogin, history, redirect])

  // Implicit Flow
  useEffect(() => {
    if (!isAuthenticating && !currentMemberId && (provider === 'google' || provider === 'facebook')) {
      socialLogin?.({
        provider: provider,
        providerToken: accessToken,
      })
        .then(() => (window.location.href = redirect))
        .catch(handleError)
    }
  }, [isAuthenticating, currentMemberId, socialLogin, provider, accessToken, history, redirect])

  return <LoadingPage />
}

const Oauth2Section: React.VFC = () => {
  const history = useHistory()
  const { provider } = useParams<{ provider: ProviderType }>()
  const [state] = useQueryParam('state', StringParam)
  const [code] = useQueryParam('code', StringParam)
  const { id: appId } = useApp()
  const { isAuthenticating, socialLogin } = useAuth()
  const host = window.location.origin
  const accountLinkToken = sessionStorage.getItem('accountLinkToken') || ''

  const params = new URLSearchParams('?' + window.location.hash.replace('#', ''))
  const {
    redirect = '/',
  }: {
    redirect: string
  } = JSON.parse(atob(decodeURIComponent(state || params.get('state') || '')) || '{}')

  useEffect(() => {
    if (!isAuthenticating && appId && code) {
      const redirectUri = `${host}/oauth2/${provider}`
      axios
        .post(
          `${process.env.REACT_APP_API_BASE_ROOT}/auth/get-oauth-token`,
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
              accountLinkToken: accountLinkToken,
            })
          } else {
            console.log(code, message, result)
          }
        })
        .then(() => {
          window.location.href = redirect
        })
        .catch(handleError)
    } else if (isAuthenticating) {
      window.location.href = redirect
    }
  }, [accountLinkToken, appId, code, history, host, isAuthenticating, provider, redirect, socialLogin])

  return <LoadingPage />
}

export default OAuth2Page
