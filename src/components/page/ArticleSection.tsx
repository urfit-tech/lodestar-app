import Article from 'lodestar-app-element/src/components/Article'
import StyledSection from 'lodestar-app-element/src/components/BackgroundSection'
import React from 'react'

const ArticleSection: React.FC<{
  options: {
    title?: string
    description?: string
  }
}> = ({ options: { title, description } }) => {
  return (
    <StyledSection>
      <div className="container">
        <Article>
          <Article.Title className="mb-4" fontSize={24}>
            {title}
          </Article.Title>
          <Article.Content>{description}</Article.Content>
        </Article>
      </div>
    </StyledSection>
  )
}

export default ArticleSection
