import Accordion from 'lodestar-app-element/src/components/Accordion'
import BackgroundSection from 'lodestar-app-element/src/components/BackgroundSection'
import React from 'react'
import { SectionTitle } from '../../pages/AppPage'

const AccordionSection: React.FC<{
  options: {
    title?: string
    infos?: {
      title: string
      description: string
    }[]
  }
}> = ({ options: { title, infos = [] } }) => {
  return (
    <BackgroundSection
      customStyle={{
        mt: '0',
        mb: '0',
        mr: '0',
        ml: '0',
        pt: '64',
        pb: '64',
        pr: '0',
        pl: '0',
      }}
    >
      <div className="container">
        <SectionTitle>{title}</SectionTitle>

        <Accordion
          customStyle={{
            card: {
              bordered: false,
              shadow: false,
              mt: '20',
              mb: '20',
              mr: '20',
              ml: '20',
              pt: '20',
              pb: '20',
              pr: '20',
              pl: '20',
            },
            title: {
              textAlign: 'left',
              fontSize: 16,
              fontWeight: 'bold',
              color: '#585858',
              mt: 0,
              mr: 0,
              mb: 0,
              ml: 0,
            },
            paragraph: {
              textAlign: 'left',
              fontSize: 14,
              fontWeight: 'normal',
              lineHeight: 1.5,
              color: '#585858',
              mt: 0,
              mr: 0,
              mb: 0,
              ml: 0,
            },
          }}
          list={infos}
        />
      </div>
    </BackgroundSection>
  )
}

export default AccordionSection
