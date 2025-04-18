import { Button, Popover } from 'antd'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { AuthModalContext } from '../../components/auth/AuthModal'
import LocaleCollapse from '../../components/common/LocaleCollapse'
import { CustomNavLinks, StyledList, Wrapper } from '../../components/common/MemberProfileButton'
import Responsive from '../../components/common/Responsive'
import { useCustomRenderer } from '../../contexts/CustomRendererContext'
import { commonMessages } from '../../helpers/translation'
import { useAuthModal } from '../../hooks/auth'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import Cookies from 'js-cookie'
import { TrackingEvent, Method } from '../../types/tracking'

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
