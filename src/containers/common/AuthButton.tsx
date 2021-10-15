import { Button, Popover } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { AuthModalContext } from '../../components/auth/AuthModal'
import { CustomNavLinks, StyledList, Wrapper } from '../../components/common/MemberProfileButton'
import Responsive from '../../components/common/Responsive'
import { useCustomRenderer } from '../../contexts/CustomRendererContext'
import { commonMessages } from '../../helpers/translation'

const AuthButton: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { renderAuthButton } = useCustomRenderer()
  const { setVisible } = useContext(AuthModalContext)

  const { settings } = useApp()

  const handleClick = () => {
    if (settings['auth.parenting.client_id'] && settings['auth.email.disabled']) {
      const state = btoa(JSON.stringify({ provider: 'parenting', redirect: window.location.pathname }))
      const redirect_uri = encodeURIComponent(`${window.location.origin}/oauth2/parenting`)
      const oauthLink = `https://accounts.parenting.com.tw/oauth/authorize?response_type=code&client_id=${settings['auth.parenting.client_id']}&redirect_uri=${redirect_uri}&state=${state}&scope=`
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
