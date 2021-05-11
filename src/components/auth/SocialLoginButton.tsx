import { Button, Icon, Spinner } from '@chakra-ui/react'
import { Spin } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { useApp } from '../../containers/common/AppContext'
import { authMessages } from '../../helpers/translation'
import FacebookLogoImage from '../../images/FB-logo.png'
import GoogleLogoImage from '../../images/google-logo.png'
import { ReactComponent as LineIcon } from '../../images/line-icon.svg'

const FacebookLogo = styled.span`
  margin-right: 0.5rem;
  height: 24px;
  width: 24px;
  background-image: url(${FacebookLogoImage});
  background-size: 13px 24px;
  background-repeat: no-repeat;
  background-position: center;
`
const GoogleLogo = styled.span`
  margin-right: 0.5rem;
  height: 24px;
  width: 24px;
  background-image: url(${GoogleLogoImage});
  background-size: 24px 24px;
  background-repeat: no-repeat;
  background-position: center;
`

const FacebookLoginButton: React.VFC = () => {
  const { settings } = useApp()
  const { formatMessage } = useIntl()
  const [back] = useQueryParam('back', StringParam)
  const host = window.location.hostname

  return (
    <a
      href={'https://www.facebook.com/v6.0/dialog/oauth?client_id={{CLIENT_ID}}&redirect_uri={{REDIRECT_URI}}&scope={{SCOPE}}&state={{STATE}}&response_type=token'
        .replace('{{CLIENT_ID}}', `${settings['auth.facebook_app_id']}`)
        .replace('{{REDIRECT_URI}}', `https://${host}/oauth2`)
        .replace('{{SCOPE}}', 'public_profile,email')
        .replace(
          '{{STATE}}',
          btoa(
            JSON.stringify({
              provider: 'facebook',
              redirect: back || window.location.pathname,
            }),
          ),
        )}
    >
      <Button
        style={{
          border: '1px solid #3b5998',
          height: '44px',
          width: '100%',
          background: '#3b5998',
          color: '#fff',
        }}
      >
        <FacebookLogo />
        <span>{formatMessage(authMessages.ui.facebookLogin)}</span>
      </Button>
    </a>
  )
}

const GoogleLoginButton: React.VFC = () => {
  const { settings } = useApp()
  const { formatMessage } = useIntl()
  const [back] = useQueryParam('back', StringParam)
  const host = window.location.origin

  return (
    <a
      href={'https://accounts.google.com/o/oauth2/v2/auth?client_id={{CLIENT_ID}}&response_type=token&scope={{SCOPE}}&access_type=online&redirect_uri={{REDIRECT_URI}}&state={{STATE}}'
        .replace('{{CLIENT_ID}}', `${settings['auth.google_client_id']}`)
        .replace('{{REDIRECT_URI}}', `${host}/oauth2`)
        .replace('{{SCOPE}}', 'openid profile email')
        .replace(
          '{{STATE}}',
          btoa(
            JSON.stringify({
              provider: 'google',
              redirect: back || window.location.pathname,
            }),
          ),
        )}
    >
      <Button
        style={{
          border: '1px solid #585858',
          height: '44px',
          width: '100%',
          background: '#fff',
          color: '#585858',
        }}
      >
        <GoogleLogo />
        <span>{formatMessage(authMessages.ui.googleLogin)}</span>
      </Button>
    </a>
  )
}

const LineLoginButton: React.VFC = () => {
  const { settings, loading } = useApp()
  const { formatMessage } = useIntl()
  const [back] = useQueryParam('back', StringParam)

  if (loading) {
    return <Spin />
  }

  return (
    <a
      href={'https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id={{CLIENT_ID}}&redirect_uri={{REDIRECT_URI}}&state={{STATE}}&scope={{SCOPE}}'
        .replace('{{CLIENT_ID}}', `${settings['auth.line_client_id']}`)
        .replace('{{REDIRECT_URI}}', `https://${window.location.hostname}:${window.location.port}/oauth2`)
        .replace('{{SCOPE}}', 'profile%20openid%20email')
        .replace(
          '{{STATE}}',
          btoa(
            JSON.stringify({
              provider: 'line',
              redirect: back || window.location.pathname,
            }),
          ),
        )}
    >
      <Button
        leftIcon={<Icon as={LineIcon} fontSize="20px" />}
        style={{
          border: '1px solid #01c101',
          height: '44px',
          width: '100%',
          background: '#01c101',
          color: '#fff',
        }}
      >
        <span>{formatMessage(authMessages.ui.lineLogin)}</span>
      </Button>
    </a>
  )
}

const ParentingLoginButton: React.VFC = () => {
  const { settings, loading } = useApp()
  const { formatMessage } = useIntl()
  const [back] = useQueryParam('back', StringParam)

  if (loading) {
    return <Spinner />
  }
  return (
    <a
      href={'https://accounts.parenting.com.tw/oauth/authorize?response_type=code&client_id={{CLIENT_ID}}&redirect_uri={{REDIRECT_URI}}&state={{STATE}}&scope={{SCOPE}}'
        .replace('{{CLIENT_ID}}', `${settings['auth.parenting_client_id']}`)
        .replace('{{REDIRECT_URI}}', `https://${window.location.hostname}:${window.location.port}/oauth2`)
        .replace('{{SCOPE}}', '')
        .replace(
          '{{STATE}}',
          btoa(
            JSON.stringify({
              provider: 'parenting',
              redirect: back || window.location.pathname,
            }),
          ),
        )}
    >
      <Button
        style={{
          border: '1px solid #e5017f',
          height: '44px',
          width: '100%',
          background: '#e5017f',
          color: '#fff',
        }}
      >
        <span>{formatMessage(authMessages.ui.parentingLogin)}</span>
      </Button>
    </a>
  )
}

export { FacebookLoginButton, GoogleLoginButton, LineLoginButton, ParentingLoginButton }
