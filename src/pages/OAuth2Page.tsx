import { message } from 'antd'
import axios from 'axios'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { BackendServerError, BindDeviceError, LoginDeviceError } from 'lodestar-app-element/src/helpers/error'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import { StringParam, useQueryParam } from 'use-query-params'
import OverBindDeviceModal from '../components/auth/login/OverBindDeviceModal'
import OverLoginDeviceModal from '../components/auth/login/OverLoginDeviceModal'
import { handleError } from '../helpers'
import { decodeOauthState, normalizeRedirect } from '../helpers/oauthState'
import { codeMessages } from '../helpers/translation'
import LoadingPage from '../pages/LoadingPage'

export type ProviderType = 'facebook' | 'google' | 'line' | 'parenting' | 'commonhealth' | 'cw'

const providerTypes: ProviderType[] = ['facebook', 'google', 'line', 'parenting', 'commonhealth', 'cw']

const parseOauthState = (rawState: string | null | undefined) => {
  const state = decodeOauthState(rawState) ?? {}
  const provider =
    typeof state.provider === 'string' && providerTypes.includes(state.provider as ProviderType)
      ? (state.provider as ProviderType)
      : null
  return {
    provider,
    redirect: normalizeRedirect(state.redirect ?? '/'),
    accountLinkToken: typeof state.accountLinkToken === 'string' ? state.accountLinkToken : '',
  }
}

const OAuth2Page: React.FC = () => {
  const { provider } = useParams<{ provider: ProviderType }>()

  // cw oauth has already move to lodestar-app-backend
  if (['parenting', 'commonhealth', 'cw'].includes(provider)) {
    return <Oauth2Section />
  }

  return <DefaultOauth2Section />
}

const DefaultOauth2Section: React.FC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const [code] = useQueryParam('code', StringParam)
  const [state] = useQueryParam('state', StringParam)
  const { id: appId, settings } = useApp()
  const { isAuthenticating, currentMemberId, socialLogin } = useAuth()
  const lineCodeExchangedRef = useRef(false)
  const lineIdTokenRef = useRef<string | null>(null)
  // const updateYoutubeChannelIds = useUpdateMemberYouTubeChannelIds()
  const [isOverLoginDeviceModalVisible, setIsOverLoginDeviceModalVisible] = useState(false)
  const [isOverBindDeviceModalVisible, setIsOverBindDeviceModalVisible] = useState(false)
  const [forceLoginLoading, setForceLoginLoading] = useState(false)

  const params = new URLSearchParams('?' + window.location.hash.replace('#', ''))
  const accessToken = params.get('access_token')

  const { provider, redirect, accountLinkToken } = parseOauthState(state || params.get('state'))

  const showSocialLoginError = useCallback(
    (error: any) => {
      if (error instanceof BackendServerError && error.code in codeMessages) {
        const code = error.code as keyof typeof codeMessages
        message.error(formatMessage(codeMessages[code]))
      } else {
        message.error(error?.message)
      }
    },
    [formatMessage],
  )

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

  // Authorization Code Flow (LINE): the code is exchanged by the backend, at most once per page
  useEffect(() => {
    if (
      !isAuthenticating &&
      !currentMemberId &&
      code &&
      provider === 'line' &&
      settings['auth.line_client_id'] &&
      appId &&
      !lineCodeExchangedRef.current
    ) {
      lineCodeExchangedRef.current = true
      axios
        .post<{ code: string; result: { token: string } | null }>(
          `${process.env.REACT_APP_API_BASE_ROOT}/auth/get-oauth-token`,
          {
            appId,
            provider: 'line',
            redirectUri: `https://${window.location.host}/oauth2`,
            code,
          },
          { withCredentials: true },
        )
        .then(({ data }) => {
          const idToken = data?.code === 'SUCCESS' ? data.result?.token : undefined
          if (typeof idToken !== 'string' || !idToken) {
            throw new Error(data?.code || 'E_OAUTH_TOKEN')
          }
          lineIdTokenRef.current = idToken
          if (!socialLogin) {
            throw new Error('social login is unavailable')
          }
          return socialLogin({
            provider: 'line',
            providerToken: idToken,
            accountLinkToken: accountLinkToken,
          })
        })
        .then(() => {
          window.location.href = redirect
        })
        .catch(error => {
          if (error instanceof LoginDeviceError) {
            setIsOverLoginDeviceModalVisible(true)
            return
          }
          if (error instanceof BindDeviceError) {
            setIsOverBindDeviceModalVisible(true)
            return
          }
          showSocialLoginError(error)
          window.location.href = redirect
        })
    }
  }, [
    accountLinkToken,
    appId,
    isAuthenticating,
    currentMemberId,
    code,
    settings,
    provider,
    socialLogin,
    redirect,
    showSocialLoginError,
  ])

  // Implicit Flow
  useEffect(() => {
    if (!isAuthenticating && !currentMemberId && (provider === 'google' || provider === 'facebook')) {
      socialLogin?.({
        provider: provider,
        providerToken: accessToken,
      })
        .then(r => {
          window.location.href = redirect
        })
        .catch(error => {
          if (error instanceof LoginDeviceError) {
            setIsOverLoginDeviceModalVisible(true)
          }
          if (error instanceof BindDeviceError) {
            setIsOverBindDeviceModalVisible(true)
          }

          if (error instanceof BackendServerError) {
            const code = error.code as keyof typeof codeMessages
            message.error(formatMessage(codeMessages[code]))
          } else {
            message.error(error.message)
          }
        })
    }
  }, [isAuthenticating, currentMemberId, socialLogin, provider, accessToken, history, redirect])

  return (
    <>
      <LoadingPage />
      <OverBindDeviceModal
        visible={isOverBindDeviceModalVisible}
        onClose={() => {
          window.location.href = redirect
        }}
      />
      <OverLoginDeviceModal
        visible={isOverLoginDeviceModalVisible}
        onClose={() => {
          window.location.href = redirect
        }}
        onOk={() => {
          if (provider) {
            setForceLoginLoading(true)
            socialLogin?.({
              provider: provider,
              providerToken: provider === 'line' ? lineIdTokenRef.current : accessToken,
              isForceLogin: true,
            })
              .then(r => {
                window.location.href = redirect
              })
              .catch(handleError)
          }
        }}
        loading={forceLoginLoading}
      />
    </>
  )
}

const Oauth2Section: React.FC = () => {
  const history = useHistory()
  const { provider } = useParams<{ provider: ProviderType }>()
  const [state] = useQueryParam('state', StringParam)
  const [code] = useQueryParam('code', StringParam)
  const { id: appId } = useApp()
  const { isAuthenticating, currentMemberId, socialLogin } = useAuth()
  const host = window.location.origin
  const accountLinkToken = sessionStorage.getItem('accountLinkToken') || ''

  const params = new URLSearchParams('?' + window.location.hash.replace('#', ''))
  const { redirect } = parseOauthState(state || params.get('state'))

  useEffect(() => {
    if (!isAuthenticating && !currentMemberId && appId && code) {
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
        .then(({ data }) => {
          const token = data?.code === 'SUCCESS' ? data.result?.token : undefined
          if (typeof token !== 'string' || !token) {
            throw new Error(data?.message || data?.code || 'E_OAUTH_TOKEN')
          }
          if (!socialLogin) {
            throw new Error('social login is unavailable')
          }
          return socialLogin({
            provider,
            providerToken: token,
            accountLinkToken: accountLinkToken,
          })
        })
        .then(() => {
          window.location.href = redirect
        })
        .catch(handleError)
    }
  }, [accountLinkToken, appId, code, currentMemberId, history, host, isAuthenticating, provider, redirect, socialLogin])

  return <LoadingPage />
}

export default OAuth2Page
