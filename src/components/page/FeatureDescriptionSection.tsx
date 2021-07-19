import BackgroundSection from 'lodestar-app-element/src/components/BackgroundSection'
import Card from 'lodestar-app-element/src/components/Card'
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
        mode: !!backgroundUrl ? 'dark' : undefined,
      }}
    >
      <div className="container">
        <SectionTitle>{title}</SectionTitle>

        <div className="row justify-content-center">
          {infos.map(v => (
            <div className="col-12 col-md-4 mb-4">
              <Card
                isDark={!!backgroundUrl}
                customStyle={{
                  direction: 'column',
                  bordered: true,
                  shadow: true,
                  mt: '0',
                  mb: '0',
                  mr: '0',
                  ml: '0',
                  pt: '20',
                  pb: '20',
                  pr: '20',
                  pl: '20',
                }}
              >
                <Card.Image
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
                  alt="icon"
                />
                <Card.Title isDark={!!backgroundUrl} className="mb-3">
                  {v.title}
                </Card.Title>
                <Card.Content
                  customStyle={{
                    fontSize: 14,
                    textAlign: 'left',
                    fontWeight: 'normal',
                    lineHeight: 1.5,
                    color: !!backgroundUrl ? 'white' : 'black',
                    pt: '0',
                    pb: '0',
                    pr: '0',
                    pl: '0',
                  }}
                >
                  {v.description}
                </Card.Content>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </BackgroundSection>
  )
}

export default FeatureDescriptionSection
