import { Menu, MenuButton, MenuList } from '@chakra-ui/react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAppTheme } from 'lodestar-app-element/src/contexts/AppThemeContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { LodestarWindow } from 'lodestar-app-element/src/types/lodestar.window'
import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import AuthButton from '../../../containers/common/AuthButton'
import { useCustomRenderer } from '../../../contexts/CustomRendererContext'
import MediaPlayerContext from '../../../contexts/MediaPlayerContext'
import PodcastPlayerContext from '../../../contexts/PodcastPlayerContext'
import { commonMessages } from '../../../helpers/translation'
import { useNav } from '../../../hooks/data'
import { useMember } from '../../../hooks/member'
import DefaultAvatar from '../../../images/avatar.svg'
import AskLoginModal from '../../auth/AskLoginModal'
import AuthModal, { AuthModalContext } from '../../auth/AuthModal'
import TOSModal from '../../auth/TOSModal'
import CartDropdown from '../../checkout/CartDropdown'
import Footer from '../../common/Footer'
import GlobalSearchInput from '../../common/GlobalSearchInput'
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
  StyledNavAnimationButton,
  StyledNavButton,
  StyledNavTag,
} from './DefaultLayout.styled'
import GlobalSearchModal from './GlobalSearchModal'

declare let window: LodestarWindow

const StyledLayoutWrapper = styled(StyledLayout)`
  && {
    .css-r6z5ec {
      z-index: 20;
    }
  }
`
const StyledNotificationBar = styled.div<{ variant?: string }>`
  position: sticky;
  z-index: 1000;
  top: 0;
  left: 0;
  height: 40px;
  line-height: 40px;
  width: 100%;
  background: ${props => (props.variant === 'warning' ? '#F56565' : '#111')};
  text-align: center;
  color: ${props => (props.variant === 'warning' ? 'white' : '#777')};
  font-weight: 500;
  font-size: 14px;
`

const DefaultLayout: React.FC<{
  white?: boolean
  noHeader?: boolean
  noFooter?: boolean
  noCart?: boolean
  noGeneralLogin?: boolean
  noNotificationBar?: boolean
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
  noNotificationBar,
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
  const { currentMemberId, isAuthenticated, isAuthenticating, currentMember } = useAuth()
  const { name, settings, enabledModules } = useApp()
  const { member } = useMember(currentMemberId || '')
  const { navs } = useNav()
  const { visible: podcastPlayerVisible } = useContext(PodcastPlayerContext)
  const { visible: mediaPlayerVisible } = useContext(MediaPlayerContext)
  const { renderCartButton, renderMyPageNavItem, renderCreatorPageNavItem } = useCustomRenderer()
  const [isBusinessMember, setIsBusinessMember] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isTOSModalVisible, setIsTOSModalVisible] = useState(false)

  const isUnVerifiedEmails = member ? !member.verifiedEmails?.includes(member.email) : false
  const pathName = window.location.pathname

  useEffect(() => {
    let tos: any
    try {
      tos = JSON.parse(Cookies.get('tos') || '{}')
    } catch (error) {
      tos = {}
    }
    if (isAuthenticated && tos?.memberId !== currentMemberId) {
      axios
        .get(`${process.env.REACT_APP_KOLABLE_SERVER_ENDPOINT}/cw/tos`, {
          params: {
            email: window.lodestar.getCurrentMember()?.email || currentMember?.email,
            product: 'kolable',
          },
          headers: { 'Content-Type': 'application/json' },
        })
        .then(({ data }) => (data.code === 'SUCCESS' ? null : setIsTOSModalVisible(true)))
        .catch(
          error =>
            process.env.NODE_ENV === 'development' &&
            console.error(`can not get kolable-server tos api, error: ${error}`),
        )
    }
  }, [isAuthenticated, currentMemberId, currentMember?.email])

  return (
    <AuthModalContext.Provider value={{ visible, setVisible, isBusinessMember, setIsBusinessMember }}>
      {visible && <AuthModal noGeneralLogin={noGeneralLogin} renderTitle={renderAuthModalTitle} />}
      {!isAuthenticated && !isAuthenticating && (pathName.includes('/settings') || pathName.includes('/members')) && (
        <AskLoginModal />
      )}

      {isTOSModalVisible && isAuthenticated && !isAuthenticating ? (
        <TOSModal onConfirm={() => setIsTOSModalVisible(false)} />
      ) : null}

      <StyledLayoutWrapper variant={white ? 'white' : undefined}>
        <StyledLayoutHeader className={`d-flex align-items-center justify-content-between ${noHeader ? 'hidden' : ''}`}>
          <div className="d-flex align-items-center">
            <LogoBlock>
              {renderTitle ? (
                renderTitle()
              ) : (
                <Link to="/">{settings['logo'] ? <StyledLogo src={settings['logo']} alt="logo" /> : name}</Link>
              )}
            </LogoBlock>
            <Responsive.Desktop>
              <GlobalSearchInput />
            </Responsive.Desktop>
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
                        onClick={() => {
                          nav.href && window.open(nav.href, '_blank', 'noopener=yes,noreferrer=yes')
                        }}
                      >
                        <Link to={nav.href ? nav.href : '#!'}>{nav.label}</Link>
                        {nav.tag && (
                          <StyledNavTag borderRadius="full" color="#fff" bg={theme?.colors?.primary?.[500]}>
                            {nav.tag}
                          </StyledNavTag>
                        )}
                      </MenuButton>
                    </Menu>
                  ) : (
                    <Menu key={nav.id}>
                      <MenuButton
                        as={
                          settings['style.header.menu_button.animation.enable'] === '1'
                            ? StyledNavAnimationButton
                            : StyledNavButton
                        }
                        onClick={e => {
                          if (nav.href) {
                            if (nav.href[0] === '/') {
                              history.push(nav.href)
                            } else {
                              window.location.assign(nav.href)
                            }
                          }
                        }}
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
                          {nav.subNavs?.map((subNav, idx) =>
                            subNav.external ? (
                              <StyledMenuItem
                                key={idx}
                                _focus={{ bg: '#fff', color: theme?.colors?.primary?.[500] }}
                                onClick={() =>
                                  subNav.href && window.open(subNav.href, '_blank', 'noopener=yes,noreferrer=yes')
                                }
                              >
                                {subNav.label}
                              </StyledMenuItem>
                            ) : (
                              <StyledMenuItem
                                key={idx}
                                _focus={{ bg: '#fff', color: theme?.colors?.primary?.[500] }}
                                onClick={() => {
                                  if (subNav.href) {
                                    if (subNav.href[0] === '/') {
                                      history.push(subNav.href)
                                    } else {
                                      window.location.assign(subNav.href)
                                    }
                                  }
                                }}
                              >
                                {subNav.label}
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

            {(enabledModules.search || enabledModules.search_advanced) && (
              <Responsive.Default>
                <GlobalSearchModal />
              </Responsive.Default>
            )}
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
          {!isAuthenticated && !isAuthenticating && pathName.includes('/settings') && <AskLoginModal />}
          {settings['feature.email_verification.enabled'] === '1' && isUnVerifiedEmails && !noNotificationBar && (
            <StyledNotificationBar variant="warning">
              <p>
                {formatMessage(commonMessages.message.warning.emailVerification)}
                <Link to={`/settings/profile#account`}>{formatMessage(commonMessages.defaults.check)}</Link>
              </p>
            </StyledNotificationBar>
          )}
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
          {(podcastPlayerVisible || mediaPlayerVisible) && <EmptyBlock height="76px" />}
        </StyledLayoutContent>
      </StyledLayoutWrapper>
    </AuthModalContext.Provider>
  )
}

export default DefaultLayout
