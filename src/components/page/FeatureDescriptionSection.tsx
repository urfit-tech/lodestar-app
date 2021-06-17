import BackgroundSection from 'lodestar-app-element/src/components/BackgroundSection'
import Card from 'lodestar-app-element/src/components/Card'
import React from 'react'
import styled from 'styled-components'
import { SectionTitle } from '../../pages/AppPage'

const StyledImage = styled.img`
  width: 40px;
  height: auto;
`

const FeatureDescriptionSection: React.FC<{
  options: {
    backgroundUrl?: string
    title?: string
    infos?: {
      iconSrc: string
      title: string
      description: string
    }[]
  }
}> = ({ options: { backgroundUrl, title, infos = [] } }) => {
  return (
    <BackgroundSection background={backgroundUrl || ''} mode={!!backgroundUrl ? 'dark' : undefined}>
      <div className="container">
        <SectionTitle>{title}</SectionTitle>

        <div className="row justify-content-center">
          {infos.map(v => (
            <div className="col-12 col-md-4 mb-3">
              <Card isDark={!!backgroundUrl} direction="column" bordered shadow>
                <StyledImage src={v.iconSrc} className="mb-3" alt="icon" />
                <Card.Title isDark={!!backgroundUrl} className="mb-3">
                  {v.title}
                </Card.Title>
                <Card.Content>{v.description}</Card.Content>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </BackgroundSection>
  )
}

export default FeatureDescriptionSection
