// import { message } from 'antd'
import { message } from 'antd'
import axios from 'axios'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { BackendServerError, BindDeviceError, LoginDeviceError } from 'lodestar-app-element/src/helpers/error'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
// import { useIntl } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import { StringParam, useQueryParam } from 'use-query-params'
import OverBindDeviceModal from '../components/auth/login/OverBindDeviceModal'
import OverLoginDeviceModal from '../components/auth/login/OverLoginDeviceModal'
import { handleError } from '../helpers'
import { codeMessages } from '../helpers/translation'
// import { profileMessages } from '../helpers/translation'
// import { useUpdateMemberYouTubeChannelIds } from '../hooks/member'
import LoadingPage from '../pages/LoadingPage'

type ProviderType = 'facebook' | 'google' | 'line' | 'parenting' | 'commonhealth' | 'cw'

const OAuth2Page: React.VFC = () => {
  const { provider } = useParams<{ provider: ProviderType }>()

  // cw oauth has already move to lodestar-app-backend
  if (['parenting', 'commonhealth', 'cw'].includes(provider)) {
    return <Oauth2Section />
  }

  return <DefaultOauth2Section />
}

const DefaultOauth2Section: React.VFC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const [code] = useQueryParam('code', StringParam)
  const [state] = useQueryParam('state', StringParam)
  const { settings } = useApp()
  const { isAuthenticating, currentMemberId, socialLogin } = useAuth()
  // const updateYoutubeChannelIds = useUpdateMemberYouTubeChannelIds()
  const [isOverLoginDeviceModalVisible, setIsOverLoginDeviceModalVisible] = useState(false)
  const [isOverBindDeviceModalVisible, setIsOverBindDeviceModalVisible] = useState(false)
  const [forceLoginLoading, setForceLoginLoading] = useState(false)

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
          }).catch(error => {
            if (error instanceof LoginDeviceError) {
              setIsOverLoginDeviceModalVisible(true)
            } else if (error instanceof BindDeviceError) {
              setIsOverBindDeviceModalVisible(true)
            }

            if (error instanceof BackendServerError) {
              const code = error.code as keyof typeof codeMessages
              message.error(formatMessage(codeMessages[code]))
            } else {
              message.error(error.message)
            }
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
        .then(r => {
          window.location.href = redirect
        })
        .catch(error => {
          if (error instanceof LoginDeviceError) {
            setIsOverLoginDeviceModalVisible(true)
          } else if (error instanceof BindDeviceError) {
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
              providerToken: accessToken,
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

const Oauth2Section: React.VFC = () => {
  const history = useHistory()
  const { provider } = useParams<{ provider: ProviderType }>()
  const [state] = useQueryParam('state', StringParam)
  const [code] = useQueryParam('code', StringParam)
  const { id: appId } = useApp()
  const { isAuthenticating, currentMemberId, socialLogin } = useAuth()
  const host = window.location.origin
  const accountLinkToken = sessionStorage.getItem('accountLinkToken') || ''

  const params = new URLSearchParams('?' + window.location.hash.replace('#', ''))
  const {
    redirect = '/',
  }: {
    redirect: string
  } = JSON.parse(atob(decodeURIComponent(state || params.get('state') || '')) || '{}')

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
        .then(({ data: { code, message, result } }) => {
          if (code === 'SUCCESS') {
            return socialLogin?.({
              provider,
              providerToken: result.token,
              accountLinkToken: accountLinkToken,
            })
          }
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
