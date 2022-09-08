import { Button, Divider, Dropdown, Icon, Menu } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { useContext } from 'react'
import styled from 'styled-components'
import { StyledFooter } from '.'
import LocaleContext, { SUPPORTED_LOCALES } from '../../../contexts/LocaleContext'
import { BREAK_POINT } from '../Responsive'
import CWLearningNavLinks from './CWLearningNavLinks'

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

const DefaultFooter: React.VFC = () => {
  const { currentLocale, setCurrentLocale } = useContext(LocaleContext)
  const { enabledModules, name } = useApp()

  return (
    <StyledFooter>
      <StyledContainer className="container d-flex align-items-center justify-content-center flex-wrap">
        <div className="order-1 d-flex align-items-center">
          {/* <StyledLinkBlock className="d-flex align-items-center justify-content-center flex-wrap">
            <NavLinks />
            <div className="blank" />
            <SocialLinks />
          </StyledLinkBlock> */}
          {enabledModules.locale && (
            <div>
              <Divider type="vertical" className="mx-3" />
              <Dropdown
                trigger={['click']}
                overlay={
                  <Menu>
                    {SUPPORTED_LOCALES.map(supportedLocale => (
                      <Menu.Item key={supportedLocale.locale}>
                        <StyledButton
                          type="link"
                          size="small"
                          onClick={() => setCurrentLocale?.(supportedLocale.locale)}
                        >
                          {supportedLocale.label}
                        </StyledButton>
                      </Menu.Item>
                    ))}
                  </Menu>
                }
              >
                <StyledButton type="link" size="small">
                  {SUPPORTED_LOCALES.find(supportedLocale => currentLocale === supportedLocale.locale)?.label ||
                    'Unknown'}
                  <Icon type="down" />
                </StyledButton>
              </Dropdown>
            </div>
          )}
        </div>
        <CWLearningNavLinks />
        <div className="blank" />
        <div className="cwCopyrightBlock">
          <StyledCopyright className="copyright">
            客服專線：
            <a href="tel:0226620332">(02) 2662-0332</a> /<a href="mailto:bill@cw.com.tw"> bill@cw.com.tw</a>
          </StyledCopyright>
          <StyledCopyright className="copyright">
            課程團購洽詢：
            <a href="tel:0226620332">(02) 2662-0332</a> /<a href="mailto:bill@cw.com.tw"> bill@cw.com.tw</a>
          </StyledCopyright>
          <StyledCopyright className="copyright">
            {/* Copyright © {new Date().getFullYear()} {name} Inc. All rights reserved */}
            Copyright © {new Date().getFullYear()} 天下學習 版權所有
          </StyledCopyright>
        </div>
      </StyledContainer>
    </StyledFooter>
  )
}

export default DefaultFooter
