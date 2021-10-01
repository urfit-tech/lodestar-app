import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import styled from 'styled-components'
import { StyledFooter, StyledNavAnchor, StyledNavLink } from '.'
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
const StyledCopyright = styled.div`
  font-size: 0.75rem;
`

const ModularBriefFooter: React.VFC<{
  navs: {
    external: boolean
    label: string
    href: string
  }[]
}> = ({ navs }) => {
  const { name } = useApp()

  return (
    <StyledFooter>
      <StyledContainer className="container d-flex align-items-center justify-content-center flex-wrap">
        <div className="order-1 d-flex align-items-center">
          <StyledLinkBlock className="d-flex align-items-center justify-content-center flex-wrap">
            {navs.map(nav =>
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
          </StyledLinkBlock>
        </div>
        <div className="blank" />
        <StyledCopyright className="py-3 copyright">
          Copyright © {new Date().getFullYear()} {name} Inc. All rights reserved
        </StyledCopyright>
      </StyledContainer>
    </StyledFooter>
  )
}

export default ModularBriefFooter
