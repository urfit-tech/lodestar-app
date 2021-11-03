import {
  CraftButton,
  CraftParagraph,
  CraftSection,
  CraftTitle,
} from 'lodestar-app-element/src/components/common/CraftElement'
import HeadingSnippet from 'lodestar-app-element/src/components/common/HeadingSnippet'
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
    <CraftSection
      customStyle={{
        backgroundImage: backgroundUrl || '',
        mt: '0',
        mb: '0',
        mr: '0',
        ml: '0',
        pt: '64',
        pb: '64',
        pr: '20',
        pl: '20',
        mode,
      }}
    >
      <StyledContainer className="container" row={direction === 'row'}>
        <HeadingSnippet direction={direction || 'row'}>
          {title && (
            <CraftTitle
              title={title}
              customStyle={{
                textAlign: direction === 'row' ? 'left' : 'center',
                fontSize: 28,
                fontWeight: 'bold',
                color: '#fff',
                mt: 0,
                mr: 0,
                mb: 0,
                ml: 0,
              }}
            />
          )}
          {description && (
            <CraftParagraph
              content={description}
              customStyle={{
                textAlign: direction === 'row' ? 'left' : 'center',
                fontSize: 20,
                fontWeight: 'normal',
                lineHeight: 1.35,
                color: '#fff',
                mt: 0,
                mr: 0,
                mb: 0,
                ml: 0,
              }}
            />
          )}
        </HeadingSnippet>

        <div>
          {link && (
            <Link to={link.path}>
              <CraftButton title={link.text} size="lg" variant="solid" />
            </Link>
          )}
        </div>
      </StyledContainer>
    </CraftSection>
  )
}

export default CTASection
