import { Button, Divider, Dropdown, Icon, Menu } from 'antd'
import React, { useContext } from 'react'
import styled from 'styled-components'
import { NavLinks, SocialLinks, StyledFooter } from '.'
import { useApp } from '../../../containers/common/AppContext'
import { useCustomRenderer } from '../../../contexts/CustomRendererContext'
import LanguageContext from '../../../contexts/LanguageContext'

const StyledLinkBlock = styled.div`
  padding-top: 1.25rem;
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

const MultilineFooter: React.FC = () => {
  const { name, enabledModules } = useApp()
  const { currentLanguage, setCurrentLanguage } = useContext(LanguageContext)
  const { renderCopyright } = useCustomRenderer()

  return (
    <StyledFooter>
      <div className="container">
        <StyledLinkBlock className="d-flex align-items-center justify-content-center flex-wrap">
          <NavLinks />
          <div className="blank" />
          <SocialLinks />
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
        </StyledLinkBlock>
      </div>

      <div className="divider" />

      <StyledCopyright className="py-3 text-center">
        {renderCopyright?.(name) || (
          <span>
            Copyright © {new Date().getFullYear()} {name} Inc. All rights reserved
          </span>
        )}
      </StyledCopyright>
    </StyledFooter>
  )
}
export default MultilineFooter
