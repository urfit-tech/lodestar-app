import { CraftParagraph, CraftSection } from 'lodestar-app-element/src/components/common/CraftElement'
import Stat from 'lodestar-app-element/src/components/common/Stat'
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
    <CraftSection
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
                    style={{
                      backgroundImage: `url(${v.iconSrc})`,
                      margin: '0 0 24px 0',
                      padding: 0,
                    }}
                  />
                  <Stat.Digit isDark={!!background} className="mb-3 text-center">
                    {v.digit}
                  </Stat.Digit>
                  <CraftParagraph
                    content={v.description}
                    customStyle={{
                      textAlign: 'center',
                      fontSize: '20',
                      fontWeight: 'normal',
                      lineHeight: 1,
                      color: !!background ? 'white' : '#585858',
                      margin: 20,
                    }}
                  />
                  <p className="text-center"></p>
                </Stat>
              ))}
            </StyledGrid>
          </div>
        </div>
      </div>
    </CraftSection>
  )
}

export default StatisticsSection
