import React from 'react'
import DefaultLayout from '../components/layout/DefaultLayout'
import CoverSection from '../components/page/CoverSection'
import { PageProps } from '../hooks/page'

const ModularPage: React.FC<{ sections: PageProps[] }> = ({ sections }) => {
  return (
    <DefaultLayout>
      {sections.map(section => {
        switch (section.type) {
          case 'cover':
            return <CoverSection options={section.options} />
          default:
            break
        }
      })}
    </DefaultLayout>
  )
}

export default ModularPage
