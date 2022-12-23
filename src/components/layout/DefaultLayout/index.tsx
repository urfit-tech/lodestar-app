import { Menu, MenuButton, MenuList } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAppTheme } from 'lodestar-app-element/src/contexts/AppThemeContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import AuthButton from '../../../containers/common/AuthButton'
import { useCustomRenderer } from '../../../contexts/CustomRendererContext'
import PodcastPlayerContext from '../../../contexts/PodcastPlayerContext'
import { commonMessages } from '../../../helpers/translation'
import { useNav } from '../../../hooks/data'
import DefaultAvatar from '../../../images/avatar.svg'
import AuthModal, { AuthModalContext } from '../../auth/AuthModal'
import CartDropdown from '../../checkout/CartDropdown'
import Footer from '../../common/Footer'
import MemberProfileButton from '../../common/MemberProfileButton'
import Responsive from '../../common/Responsive'
import NotificationDropdown from '../../notification/NotificationDropdown'
import {
  CenteredBox,
  EmptyBlock,
  LayoutContentWrapper,
  LogoBlock,
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
import GlobalSearchModal from './GlobalSearchModal'

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
  const { visible: playerVisible } = useContext(PodcastPlayerContext)
  const { renderCartButton, renderMyPageNavItem, renderCreatorPageNavItem } = useCustomRenderer()
  const [visible, setVisible] = useState(false)

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
                        <Link to={nav.href ? nav.href : '#!'}>{nav.label}</Link>
                      </MenuButton>
                      {nav.subNavs?.length > 0 && (
                        <MenuList>
                          {nav.subNavs?.map((v, idx) =>
                            v.external ? (
                              <StyledMenuItem
                                key={idx}
                                _focus={{ bg: '#fff' }}
                                onClick={() => v.href && window.open(v.href, '_blank', 'noopener=yes,noreferrer=yes')}
                              >
                                <Link to={v.href} target="_blank" rel="noopener noreferrer">
                                  {v.label}
                                </Link>
                              </StyledMenuItem>
                            ) : (
                              <StyledMenuItem
                                key={idx}
                                _focus={{ bg: '#fff' }}
                                onClick={() => v.href && history.push(v.href)}
                              >
                                <Link to={v.href}>{v.label}</Link>
                                {v.tag && (
                                  <StyledMenuTag borderRadius="full" color="#fff" bg={theme?.colors?.primary?.[500]}>
                                    {v.tag}
                                  </StyledMenuTag>
                                )}
                              </StyledMenuItem>
                            ),
                          )}
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
                        <Link to={nav.href ? nav.href : '#!'}>{nav.label}</Link>
                        {nav.tag && (
                          <StyledNavTag borderRadius="full" color="#fff" bg={theme?.colors?.primary?.[500]}>
                            {nav.tag}
                          </StyledNavTag>
                        )}
                      </MenuButton>
                      {nav.subNavs.length > 0 && (
                        <MenuList>
                          {nav.subNavs?.map((v, idx) =>
                            v.external ? (
                              <StyledMenuItem
                                key={idx}
                                _focus={{ bg: '#fff' }}
                                onClick={() => v.href && window.open(v.href, '_blank', 'noopener=yes,noreferrer=yes')}
                              >
                                <Link to={v.href} target="_blank" rel="noopener noreferrer">
                                  {v.label}
                                </Link>
                              </StyledMenuItem>
                            ) : (
                              <StyledMenuItem
                                key={idx}
                                _focus={{ bg: '#fff', color: theme?.colors?.primary?.[500] }}
                                onClick={() => v.href && history.push(v.href)}
                              >
                                <Link to={v.href}>{v.label}</Link>
                                {v.tag && (
                                  <StyledMenuTag borderRadius="full" color="#fff" bg={theme?.colors?.primary?.[500]}>
                                    {v.tag}
                                  </StyledMenuTag>
                                )}
                              </StyledMenuItem>
                            ),
                          )}
                        </MenuList>
                      )}
                    </Menu>
                  ),
                )}

              {isAuthenticated &&
                (renderCreatorPageNavItem?.({
                  memberId: currentMemberId,
                }) ||
                  (!!Number(settings['nav.creator_page.enabled']) && (
                    <Menu>
                      <MenuButton
                        as={
                          settings['style.header.menu_button.animation.enable'] === '1'
                            ? StyledNavAnimationButton
                            : StyledNavButton
                        }
                        onClick={() => history.push(`/creators/${currentMemberId}`)}
                      >
                        <Link to={`/creators/${currentMemberId}`}>
                          {settings['nav.creator_page.name'] || formatMessage(commonMessages.button.creatorPage)}
                        </Link>
                      </MenuButton>
                    </Menu>
                  )))}

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
                        onClick={() => history.push(`/members/${currentMemberId}`)}
                      >
                        <Link to={`/members/${currentMemberId}`}>
                          {settings['nav.my_page.name'] || formatMessage(commonMessages.button.myPage)}
                        </Link>
                      </MenuButton>
                    </Menu>
                  )))}
            </Responsive.Desktop>

            {(enabledModules.search || enabledModules.search_advanced) && <GlobalSearchModal />}
            {!noCart && !settings['feature.cart.disable'] && (renderCartButton ? renderCartButton() : <CartDropdown />)}
            {currentMemberId && !settings['feature.notify.disable'] && <NotificationDropdown />}
            {currentMemberId && currentMember ? (
              <MemberProfileButton
                id={currentMemberId}
                name={currentMember.name}
                username={currentMember.username}
                email={currentMember.email}
                pictureUrl={currentMember.pictureUrl || DefaultAvatar}
              />
            ) : (
              <AuthButton />
            )}
          </div>
        </StyledLayoutHeader>

        <StyledLayoutContent id="layout-content" className={`${noHeader ? 'full-height' : ''}`}>
          <LayoutContentWrapper
            footerHeight={noFooter ? 0 : settings['footer.type'] === 'multiline' ? 108 : 65}
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
