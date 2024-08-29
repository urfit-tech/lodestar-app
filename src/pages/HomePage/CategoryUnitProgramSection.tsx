import { Icon } from '@chakra-ui/icons'
import React from 'react'
import { useIntl } from 'react-intl'
import { ReactComponent as UnitIcon } from '../../images/icon-unit.svg'
import ProgramBlock from './ProgramBlock'
import SectionHeading from './SectionHeading'
import HomePageMessages from './translation'
import { SunkProgramProps } from './utils'

const CategoryUnitProgramSection: React.FC<{
  programs: SunkProgramProps[]
}> = ({ programs }) => {
  const { formatMessage } = useIntl()
  return (
    <section className="mb-5">
      <SectionHeading
        icon={<Icon as={UnitIcon} />}
        title={formatMessage(HomePageMessages.CategoryUnitProgramSection.unitCourses)}
        subtitle={formatMessage(HomePageMessages.CategoryUnitProgramSection.unitCoursesSubtitle)}
      />
      <ProgramBlock programs={programs} />
    </section>
  )
}

export default CategoryUnitProgramSection
