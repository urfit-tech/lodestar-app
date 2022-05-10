import { Button, Icon, Spinner } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
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

const FacebookLoginButton: React.VFC<{ accountLinkToken?: string }> = ({ accountLinkToken }) => {
  const { settings } = useApp()
  const { formatMessage } = useIntl()
  const [back] = useQueryParam('back', StringParam)

  return (
    <a
      href={'https://www.facebook.com/v6.0/dialog/oauth?client_id={{CLIENT_ID}}&redirect_uri={{REDIRECT_URI}}&scope={{SCOPE}}&state={{STATE}}&response_type=token'
        .replace('{{CLIENT_ID}}', `${settings['auth.facebook_app_id']}`)
        .replace('{{REDIRECT_URI}}', `${window.location.origin}/oauth2`)
        .replace('{{SCOPE}}', 'public_profile,email')
        .replace(
          '{{STATE}}',
          btoa(
            JSON.stringify({
              provider: 'facebook',
              redirect: back || window.location.pathname + window.location.search,
              accountLinkToken: accountLinkToken,
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

const GoogleLoginButton: React.VFC<{ accountLinkToken?: string }> = ({ accountLinkToken }) => {
  const { settings } = useApp()
  const { formatMessage } = useIntl()
  const [back] = useQueryParam('back', StringParam)

  return (
    <a
      href={'https://accounts.google.com/o/oauth2/v2/auth?client_id={{CLIENT_ID}}&response_type=token&scope={{SCOPE}}&access_type=online&redirect_uri={{REDIRECT_URI}}&state={{STATE}}&suppress_webview_warning=true'
        .replace('{{CLIENT_ID}}', `${settings['auth.google_client_id']}`)
        .replace('{{REDIRECT_URI}}', `${window.location.origin}/oauth2`)
        .replace('{{SCOPE}}', 'openid profile email')
        .replace(
          '{{STATE}}',
          btoa(
            JSON.stringify({
              provider: 'google',
              redirect: back || window.location.pathname + window.location.search,
              accountLinkToken: accountLinkToken,
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

const LineLoginButton: React.VFC<{ accountLinkToken?: string }> = ({ accountLinkToken }) => {
  const { settings, loading } = useApp()
  const { formatMessage } = useIntl()
  const [back] = useQueryParam('back', StringParam)

  if (loading) {
    return <Spinner />
  }

  return (
    <a
      href={'https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id={{CLIENT_ID}}&redirect_uri={{REDIRECT_URI}}&state={{STATE}}&scope={{SCOPE}}'
        .replace('{{CLIENT_ID}}', `${settings['auth.line_client_id']}`)
        .replace('{{REDIRECT_URI}}', `${window.location.origin}/oauth2`)
        .replace('{{SCOPE}}', 'profile%20openid%20email')
        .replace(
          '{{STATE}}',
          btoa(
            JSON.stringify({
              provider: 'line',
              redirect: back || window.location.pathname + window.location.search,
              accountLinkToken: accountLinkToken,
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

const ParentingLoginButton: React.VFC<{ accountLinkToken?: string }> = ({ accountLinkToken }) => {
  const { settings, loading } = useApp()
  const { formatMessage } = useIntl()
  const [back] = useQueryParam('back', StringParam)

  if (loading) {
    return <Spinner />
  }
  return (
    <a
      href={'https://accounts.parenting.com.tw/oauth/authorize?response_type=code&client_id={{CLIENT_ID}}&redirect_uri={{REDIRECT_URI}}&state={{STATE}}&scope={{SCOPE}}'
        .replace('{{CLIENT_ID}}', `${settings['auth.parenting.client_id']}`)
        .replace('{{REDIRECT_URI}}', encodeURIComponent(`${window.location.origin}/oauth2/parenting`))
        .replace('{{SCOPE}}', '')
        .replace(
          '{{STATE}}',
          btoa(
            JSON.stringify({
              provider: 'parenting',
              redirect: back || window.location.pathname + window.location.search,
              accountLinkToken: accountLinkToken,
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
