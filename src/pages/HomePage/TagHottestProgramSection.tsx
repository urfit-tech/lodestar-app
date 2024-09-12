import { Icon } from '@chakra-ui/icons'
import React from 'react'
import { useIntl } from 'react-intl'
import { ReactComponent as HotIcon } from '../../images/icon-hot.svg'
import ProgramBlock from './ProgramBlock'
import SectionHeading from './SectionHeading'
import HomePageMessages from './translation'
import { SunkProgramProps } from './utils'

const TagHottestProgramSection: React.FC<{ programs: SunkProgramProps[] }> = ({ programs }) => {
  const { formatMessage } = useIntl()
  return (
    <section className="mb-5">
      <SectionHeading
        icon={<Icon as={HotIcon} />}
        title={formatMessage(HomePageMessages.TagHottestProgramSection.hotCourses)}
        subtitle={formatMessage(HomePageMessages.TagHottestProgramSection.hotCoursesSubtitle)}
      />
      <ProgramBlock programs={programs} />
    </section>
  )
}

export default TagHottestProgramSection
