import { Button, Popover } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { AuthModalContext } from '../../components/auth/AuthModal'
import { CustomNavLinks, StyledList, Wrapper } from '../../components/common/MemberProfileButton'
import Responsive from '../../components/common/Responsive'
import { useCustomRenderer } from '../../contexts/CustomRendererContext'
import { commonMessages } from '../../helpers/translation'

let isBtnSysCwlLoginSetted = false

const AuthButton: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { renderAuthButton } = useCustomRenderer()
  const { setVisible } = useContext(AuthModalContext)

  const { settings } = useApp()

  const handleClick = () => {
    if (settings['auth.parenting.client_id'] && settings['auth.email.disabled']) {
      const state = btoa(JSON.stringify({ provider: 'parenting', redirect: window.location.pathname }))
      const redirectUri = encodeURIComponent(`${window.location.origin}/oauth2/parenting`)
      const oauthLink = `https://accounts.parenting.com.tw/oauth/authorize?response_type=code&client_id=${settings['auth.parenting.client_id']}&redirect_uri=${redirectUri}&state=${state}&scope=`
      window.location.assign(oauthLink)
    } else if (settings['auth.cw.client_id'] && settings['auth.email.disabled']) {
      const state = btoa(JSON.stringify({ provider: 'cw', redirect: window.location.pathname }))
      const redirectUri = encodeURIComponent(`${window.location.origin}/oauth2/cw`)
      const endpoint = settings[`auth.cw.endpoint`] || 'https://dev-account.cwg.tw'
      const oauthLink = `${endpoint}/oauth/v1.0/authorize?response_type=code&client_id=${settings['auth.cw.client_id']}&redirect_uri=${redirectUri}&state=${state}&scope=social`
      window.location.assign(oauthLink)
    } else {
      setVisible && setVisible(true)
    }
  }

  useEffect(() => {
    function getHomePageLoginButton() {
      const btn_sys_cwl_login_other_using = document.querySelector('.btn_sys_cwl_login_other_using')
      return btn_sys_cwl_login_other_using
    }
    // 首頁登入前「免費加入天下學習」按鈕連結
    setTimeout(() => {
      const homePageLoginButton = getHomePageLoginButton()
      if (homePageLoginButton && !isBtnSysCwlLoginSetted) {
        isBtnSysCwlLoginSetted = true
        homePageLoginButton.addEventListener('click', handleClick)
      }
    }, 500)
  })

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
