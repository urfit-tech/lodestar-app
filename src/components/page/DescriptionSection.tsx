import Article from 'lodestar-app-element/src/components/Article'
import React from 'react'
import styled from 'styled-components'
import { StyledSection } from '../../pages/AppPage'

const StyledTitle = styled(Article.Title)`
  font-family: NotoSansCJKtc;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`

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
          <div className="col-12 col-md-7">
            {infos?.map(v => (
              <Article className="my-5">
                <StyledTitle className="mb-4">{v.title}</StyledTitle>
                <StyledContent>{v.description}</StyledContent>
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
