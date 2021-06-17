import BackgroundSection from 'lodestar-app-element/src/components/BackgroundSection'
import Card from 'lodestar-app-element/src/components/Card'
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
    <BackgroundSection background={backgroundUrl || ''} mode={backgroundUrl ? 'dark' : undefined}>
      <div className="container">
        <SectionTitle>{title}</SectionTitle>

        <div className="d-flex flex-column flex-md-row">
          {infos.map(v => (
            <Card isDark={!!backgroundUrl} direction="row">
              <StyledImage src={v.iconSrc} className="mr-3" alt="icon" />
              <Card.Title isDark={!!backgroundUrl} className="my-auto">
                {v.title}
              </Card.Title>
            </Card>
          ))}
        </div>
      </div>
    </BackgroundSection>
  )
}

export default FeatureSection
