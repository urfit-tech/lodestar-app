import { Icon } from '@chakra-ui/icons'
import React from 'react'
import { ReactComponent as HotIcon } from '../../images/icon-hot.svg'
import ProgramBlock from './ProgramBlock'
import SectionHeading from './SectionHeading'
import { SunkProgramProps } from './utils'

const TagHottestProgramSection: React.FC<{ programs: SunkProgramProps[] }> = ({ programs }) => {
  return (
    <section className="mb-5">
      <SectionHeading icon={<Icon as={HotIcon} />} title="熱門推薦" subtitle="HOT COURSES" />
      <ProgramBlock programs={programs} />
    </section>
  )
}

export default TagHottestProgramSection
