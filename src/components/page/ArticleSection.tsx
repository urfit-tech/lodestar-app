import Article from 'lodestar-app-element/src/components/Article'
import BackgroundSection from 'lodestar-app-element/src/components/BackgroundSection'
import React from 'react'

const ArticleSection: React.FC<{
  options: {
    title?: string
    description?: string
  }
}> = ({ options: { title, description } }) => {
  return (
    <BackgroundSection
      customStyle={{
        mt: '0',
        mb: '0',
        mr: '0',
        ml: '0',
        pt: '64',
        pb: '64',
        pr: '20',
        pl: '20',
      }}
    >
      <div className="container">
        <Article>
          <Article.Title
            className="mb-4"
            customStyle={{
              textAlign: 'left',
              fontSize: 24,
              fontWeight: 'bold',
              color: '#585858',
              mt: 0,
              mr: 0,
              mb: 0,
              ml: 0,
            }}
          >
            {title}
          </Article.Title>
          <Article.Content
            customStyle={{
              textAlign: 'left',
              fontSize: 16,
              fontWeight: 'normal',
              lineHeight: 1.7,
              color: '#585858',
              mt: 0,
              mr: 0,
              mb: 0,
              ml: 0,
            }}
          >
            {description}
          </Article.Content>
        </Article>
      </div>
    </BackgroundSection>
  )
}

export default ArticleSection
