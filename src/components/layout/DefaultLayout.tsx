import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { ThemeContext } from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import AuthButton from '../../containers/common/AuthButton'
import NotificationContext from '../../contexts/NotificationContext'
import PodcastPlayerContext from '../../contexts/PodcastPlayerContext'
import { commonMessages } from '../../helpers/translation'
import { useNav } from '../../hooks/data'
import { useAuth } from '../auth/AuthContext'
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
  StyledNavLinkButton,
  StyledNavTag,
} from './DefaultLayout.styled'

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
  const { formatMessage } = useIntl()
  const theme = useContext(ThemeContext)
  const { currentMemberId, isAuthenticated } = useAuth()
  const { name, settings, enabledModules } = useApp()
  const { navs } = useNav()
  const { refetchNotifications } = useContext(NotificationContext)
  const { visible: playerVisible } = useContext(PodcastPlayerContext)

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    refetchNotifications && refetchNotifications()
  }, [refetchNotifications])

  return (
    <AuthModalContext.Provider value={{ visible, setVisible }}>
      {visible && <AuthModal noGeneralLogin={noGeneralLogin} renderTitle={renderAuthModalTitle} />}

      <StyledLayout variant={white ? 'white' : undefined}>
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
                    <a key={nav.label} href={nav.href} target="_blank" rel="noopener noreferrer">
                      <StyledNavLinkButton type="link">{nav.label}</StyledNavLinkButton>
                    </a>
                  ) : (
                    <Link key={nav.label} to={nav.href}>
                      <StyledNavLinkButton type="link">
                        {nav.label}
                        {nav.tag && <StyledNavTag color={theme['@primary-color']}>{nav.tag}</StyledNavTag>}
                      </StyledNavLinkButton>
                    </Link>
                  ),
                )}

              {isAuthenticated && (
                <Link to={`/members/${currentMemberId}`}>
                  <StyledNavLinkButton type="link">{formatMessage(commonMessages.button.myPage)}</StyledNavLinkButton>
                </Link>
              )}
            </Responsive.Desktop>

            {!noCart && <CartDropdown />}
            {currentMemberId && <NotificationDropdown />}
            {currentMemberId ? <MemberProfileButton memberId={currentMemberId} /> : <AuthButton />}
          </div>
        </StyledLayoutHeader>

        <StyledLayoutContent id="layout-content" className={`${noHeader ? 'full-height' : ''}`}>
          <LayoutContentWrapper
            footerHeight={noFooter ? 0 : settings['footer.type'] === 'multiline' ? 108 : 53}
            centeredBox={centeredBox}
          >
            {centeredBox ? <CenteredBox>{children}</CenteredBox> : children}
          </LayoutContentWrapper>

          {!noFooter && <Footer />}
          {/* more space for fixed blocks */}
          <Responsive.Default>
            {typeof footerBottomSpace === 'string' && <EmptyBlock height={footerBottomSpace} />}
          </Responsive.Default>
          {playerVisible && <EmptyBlock height="76px" />}
        </StyledLayoutContent>
      </StyledLayout>
    </AuthModalContext.Provider>
  )
}

export default DefaultLayout
