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
    <BackgroundSection
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
            <Card
              isDark={!!backgroundUrl}
              customStyle={{
                direction: 'row',
                bordered: false,
                shadow: false,
                mt: '24',
                mb: '24',
                mr: '0',
                ml: '0',
                pt: '0',
                pb: '0',
                pr: '0',
                pl: '0',
              }}
            >
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
