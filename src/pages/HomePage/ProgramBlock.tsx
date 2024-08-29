import React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { BREAK_POINT } from '../../components/common/Responsive'
import ProgramCard from '../../components/program/ProgramCard'
import TimeIcon from '../../images/icon-time.svg'
import UserIcon from '../../images/icon-user.svg'
import HomePageMessages from './translation'
import { SunkProgramProps } from './utils'

export const StyledIcon = styled.img`
  vertical-align: text-top;
`
const StyledCol = styled.div`
  @media (min-width: 320px) and (max-width: ${BREAK_POINT - 1}px) {
    &:nth-child(n + 4) {
      display: none;
    }
  }
`
const StyledDescription = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
`

const ProgramBlock: React.FC<{
  programs: SunkProgramProps[]
}> = ({ programs }) => {
  const { formatMessage } = useIntl()
  return (
    <div className="container">
      <div className="d-flex justify-content-end mb-2">
        <Link to="/programs">{formatMessage(HomePageMessages.AffordableProgramSection.moreCourses)}</Link>
      </div>
      <div className="row">
        {programs.map(program => (
          <StyledCol key={program.id} className="col-12 col-lg-4 mb-4">
            <ProgramCard
              program={program}
              renderCustomDescription={() => (
                <StyledDescription className="mb-2">
                  {!program.plans.some(plan => plan.periodType) && !!program?.totalDuration && (
                    <span className="mr-3">
                      <StyledIcon src={TimeIcon} style={{ display: 'inline-block' }} />
                      {formatMessage(HomePageMessages.ProgramBlock.totalDuration, {
                        duration: (program.totalDuration / 60).toFixed(0),
                      })}
                    </span>
                  )}
                  <span>
                    <StyledIcon src={UserIcon} style={{ display: 'inline-block' }} />
                    {formatMessage(HomePageMessages.ProgramBlock.totalDuration, { count: program.enrollmentCount })}
                  </span>
                </StyledDescription>
              )}
              withMeta
              noTotalDuration
            />
          </StyledCol>
        ))}
      </div>
    </div>
  )
}

export default ProgramBlock
