import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { isEmpty } from 'ramda'
import React, { useContext } from 'react'
import MessengerCustomerChat from 'react-messenger-customer-chat'
import { ThemeContext } from 'styled-components'
import DefaultLayout from '../../components/layout/DefaultLayout'
import AffordableProgramSection from './AffordableProgramSection'
import CategorySystematicProgramSection from './CategorySystematicProgramSection'
import CategoryUnitProgramSection from './CategoryUnitProgramSection'
import CoverSection from './CoverSection'
import LatestProgramSection from './LatestProgramSection'
import ProgramContentEnrolledSection from './ProgramContentEnrolledSection'
import TagHottestProgramSection from './TagHottestProgramSection'
import { useSunkHomePageProducts } from './utils'

const HomePage: React.FC = () => {
  const { settings } = useApp()
  const theme = useContext(ThemeContext)
  const {
    lastWatchedProgramContents,
    latestPrograms,
    affordablePrograms,
    hottestTagPrograms,
    unitCategoryPrograms,
    systematicCategoryPrograms,
  } = useSunkHomePageProducts()

  return (
    <DefaultLayout white>
      <MessengerCustomerChat
        appId={settings['auth.facebook_app_id']}
        pageId="112219997232278"
        themeColor={theme['@primary-color']}
      />
      <CoverSection />

      {!isEmpty(lastWatchedProgramContents) && (
        <ProgramContentEnrolledSection programContents={lastWatchedProgramContents} />
      )}
      {!isEmpty(latestPrograms) && <LatestProgramSection programs={latestPrograms} />}
      {!isEmpty(affordablePrograms) && <AffordableProgramSection programs={affordablePrograms} />}
      {!isEmpty(hottestTagPrograms) && <TagHottestProgramSection programs={hottestTagPrograms} />}
      {!isEmpty(unitCategoryPrograms) && <CategoryUnitProgramSection programs={unitCategoryPrograms} />}
      {!isEmpty(systematicCategoryPrograms) && (
        <CategorySystematicProgramSection programs={systematicCategoryPrograms} />
      )}
    </DefaultLayout>
  )
}

export default HomePage
