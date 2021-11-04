import Card from 'lodestar-app-element/src/components/cards/Card'
import { CraftCard, CraftSection } from 'lodestar-app-element/src/components/common/CraftElement'
import React from 'react'
import styled from 'styled-components'
import { SectionTitle } from '../../pages/AppPage'

const StyledImage = styled.img`
  width: 40px;
  height: auto;
`

const FeatureSection: React.FC<{
  options: {
    backgroundUrl?: string
    title?: string
    infos?: {
      iconSrc: string
      title: string
    }[]
  }
}> = ({ options: { backgroundUrl = null, title, infos = [] } }) => {
  return (
    <CraftSection
      customStyle={{
        backgroundImage: backgroundUrl || '',
        mt: '0',
        mb: '0',
        mr: '0',
        ml: '0',
        pt: '64',
        pb: '64',
        pr: '20',
        pl: '20',
        mode: backgroundUrl ? 'dark' : undefined,
      }}
    >
      <div className="container">
        <SectionTitle>{title}</SectionTitle>

        <div className="d-flex flex-column flex-md-row">
          {infos.map(v => (
            <CraftCard
              darkMode={!!backgroundUrl}
              customStyle={{
                margin: '24px 0',
                padding: 0,
              }}
            >
              <StyledImage src={v.iconSrc} className="mr-3" alt="icon" />
              <Card.Title darkMode={!!backgroundUrl} className="my-auto">
                {v.title}
              </Card.Title>
            </CraftCard>
          ))}
        </div>
      </div>
    </CraftSection>
  )
}

export default FeatureSection
