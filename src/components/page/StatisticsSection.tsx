import BackgroundSection from 'lodestar-app-element/src/components/BackgroundSection'
import Stat from 'lodestar-app-element/src/components/Stat'
import React from 'react'
import styled from 'styled-components'
import { SectionTitle } from '../../pages/AppPage'

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
    <BackgroundSection
      customStyle={{
        backgroundImage: background || '',
        mt: '0',
        mb: '0',
        mr: '0',
        ml: '0',
        pt: '64',
        pb: '64',
        pr: '20',
        pl: '20',
        mode: !!background ? 'dark' : undefined,
      }}
    >
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
                  <Stat.Image
                    src={v.iconSrc}
                    customStyle={{
                      mt: '0',
                      mb: '24',
                      mr: '0',
                      ml: '0',
                      pt: '0',
                      pb: '0',
                      pr: '0',
                      pl: '0',
                    }}
                  />
                  <Stat.Digit isDark={!!background} className="mb-3 text-center">
                    {v.digit}
                  </Stat.Digit>
                  <Stat.Content
                    customStyle={{
                      textAlign: 'center',
                      fontSize: '20',
                      fontWeight: 'normal',
                      lineHeight: 1,
                      color: '#585858',
                      pt: '20',
                      pb: '20',
                      pr: '20',
                      pl: '20',
                    }}
                  >
                    {v.description}
                  </Stat.Content>
                  <p className="text-center"></p>
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
