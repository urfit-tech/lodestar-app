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
    <BackgroundSection
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
            <HeadingSnippet.Title
              row={direction === 'row'}
              customStyle={{
                textAlign: 'center',
                fontSize: 28,
                fontWeight: 'bold',
                color: '#fff',
                pt: 0,
                pr: 0,
                pb: 0,
                pl: 0,
              }}
            >
              {title}
            </HeadingSnippet.Title>
          )}
          {description && (
            <HeadingSnippet.Content
              row={direction === 'row'}
              customStyle={{
                textAlign: 'center',
                fontSize: 20,
                fontWeight: 'normal',
                lineHeight: 1.35,
                color: '#fff',
                pt: 0,
                pr: 0,
                pb: 0,
                pl: 0,
              }}
            >
              {description}
            </HeadingSnippet.Content>
          )}
        </HeadingSnippet>

        <div>
          {link && (
            <Link to={link.path}>
              <Button size="lg" variant="solid">
                {link.text}
              </Button>
            </Link>
          )}
        </div>
      </StyledContainer>
    </BackgroundSection>
  )
}

export default CTASection
