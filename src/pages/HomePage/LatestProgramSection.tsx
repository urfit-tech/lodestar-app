import { Icon } from '@chakra-ui/icons'
import React from 'react'
import styled from 'styled-components'
import { ReactComponent as NewIcon } from '../../images/icon-new.svg'
import ProgramBlock from './ProgramBlock'
import SectionHeading from './SectionHeading'
import { SunkProgramProps } from './utils'

export const StyledIcon = styled.img`
  vertical-align: text-top;
`

const LatestProgramSection: React.VFC<{ programs: SunkProgramProps[] }> = ({ programs }) => {
  return (
    <section>
      <SectionHeading icon={<Icon as={NewIcon} />} title="最新上架" subtitle="LATEST COURSES" />
      <ProgramBlock programs={programs} />
    </section>
  )
}

export default LatestProgramSection
