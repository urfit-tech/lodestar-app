import { Button, Popover } from 'antd'
import Cookies from 'js-cookie'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { AuthModalContext } from '../../components/auth/AuthModal'
import { CustomNavLinks, StyledList, Wrapper } from '../../components/common/MemberProfileButton'
import Responsive from '../../components/common/Responsive'
import { useCustomRenderer } from '../../contexts/CustomRendererContext'
import { commonMessages } from '../../helpers/translation'

const AuthButton: React.VFC = () => {
  const { formatMessage } = useIntl()
  const tracking = useTracking()
  const { renderAuthButton } = useCustomRenderer()
  const { setVisible } = useContext(AuthModalContext)

  const { settings } = useApp()

  let utm: any
  try {
    utm = JSON.parse(Cookies.get('utm'))
  } catch (error) {
    utm = {}
  }

  const handleClick = () => {
    if (settings['auth.parenting.client_id'] && settings['auth.email.disabled']) {
      const state = btoa(
        JSON.stringify({
          provider: 'parenting',
          redirect:
            window.location.pathname +
            '?' +
            new URLSearchParams(window.location.search + '&' + new URLSearchParams(utm).toString()).toString(),
        }),
      )
      const redirectUri = encodeURIComponent(`${window.location.origin}/oauth2/parenting`)
      const oauthLink = `https://accounts.parenting.com.tw/oauth/authorize?response_type=code&client_id=${settings['auth.parenting.client_id']}&redirect_uri=${redirectUri}&state=${state}&scope=`
      tracking.login()
      window.location.assign(oauthLink)
    } else if (settings['auth.cw.client_id'] && settings['auth.email.disabled']) {
      const state = btoa(
        JSON.stringify({
          provider: 'cw',
          redirect:
            window.location.pathname +
            '?' +
            new URLSearchParams(window.location.search + '&' + new URLSearchParams(utm).toString()).toString(),
        }),
      )
      const redirectUri = encodeURIComponent(`${window.location.origin}/oauth2/cw`)
      const endpoint = settings[`auth.cw.endpoint`] || 'https://dev-account.cwg.tw'
      const oauthLink = `${endpoint}/oauth/v1.0/authorize?response_type=code&client_id=${settings['auth.cw.client_id']}&redirect_uri=${redirectUri}&state=${state}&scope=social`
      tracking.login()
      window.location.assign(oauthLink)
    } else {
      setVisible && setVisible(true)
    }
  }

  return (
    <>
      <Responsive.Default>
        {renderAuthButton?.(setVisible) || (
          <Button className="ml-2 mr-2" onClick={handleClick}>
            {formatMessage(commonMessages.button.login)}
          </Button>
        )}

        <Popover
          placement="bottomRight"
          trigger="click"
          content={
            <Wrapper>
              <StyledList split={false}>
                <CustomNavLinks />
              </StyledList>
            </Wrapper>
          }
        >
          <Button type="link" icon="menu" />
        </Popover>
      </Responsive.Default>

      <Responsive.Desktop>
        {renderAuthButton?.(setVisible) || (
          <Button className="ml-2" onClick={handleClick}>
            {formatMessage(commonMessages.button.loginRegister)}
          </Button>
        )}
      </Responsive.Desktop>
    </>
  )
}

export default AuthButton
