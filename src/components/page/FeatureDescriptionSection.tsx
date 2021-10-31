import Card from 'lodestar-app-element/src/components/cards/Card'
import { CraftCard, CraftImage, CraftSection } from 'lodestar-app-element/src/components/common/CraftElement'
import React from 'react'
import { SectionTitle } from '../../pages/AppPage'

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
        mode: !!backgroundUrl ? 'dark' : undefined,
      }}
    >
      <div className="container">
        <SectionTitle>{title}</SectionTitle>

        <div className="row justify-content-center">
          {infos.map(v => (
            <div className="col-12 col-md-4 mb-4">
              <CraftCard
                darkMode={!!backgroundUrl}
                customStyle={{
                  margin: 0,
                  padding: 20,
                }}
              >
                <CraftImage
                  customStyle={{
                    backgroundImage: `url(${v.iconSrc})`,
                    margin: '0 0 24px 0',
                    padding: 0,
                  }}
                />
                <Card.Title darkMode={!!backgroundUrl} className="mb-3">
                  {v.title}
                </Card.Title>
                <Card.Content
                  style={{
                    fontSize: 14,
                    textAlign: 'left',
                    fontWeight: 'normal',
                    lineHeight: 1.5,
                    color: !!backgroundUrl ? 'white' : 'black',
                    margin: 0,
                  }}
                >
                  {v.description}
                </Card.Content>
              </CraftCard>
            </div>
          ))}
        </div>
      </div>
    </CraftSection>
  )
}

export default FeatureDescriptionSection
