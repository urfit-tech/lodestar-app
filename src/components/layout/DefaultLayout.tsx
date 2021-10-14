import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAppTheme } from 'lodestar-app-element/src/contexts/AppThemeContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import AuthButton from '../../containers/common/AuthButton'
import { useCustomRenderer } from '../../contexts/CustomRendererContext'
import NotificationContext from '../../contexts/NotificationContext'
import PodcastPlayerContext from '../../contexts/PodcastPlayerContext'
import { commonMessages } from '../../helpers/translation'
import { useNav } from '../../hooks/data'
import AuthModal, { AuthModalContext } from '../auth/AuthModal'
import CartDropdown from '../checkout/CartDropdown'
import Footer from '../common/Footer'
import GlobalSearchInput from '../common/GlobalSearchInput'
import MemberProfileButton from '../common/MemberProfileButton'
import Responsive from '../common/Responsive'
import NotificationDropdown from '../notification/NotificationDropdown'
import {
  CenteredBox,
  EmptyBlock,
  LayoutContentWrapper,
  LogoBlock,
  SearchBlock,
  StyledLayout,
  StyledLayoutContent,
  StyledLayoutHeader,
  StyledLogo,
  StyledMenuItem,
  StyledMenuTag,
  StyledNavAnimationButton,
  StyledNavButton,
  StyledNavTag,
} from './DefaultLayout.styled'

const StyledLayoutWrapper = styled(StyledLayout)`
  && {
    .css-r6z5ec {
      z-index: 20;
    }
  }
`
const DefaultLayout: React.FC<{
  white?: boolean
  noHeader?: boolean
  noFooter?: boolean
  noCart?: boolean
  noGeneralLogin?: boolean
  centeredBox?: boolean
  footerBottomSpace?: string
  renderTitle?: () => React.ReactNode
  renderAuthModalTitle?: () => React.ReactNode
}> = ({
  white,
  noHeader,
  noFooter,
  noCart,
  noGeneralLogin,
  centeredBox,
  footerBottomSpace,
  renderTitle,
  renderAuthModalTitle,
  children,
}) => {
  const history = useHistory()
  const { formatMessage } = useIntl()
  const theme = useAppTheme()
  const { renderFooter } = useCustomRenderer()
  const { currentMemberId, isAuthenticated, currentMember } = useAuth()
  const { name, settings, enabledModules } = useApp()
  const { navs } = useNav()
  const { refetchNotifications } = useContext(NotificationContext)
  const { visible: playerVisible } = useContext(PodcastPlayerContext)
  const { renderCartButton, renderMyPageNavItem } = useCustomRenderer()

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    refetchNotifications && refetchNotifications()
  }, [refetchNotifications])

  return (
    <AuthModalContext.Provider value={{ visible, setVisible }}>
      {visible && <AuthModal noGeneralLogin={noGeneralLogin} renderTitle={renderAuthModalTitle} />}

      <StyledLayoutWrapper variant={white ? 'white' : undefined}>
        <StyledLayoutHeader className={`d-flex align-items-center justify-content-between ${noHeader ? 'hidden' : ''}`}>
          <div className="d-flex align-items-center">
            <LogoBlock className="mr-4">
              {renderTitle ? (
                renderTitle()
              ) : (
                <Link to="/">{settings['logo'] ? <StyledLogo src={settings['logo']} alt="logo" /> : name}</Link>
              )}
            </LogoBlock>

            {enabledModules.search && (
              <Responsive.Desktop>
                <SearchBlock>
                  <GlobalSearchInput />
                </SearchBlock>
              </Responsive.Desktop>
            )}
          </div>
          <div className="d-flex align-items-center">
            <Responsive.Desktop>
              {navs
                .filter(nav => nav.block === 'header')
                .map(nav =>
                  nav.external ? (
                    <Menu key={nav.id}>
                      <MenuButton
                        as={
                          settings['style.header.menu_button.animation.enable'] === '1'
                            ? StyledNavAnimationButton
                            : StyledNavButton
                        }
                        onClick={() => nav.href && window.open(nav.href, '_blank', 'noopener=yes,noreferrer=yes')}
                      >
                        {nav.label}
                      </MenuButton>
                      {nav.subNavs?.length > 0 && (
                        <MenuList>
                          {nav.subNavs?.map(v => (
                            <>
                              {v.external ? (
                                <a key={v.label} href={v.href} target="_blank" rel="noopener noreferrer">
                                  <StyledMenuItem _focus={{ bg: '#fff' }}>{v.label}</StyledMenuItem>
                                </a>
                              ) : (
                                <Link key={v.label} to={v.href}>
                                  <StyledMenuItem _focus={{ bg: '#fff' }}>
                                    {v.label}
                                    {v.tag && (
                                      <StyledMenuTag
                                        borderRadius="full"
                                        color="#fff"
                                        bg={theme?.colors?.primary?.[500]}
                                      >
                                        {v.tag}
                                      </StyledMenuTag>
                                    )}
                                  </StyledMenuItem>
                                </Link>
                              )}
                            </>
                          ))}
                        </MenuList>
                      )}
                    </Menu>
                  ) : (
                    <Menu key={nav.id}>
                      <MenuButton
                        as={
                          settings['style.header.menu_button.animation.enable'] === '1'
                            ? StyledNavAnimationButton
                            : StyledNavButton
                        }
                        onClick={() => nav.href && history.push(nav.href)}
                      >
                        {nav.label}
                        {nav.tag && (
                          <StyledNavTag borderRadius="full" color="#fff" bg={theme?.colors?.primary?.[500]}>
                            {nav.tag}
                          </StyledNavTag>
                        )}
                      </MenuButton>
                      {nav.subNavs.length > 0 && (
                        <MenuList>
                          {nav.subNavs?.map(v => (
                            <>
                              {v.external ? (
                                <a key={v.label} href={v.href} target="_blank" rel="noopener noreferrer">
                                  <MenuItem _focus={{ bg: '#fff' }}>
                                    <StyledMenuItem>{v.label}</StyledMenuItem>
                                  </MenuItem>
                                </a>
                              ) : (
                                <Link key={v.label} to={v.href}>
                                  <StyledMenuItem _focus={{ bg: '#fff', color: theme?.colors?.primary?.[500] }}>
                                    {v.label}
                                    {v.tag && (
                                      <StyledMenuTag
                                        borderRadius="full"
                                        color="#fff"
                                        bg={theme?.colors?.primary?.[500]}
                                      >
                                        {v.tag}
                                      </StyledMenuTag>
                                    )}
                                  </StyledMenuItem>
                                </Link>
                              )}
                            </>
                          ))}
                        </MenuList>
                      )}
                    </Menu>
                  ),
                )}

              {isAuthenticated &&
                (renderMyPageNavItem?.({
                  memberId: currentMemberId,
                }) ||
                  (!(settings['nav.my_page.disable'] === '1') && (
                    <Menu>
                      <MenuButton
                        as={
                          settings['style.header.menu_button.animation.enable'] === '1'
                            ? StyledNavAnimationButton
                            : StyledNavButton
                        }
                        onClick={() => (window.location.href = `/members/${currentMemberId}`)}
                      >
                        {formatMessage(commonMessages.button.myPage)}
                      </MenuButton>
                    </Menu>
                  )))}
            </Responsive.Desktop>

            {!noCart &&
              !(settings['feature.cart.disable'] === '1') &&
              (renderCartButton ? renderCartButton() : <CartDropdown />)}
            {currentMemberId && !(settings['feature.notify.disable'] === '1') && <NotificationDropdown />}
            {currentMemberId && currentMember ? (
              <MemberProfileButton
                id={currentMemberId}
                name={currentMember.name}
                username={currentMember.username}
                email={currentMember.email}
                pictureUrl={currentMember.pictureUrl}
              />
            ) : (
              <AuthButton />
            )}
          </div>
        </StyledLayoutHeader>

        <StyledLayoutContent id="layout-content" className={`${noHeader ? 'full-height' : ''}`}>
          <LayoutContentWrapper
            footerHeight={noFooter ? 0 : settings['footer.type'] === 'multiline' ? 108 : 53}
            centeredBox={centeredBox}
          >
            {centeredBox ? <CenteredBox>{children}</CenteredBox> : children}
          </LayoutContentWrapper>

          {!noFooter && (renderFooter?.({ DefaultFooter: Footer }) || <Footer />)}
          {/* more space for fixed blocks */}
          <Responsive.Default>
            {typeof footerBottomSpace === 'string' && <EmptyBlock height={footerBottomSpace} />}
          </Responsive.Default>
          {playerVisible && <EmptyBlock height="76px" />}
        </StyledLayoutContent>
      </StyledLayoutWrapper>
    </AuthModalContext.Provider>
  )
}

export default DefaultLayout
