import { Icon } from '@chakra-ui/icons'
import React from 'react'
import { ReactComponent as SystemIcon } from '../../images/icon-system.svg'
import ProgramBlock from './ProgramBlock'
import SectionHeading from './SectionHeading'
import { SunkProgramProps } from './utils'

const CategorySystematicProgramSection: React.FC<{
  programs: SunkProgramProps[]
}> = ({ programs }) => {
  return (
    <section className="mb-5">
      <SectionHeading icon={<Icon as={SystemIcon} />} title="系統套課" subtitle="Systematic courses" />
      <ProgramBlock programs={programs} />
    </section>
  )
}

export default CategorySystematicProgramSection
