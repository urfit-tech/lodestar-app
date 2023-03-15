import { Icon } from '@chakra-ui/icons'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import LocaleContext from '../../../contexts/LocaleContext'
import MediaPlayerContext from '../../../contexts/MediaPlayerContext'
import PodcastPlayerContext from '../../../contexts/PodcastPlayerContext'
import { isMobile } from '../../../helpers'
import { ReactComponent as FacebookIcon } from '../../../images/facebook-icon.svg'
import { ReactComponent as GroupIcon } from '../../../images/group-icon.svg'
import { ReactComponent as InstagramIcon } from '../../../images/instagram-icon.svg'
import { ReactComponent as LineIcon } from '../../../images/line-icon.svg'
import { ReactComponent as YoutubeIcon } from '../../../images/youtube-icon.svg'
import { EmptyBlock } from '../../layout/DefaultLayout/DefaultLayout.styled'
import { BREAK_POINT } from '../Responsive'
import DefaultFooter from './DefaultFooter'
import MultilineFooter from './MultilineFooter'

export const StyledFooter = styled.footer`
  height: 64px;
  background: white;
  border-top: 1px solid #ececec;
  color: #9b9b9b;

  a {
    margin-bottom: 1.25rem;
    line-height: 1;
  }

  .blank {
    width: 100%;
  }
  .divider {
    border-top: 1px solid #ececec;
  }

  @media (min-width: ${BREAK_POINT}px) {
    .blank {
      width: auto;
      flex-grow: 1;
    }
  }
`
export const StyledNavLink = styled(Link)`
  font-size: 14px;
  color: #9b9b9b;
  &:not(:first-child) {
    margin-left: 2rem;
  }
`
export const StyledNavAnchor = styled.a`
  font-size: 14px;
  color: #9b9b9b;
  &:not(:first-child) {
    margin-left: 2rem;
  }
`
const StyledSocialAnchor = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: solid 0.5px #ececec;
  border-radius: 50%;
  color: #585858;

  &:not(:first-child) {
    margin-left: 0.75rem;
  }

  @media (min-width: ${BREAK_POINT}px) {
    .blank + & {
      margin-left: 2rem;
    }
  }
`

export const NavLinks: React.VFC = () => {
  const { navs } = useApp()
  const { currentLocale } = useContext(LocaleContext)
  return (
    <>
      {navs
        .filter(nav => nav.block === 'footer' && nav.locale === currentLocale)
        .map(nav =>
          nav.external ? (
            <StyledNavAnchor key={nav.label} href={nav.href} target="_blank" rel="noopener noreferrer">
              {nav.label}
            </StyledNavAnchor>
          ) : (
            <StyledNavLink key={nav.label} to={nav.href}>
              {nav.label}
            </StyledNavLink>
          ),
        )}
    </>
  )
}

export const SocialLinks: React.VFC = () => {
  const { navs } = useApp()
  return (
    <>
      {navs
        .filter(nav => nav.block === 'social_media')
        .map(socialLink => (
          <StyledSocialAnchor key={socialLink.label} href={socialLink.href} target="_blank" rel="noopener noreferrer">
            {socialLink.label === 'facebook' && <Icon as={FacebookIcon} />}
            {socialLink.label === 'group' && <Icon as={GroupIcon} />}
            {socialLink.label === 'youtube' && <Icon as={YoutubeIcon} />}
            {socialLink.label === 'instagram' && <Icon as={InstagramIcon} />}
            {socialLink.label === 'line' && <Icon as={LineIcon} />}
          </StyledSocialAnchor>
        ))}
    </>
  )
}

const Footer: React.VFC = () => {
  const { settings } = useApp()
  const { visible: podcastPlayerVisible } = useContext(PodcastPlayerContext)
  const { visible: mediaPlayerVisible } = useContext(MediaPlayerContext)

  if (!!Number(settings['footer.custom.enabled'])) {
    return isMobile ? (
      <>
        <div
          style={{ height: Number(settings['footer.custom.mobile.height']) }}
          dangerouslySetInnerHTML={{ __html: settings['footer.custom.mobile.html'] }}
        />
        {(podcastPlayerVisible || mediaPlayerVisible) && <EmptyBlock height="92px" />}
      </>
    ) : (
      <div
        style={{ height: Number(settings['footer.custom.height']) }}
        dangerouslySetInnerHTML={{ __html: settings['footer.custom.html'] }}
      />
    )
  } else if (settings['footer.type'] === 'multiple') {
    return (
      <>
        <MultilineFooter />
        {(podcastPlayerVisible || mediaPlayerVisible) && <EmptyBlock height="92px" />}
      </>
    )
  } else {
    return (
      <>
        <DefaultFooter />
        {(podcastPlayerVisible || mediaPlayerVisible) && <EmptyBlock height="92px" />}
      </>
    )
  }
}

export default Footer
