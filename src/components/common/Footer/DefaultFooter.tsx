import { Button, Divider, Dropdown, Icon, Menu } from 'antd'
import React, { useContext } from 'react'
import styled from 'styled-components'
import { NavLinks, SocialLinks, StyledFooter } from '.'
import { useApp } from '../../../containers/common/AppContext'
import LanguageContext from '../../../contexts/LanguageContext'
import { BREAK_POINT } from '../Responsive'

const StyledLinkBlock = styled.div`
  padding-top: 1.25rem;
`
const StyledContainer = styled.div`
  && {
    button {
      padding: 0;
      color: var(--gray-dark);
      > * {
        font-size: 12px;
      }
    }
  }

  @media (min-width: ${BREAK_POINT}px) {
    > .copyright {
      order: -1;
    }
  }
`
const StyledButton = styled(Button)`
  && {
    color: var(--gray-dark);
    font-size: 14px;
  }
`
const StyledCopyright = styled.div`
  font-size: 0.75rem;
`

const DefaultFooter: React.FC = () => {
  const { currentLanguage, setCurrentLanguage } = useContext(LanguageContext)
  const { enabledModules, name } = useApp()

  return (
    <StyledFooter>
      <StyledContainer className="container d-flex align-items-center justify-content-center flex-wrap">
        <div className="order-1 d-flex align-items-center">
          <StyledLinkBlock className="d-flex align-items-center justify-content-center flex-wrap">
            <NavLinks />
            <div className="blank" />
            <SocialLinks />
          </StyledLinkBlock>
          {enabledModules.locale && (
            <div>
              <Divider type="vertical" className="mx-3" />
              <Dropdown
                trigger={['click']}
                overlay={
                  <Menu>
                    <Menu.Item key="zh">
                      <StyledButton
                        type="link"
                        size="small"
                        onClick={() => setCurrentLanguage && setCurrentLanguage('zh')}
                      >
                        繁體中文
                      </StyledButton>
                    </Menu.Item>
                    <Menu.Item key="en">
                      <StyledButton
                        type="link"
                        size="small"
                        onClick={() => setCurrentLanguage && setCurrentLanguage('en')}
                      >
                        English
                      </StyledButton>
                    </Menu.Item>
                    <Menu.Item key="vi">
                      <StyledButton
                        type="link"
                        size="small"
                        onClick={() => setCurrentLanguage && setCurrentLanguage('vi')}
                      >
                        Tiếng việt
                      </StyledButton>
                    </Menu.Item>
                  </Menu>
                }
              >
                <StyledButton type="link" size="small">
                  {currentLanguage === 'en' ? 'EN' : currentLanguage === 'vi' ? 'Tiếng việt' : '繁中'}
                  <Icon type="down" />
                </StyledButton>
              </Dropdown>
            </div>
          )}
        </div>
        <div className="blank" />
        <StyledCopyright className="py-3 copyright">
          Copyright © {new Date().getFullYear()} {name} Inc. All rights reserved
        </StyledCopyright>
      </StyledContainer>
    </StyledFooter>
  )
}

export default DefaultFooter
