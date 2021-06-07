import React from 'react'
import styled from 'styled-components'
import { SectionTitle, StyledSection } from '../../pages/AppPage'

const StyledImage = styled.img`
  width: 40px;
`

const StyledDigit = styled.div<{ isDark: boolean }>`
  color: ${props => (props.isDark ? 'white' : props.theme['@primary-color'])};
  font-size: 40px;
  line-height: 0.75;
  letter-spacing: 1px;

  &::after {
    content: '+';
  }
`

const StyledGrid = styled.div<{ colCount: number }>`
  display: grid;
  gap: 2.25rem;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: ${props => `repeat(${props.colCount}, 1fr)`};
  }
`

const StatisticsSection: React.FC<{
  options: {
    backgroundUrl?: string
    title?: string
    imgUrl?: string
    infos?: {
      iconSrc: string
      digit: number
      description: string
    }[]
  }
}> = ({ options: { backgroundUrl, title, imgUrl, infos = [] } }) => {
  return (
    <StyledSection isDark={!!backgroundUrl} backgroundUrl={backgroundUrl}>
      <div className="container">
        <div className="row align-items-center">
          {imgUrl && (
            <div className="col-12 col-md-5 my-auto">
              <img src={imgUrl} />
            </div>
          )}

          <div className={`col-12 my-3 ${imgUrl ? 'col-md-7' : ''}`}>
            <SectionTitle>{title}</SectionTitle>

            <StyledGrid colCount={infos.length}>
              {infos.map(v => (
                <StatisticsDigitBlock
                  isDark={!!backgroundUrl}
                  iconSrc={v.iconSrc}
                  digit={v.digit}
                  description={v.description}
                />
              ))}
            </StyledGrid>
          </div>
        </div>
      </div>
    </StyledSection>
  )
}

const StatisticsDigitBlock: React.FC<{
  isDark: boolean
  iconSrc: string
  digit: number
  description: string
}> = ({ isDark, iconSrc, digit, description }) => (
  <div>
    <StyledImage className="mx-auto mb-4" src={iconSrc} />
    <StyledDigit isDark={isDark} className="mb-3 text-center">
      {digit}
    </StyledDigit>
    <p className="text-center">{description}</p>
  </div>
)

export default StatisticsSection
