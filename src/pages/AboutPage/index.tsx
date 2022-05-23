import React from 'react'
import DefaultLayout from '../../components/layout/DefaultLayout'
import ContentSection from './ContentSection'
import CoverSection from './CoverSection'

const AboutPage: React.FC = () => {
  return (
    <DefaultLayout white>
      <CoverSection />
      <ContentSection />
    </DefaultLayout>
  )
}

export default AboutPage
