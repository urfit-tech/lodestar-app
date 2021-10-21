import Article from 'lodestar-app-element/src/components/common/Article'
import React from 'react'
import { StyledSection } from '../../pages/AppPage'

const DescriptionSection: React.FC<{
  options: {
    infos?: {
      title: string
      description: string
    }[]
    imgSrc: string
  }
}> = ({ options: { infos, imgSrc } }) => {
  return (
    <StyledSection>
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-7 m-auto">
            {infos?.map(v => (
              <Article className="my-5">
                <Article.DescriptionTitle
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
                  {v.title}
                </Article.DescriptionTitle>
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
                  {v.description}
                </Article.Content>
              </Article>
            ))}
          </div>
          <img className="col-12 col-md-5 m-auto" src={imgSrc} alt="feature" />
        </div>
      </div>
    </StyledSection>
  )
}

export default DescriptionSection
