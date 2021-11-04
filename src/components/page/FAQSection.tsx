import Article from 'lodestar-app-element/src/components/common/Article'
import React from 'react'
import styled from 'styled-components'
import { SectionTitle, StyledSection } from '../../pages/AppPage'

const StyledContainer = styled.div`
  margin: 0 auto;
  padding: 0 20px;

  @media (min-width: 768px) {
    max-width: 768px;
  }
`

const StyledBlock = styled.div`
  column-count: 1;

  @media (min-width: 768px) {
    column-count: 2;
    column-gap: 2rem;
  }
`

const FAQSection: React.FC<{
  options: {
    title?: string
    infos?: {
      title: string
      description: string
    }[]
  }
}> = ({ options: { title, infos = [] } }) => {
  return (
    <StyledSection>
      <StyledContainer>
        <SectionTitle>{title}</SectionTitle>

        <StyledBlock>
          {infos?.map(v => (
            <Article className="mb-4">
              <Article.Title
                highlight
                className="mb-3"
                style={{
                  textAlign: 'left',
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#ff5760',
                  margin: '0 0 0 10px',
                }}
              >
                {v.title}
              </Article.Title>
              <Article.Content
                style={{
                  textAlign: 'left',
                  fontSize: 16,
                  fontWeight: 'normal',
                  lineHeight: 1.7,
                  color: '#585858',
                  margin: 0,
                }}
              >
                {v.description}
              </Article.Content>
            </Article>
          ))}
        </StyledBlock>
      </StyledContainer>
    </StyledSection>
  )
}

export default FAQSection
