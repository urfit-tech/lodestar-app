import { CraftCollapse, CraftSection } from 'lodestar-app-element/src/components/common/CraftElement'
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
    <CraftSection
      customStyle={{
        margin: 0,
        padding: '64px 0',
      }}
    >
      <div className="container">
        <SectionTitle>{title}</SectionTitle>

        <CraftCollapse
          accordion
          customStyle={{
            margin: 20,
            padding: 20,
            '.title': {
              textAlign: 'left',
              fontSize: 16,
              fontWeight: 'bold',
              color: '#585858',
              margin: 0,
            },
            '.paragraph': {
              textAlign: 'left',
              fontSize: 14,
              fontWeight: 'normal',
              lineHeight: 1.5,
              color: '#585858',
              margin: 0,
            },
          }}
          list={infos}
        />
      </div>
    </CraftSection>
  )
}

export default AccordionSection
