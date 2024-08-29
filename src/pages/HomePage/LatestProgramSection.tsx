import { Icon } from '@chakra-ui/icons'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { ReactComponent as NewIcon } from '../../images/icon-new.svg'
import ProgramBlock from './ProgramBlock'
import SectionHeading from './SectionHeading'
import HomePageMessages from './translation'
import { SunkProgramProps } from './utils'

export const StyledIcon = styled.img`
  vertical-align: text-top;
`

const LatestProgramSection: React.VFC<{ programs: SunkProgramProps[] }> = ({ programs }) => {
  const { formatMessage } = useIntl()
  return (
    <section>
      <SectionHeading
        icon={<Icon as={NewIcon} />}
        title={formatMessage(HomePageMessages.LatestProgramSection.latestCourses)}
        subtitle={formatMessage(HomePageMessages.LatestProgramSection.latestCoursesSubtitle)}
      />
      <ProgramBlock programs={programs} />
    </section>
  )
}

export default LatestProgramSection
