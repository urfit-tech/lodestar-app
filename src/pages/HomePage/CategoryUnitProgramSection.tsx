import { Icon } from '@chakra-ui/icons'
import React from 'react'
import { ReactComponent as UnitIcon } from '../../images/icon-unit.svg'
import ProgramBlock from './ProgramBlock'
import SectionHeading from './SectionHeading'
import { SunkProgramProps } from './utils'

const CategoryUnitProgramSection: React.FC<{
  programs: SunkProgramProps[]
}> = ({ programs }) => {
  return (
    <section className="mb-5">
      <SectionHeading icon={<Icon as={UnitIcon} />} title="單元課程" subtitle="UNIT COURSES" />
      <ProgramBlock programs={programs} />
    </section>
  )
}

export default CategoryUnitProgramSection
