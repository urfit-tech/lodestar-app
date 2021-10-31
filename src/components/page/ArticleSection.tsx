import Article from 'lodestar-app-element/src/components/common/Article'
import { CraftParagraph, CraftSection, CraftTitle } from 'lodestar-app-element/src/components/common/CraftElement'
import React from 'react'

const ArticleSection: React.FC<{
  options: {
    title?: string
    description?: string
  }
}> = ({ options: { title, description } }) => {
  return (
    <CraftSection
      customStyle={{
        margin: 0,
        padding: '64px 20px',
      }}
    >
      <div className="container">
        <Article>
          <CraftTitle
            className="mb-4"
            title={title || ''}
            customStyle={{
              textAlign: 'left',
              fontSize: 24,
              fontWeight: 'bold',
              color: '#585858',
              margin: 0,
            }}
          />
          <CraftParagraph
            content={description || ''}
            customStyle={{
              textAlign: 'left',
              fontSize: 16,
              fontWeight: 'normal',
              lineHeight: 1.7,
              color: '#585858',
              margin: 0,
            }}
          />
        </Article>
      </div>
    </CraftSection>
  )
}

export default ArticleSection
