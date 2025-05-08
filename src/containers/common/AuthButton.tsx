import { Button, Popover } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { AuthModalContext } from '../../components/auth/AuthModal'
import LocaleCollapse from '../../components/common/LocaleCollapse'
import { CustomNavLinks, StyledList, Wrapper } from '../../components/common/MemberProfileButton'
import Responsive from '../../components/common/Responsive'
import { useCustomRenderer } from '../../contexts/CustomRendererContext'
import { commonMessages } from '../../helpers/translation'
import { useAuthModal } from '../../hooks/auth'
import Cookies from 'js-cookie'
import { TrackingEvent, Method } from '../../types/tracking'

let isBtnSysCwlLoginSetted = false

const AuthButton: React.FC = () => {
  const { enabledModules } = useApp()
  const { formatMessage } = useIntl()
  const { renderAuthButton } = useCustomRenderer()
  const { setVisible } = useContext(AuthModalContext)
  const authModal = useAuthModal()

  const handleClick = () => {
    Cookies.set(TrackingEvent.METHOD, Method.STANDARD, { expires: 1 })
    Cookies.set(TrackingEvent.PAGE, window.location.href, { expires: 1 })

    authModal.open(setVisible)
    window.history.pushState(null, '', '#')
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
                {enabledModules.locale ? <LocaleCollapse /> : null}
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
