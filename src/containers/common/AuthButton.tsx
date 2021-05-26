import { Button, Popover } from 'antd'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { AuthModalContext } from '../../components/auth/AuthModal'
import { CustomNavLinks, StyledList, Wrapper } from '../../components/common/MemberProfileButton'
import Responsive from '../../components/common/Responsive'
import { commonMessages } from '../../helpers/translation'

const AuthButton: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { setVisible } = useContext(AuthModalContext)

  return (
    <>
      <Responsive.Default>
        <Button className="ml-2 mr-2" onClick={() => setVisible && setVisible(true)}>
          {formatMessage(commonMessages.button.login)}
        </Button>
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
        <Button className="ml-2" onClick={() => setVisible && setVisible(true)}>
          {formatMessage(commonMessages.button.loginRegister)}
        </Button>
      </Responsive.Desktop>
    </>
  )
}

export default AuthButton
