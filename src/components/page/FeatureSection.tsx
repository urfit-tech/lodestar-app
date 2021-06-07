import React from 'react'
import styled, { css } from 'styled-components'
import { SectionTitle, StyledSection } from '../../pages/AppPage'

const StyleCardTitle = styled.h3<{ isDark: boolean }>`
  font-family: NotoSansCJKtc;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: ${props => (props.isDark ? 'white' : 'var(--gray-darker)')};
`

const StyledCard = styled.div<{ isDark: boolean }>`
  padding: 32px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 100%;
  ${props =>
    props.isDark
      ? css`
          background-color: rgba(0, 0, 0, 0);
          border: 1px solid white;
        `
      : css`
          background-color: #ffffff;
        `}
  transition: 0.3s;
  &:hover {
    transform: scale(1.1);
  }

  @media (min-width: 768px) {
    width: 48%;
  }

  @media (min-width: 1080px) {
    width: 30%;
  }
`

const StyledBriefCard = styled.div<{ isDark: boolean }>`
  padding: 32px;
  width: 100%;
  transition: 0.3s;
  &:hover {
    transform: scale(1.1);
  }

  @media (min-width: 768px) {
    width: 22%;
  }
`

const StyledParagraph = styled.p`
  font-weight: 500;
`

const FeatureSection: React.FC<{
  options: {
    backgroundUrl?: string
    title?: string
    infos?: {
      iconSrc: string
      title: string
      description?: string
    }[]
  }
}> = ({ options: { backgroundUrl, title, infos = [] } }) => {
  return (
    <StyledSection isDark={!!backgroundUrl} backgroundUrl={backgroundUrl}>
      <div className="container">
        <SectionTitle>{title}</SectionTitle>
        <div className="d-flex flex-wrap justify-content-center">
          {infos.map(v =>
            v.description ? (
              <StyledCard isDark={!!backgroundUrl} className="m-3">
                <img src={v.iconSrc} className="mb-3" />
                <StyleCardTitle isDark={!!backgroundUrl} className="mb-3">
                  {v.title}
                </StyleCardTitle>
                <StyledParagraph>{v.description}</StyledParagraph>
              </StyledCard>
            ) : (
              <StyledBriefCard isDark={!!backgroundUrl} className="d-flex align-items-center m-3">
                <img src={v.iconSrc} className="mr-3" />
                <StyleCardTitle isDark={!!backgroundUrl}>{v.title}</StyleCardTitle>
              </StyledBriefCard>
            ),
          )}
        </div>
      </div>
    </StyledSection>
  )
}

export default FeatureSection
