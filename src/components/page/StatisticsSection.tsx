import BackgroundSection from 'lodestar-app-element/src/components/BackgroundSection'
import Stat from 'lodestar-app-element/src/components/Stat'
import React from 'react'
import styled from 'styled-components'
import { SectionTitle } from '../../pages/AppPage'

const StyledImage = styled.img`
  width: 40px;
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
    background?: string
    title?: string
    imgUrl?: string
    infos?: {
      iconSrc: string
      digit: number
      description: string
    }[]
  }
}> = ({ options: { background = null, title, imgUrl, infos = [] } }) => {
  return (
    <BackgroundSection background={background || ''} mode={!!background ? 'dark' : undefined}>
      <div className="container">
        <div className="row align-items-center">
          {imgUrl && (
            <div className="col-12 col-md-5 my-auto">
              <img src={imgUrl} alt="feature" />
            </div>
          )}

          <div className={`col-12 my-3 ${imgUrl ? 'col-md-7' : ''}`}>
            <SectionTitle>{title}</SectionTitle>

            <StyledGrid colCount={infos.length}>
              {infos.map(v => (
                <Stat>
                  <StyledImage className="mx-auto mb-4" src={v.iconSrc} />
                  <Stat.Digit isDark={!!background} className="mb-3 text-center">
                    {v.digit}
                  </Stat.Digit>
                  <p className="text-center">{v.description}</p>
                </Stat>
              ))}
            </StyledGrid>
          </div>
        </div>
      </div>
    </BackgroundSection>
  )
}

export default StatisticsSection
