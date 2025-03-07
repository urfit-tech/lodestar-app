import { Icon } from '@chakra-ui/icons'
import React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { BREAK_POINT } from '../../components/common/Responsive'
import ProgramCard from '../../components/program/ProgramCard'
import { ReactComponent as HotIcon } from '../../images/icon-hot3.svg'
import { ReactComponent as UserIcon } from '../../images/icon-user.svg'
import { StyledIcon } from './ProgramBlock'
import SectionHeading from './SectionHeading'
import HomePageMessages from './translation'
import { SunkProgramProps } from './utils'

const StyledColumn = styled.div`
  @media (min-width: 320px) and (max-width: ${BREAK_POINT - 1}px) {
    &:nth-child(n + 7) {
      display: none;
    }
  }
  @media (min-width: ${BREAK_POINT}px) {
    max-width: 20%;
  }
`
const StyledDescription = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
`

const AffordableProgramSection: React.FC<{
  programs: SunkProgramProps[]
}> = ({ programs }) => {
  const { formatMessage } = useIntl()
  return (
    <section>
      <SectionHeading
        icon={<Icon as={HotIcon} />}
        title={formatMessage(HomePageMessages.AffordableProgramSection.copperCourse)}
        subtitle={formatMessage(HomePageMessages.AffordableProgramSection.affordableCourseSubtitle)}
      />
      <div className="container">
        <div className="d-flex justify-content-end mb-2">
          <Link to="/programs">{formatMessage(HomePageMessages.AffordableProgramSection.moreCourses)}</Link>
        </div>
        <div className="row">
          {programs.map(program => (
            <StyledColumn key={program.id} className="col-6 mb-4">
              <ProgramCard
                program={program}
                renderCustomDescription={() => (
                  <StyledDescription>
                    <StyledIcon as={UserIcon} />
                    <span>
                      {program.enrollmentCount} {formatMessage(HomePageMessages.AffordableProgramSection.people)}
                    </span>
                  </StyledDescription>
                )}
                withMeta
                noTotalDuration
              />
            </StyledColumn>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AffordableProgramSection
