import { Button, Divider, Dropdown, Icon, Menu } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { useContext } from 'react'
import styled from 'styled-components'
import { NavLinks, SocialLinks, StyledFooter } from '.'
import { useCustomRenderer } from '../../../contexts/CustomRendererContext'
import LocaleContext, { SUPPORTED_LOCALES } from '../../../contexts/LocaleContext'

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

const MultilineFooter: React.VFC = () => {
  const { name, enabledModules, settings } = useApp()
  const { currentLocale, setCurrentLocale } = useContext(LocaleContext)
  const { renderCopyright } = useCustomRenderer()

  let settingLanguageList: string[] = []
  if (!!settings['layout.language_sorted_list']) {
    try {
      settingLanguageList = JSON.parse(settings['layout.language_sorted_list'])
    } catch (err) {
      console.log(err)
    }
  }

  const sortedLanguagesList = SUPPORTED_LOCALES.filter(language => settingLanguageList.includes(language.label)).sort(
    (a, b) => {
      return settingLanguageList.indexOf(a.label) - settingLanguageList.indexOf(b.label)
    },
  )
  const languagesList = sortedLanguagesList.length > 0 ? sortedLanguagesList : SUPPORTED_LOCALES

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
                    {languagesList.map(supportedLocale => (
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
                  {currentLocale === 'en-us'
                    ? 'EN'
                    : currentLocale === 'vi'
                    ? 'Tiếng việt'
                    : currentLocale === 'id'
                    ? 'Indonesia'
                    : currentLocale === 'ja'
                    ? '日本語'
                    : currentLocale === 'ko'
                    ? '한국어'
                    : '繁中'}
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
            Copyright © {new Date().getFullYear()} {name} All rights reserved
          </span>
        )}
      </StyledCopyright>
    </StyledFooter>
  )
}
export default MultilineFooter
