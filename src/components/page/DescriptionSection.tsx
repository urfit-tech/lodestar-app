import Article from 'lodestar-app-element/src/components/Article'
import React from 'react'
import styled from 'styled-components'
import { StyledSection } from '../../pages/AppPage'

const StyledContent = styled(Article.Content)`
  font-family: NotoSansCJKtc;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.69;
  letter-spacing: 0.2px;
  text-align: justify;
  color: var(--gray-darker);
`

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
                <Article.Title
                  className="mb-4"
                  customStyle={{
                    textAlign: 'left',
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: '#585858',
                    pt: 0,
                    pr: 0,
                    pb: 0,
                    pl: 0,
                  }}
                >
                  {v.title}
                </Article.Title>
                <Article.Content
                  customStyle={{
                    textAlign: 'left',
                    fontSize: 16,
                    fontWeight: 'normal',
                    lineHeight: 1.7,
                    color: '#585858',
                    pt: 0,
                    pr: 0,
                    pb: 0,
                    pl: 0,
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
