import { Icon } from '@chakra-ui/icons'
import React from 'react'
import { useIntl } from 'react-intl'
import { ReactComponent as SystemIcon } from '../../images/icon-system.svg'
import ProgramBlock from './ProgramBlock'
import SectionHeading from './SectionHeading'
import HomePageMessages from './translation'
import { SunkProgramProps } from './utils'

const CategorySystematicProgramSection: React.FC<{
  programs: SunkProgramProps[]
}> = ({ programs }) => {
  const { formatMessage } = useIntl()
  return (
    <section className="mb-5">
      <SectionHeading
        icon={<Icon as={SystemIcon} />}
        title={formatMessage(HomePageMessages.CategorySystematicProgramSection.systematicCourses)}
        subtitle={formatMessage(HomePageMessages.CategorySystematicProgramSection.systematicCoursesSubtitle)}
      />
      <ProgramBlock programs={programs} />
    </section>
  )
}

export default CategorySystematicProgramSection
