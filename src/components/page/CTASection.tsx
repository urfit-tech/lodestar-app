import BackgroundSection from 'lodestar-app-element/src/components/BackgroundSection'
import Button from 'lodestar-app-element/src/components/Button'
import HeadingSnippet from 'lodestar-app-element/src/components/HeadingSnippet'
import React from 'react'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

const StyledContainer = styled.div<{ row: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${props =>
    props.row &&
    css`
      @media (min-width: 768px) {
        flex-direction: row;
        justify-content: space-between;
      }
    `}
`

const StyledDescription = styled.p<{ row: boolean }>`
  font-family: NotoSansCJKtc;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.38;
  color: #ffffff;
  margin-top: 24px;
  text-align: center;

  ${props =>
    props.row &&
    css`
      @media (min-width: 768px) {
        text-align: left;
      }
    `}
`

const CTASection: React.FC<{
  options: {
    mode?: 'light' | 'dark'
    direction?: 'row' | 'column'
    title?: string
    description?: string
    link?: {
      text: string
      path: string
    }
    backgroundUrl?: string
  }
}> = ({ options: { mode, direction, title, description, link, backgroundUrl = null } }) => {
  return (
    <BackgroundSection background={backgroundUrl || ''} mode={mode}>
      <StyledContainer className="container" row={direction === 'row'}>
        <HeadingSnippet direction={direction || 'row'}>
          {title && <HeadingSnippet.Title row={direction === 'row'}>{title}</HeadingSnippet.Title>}
          {description && <StyledDescription row={direction === 'row'}>{description}</StyledDescription>}
        </HeadingSnippet>

        <div>
          {link && (
            <Link to={link.path}>
              <Button>{link.text}</Button>
            </Link>
          )}
        </div>
      </StyledContainer>
    </BackgroundSection>
  )
}

export default CTASection
