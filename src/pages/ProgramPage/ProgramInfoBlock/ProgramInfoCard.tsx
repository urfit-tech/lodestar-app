import { Card } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { isEmpty } from 'ramda'
import React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import CountDownTimeBlock from '../../../components/common/CountDownTimeBlock'
import { AvatarImage } from '../../../components/common/Image'
import PriceLabel from '../../../components/common/PriceLabel'
import { usePublicMember } from '../../../hooks/member'
import { useEnrolledProgramIds } from '../../../hooks/program'
import { Category } from '../../../types/general'
import { Program, ProgramContent, ProgramContentSection, ProgramPlan, ProgramRole } from '../../../types/program'
import ProgramContentCountBlock from './ProgramContentCountBlock'

const StyledCountDownBlock = styled.div`
  margin-top: 15px;
  span {
    font-size: 14px;
  }
`

const StyledInstructorName = styled.div`
  margin-bottom: 28px;
  color: #585858;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`

export const StyledProgramInfoCard = styled(Card)`
  && {
    margin-bottom: 2.5rem;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  }

  .ant-card-body {
    padding: 1rem;
  }
`

const ProgramInfoCard: React.FC<{
  instructorId: string
  program: Program & {
    roles: ProgramRole[]
    categories: Category[]
    plans: ProgramPlan[]
    contentSections: (ProgramContentSection & {
      contents: ProgramContent[]
    })[]
  }
}> = ({ instructorId, program }) => {
  const { member } = usePublicMember(instructorId)
  const isOnSale = (program.plans[0]?.soldAt?.getTime() || 0) > Date.now()
  const { enabledModules } = useApp()
  const { currentMemberId } = useAuth()
  const { formatMessage } = useIntl()
  const { enrolledProgramIds } = useEnrolledProgramIds(currentMemberId || '')
  const isEnrolled = enrolledProgramIds.includes(program.id)

  return (
    <StyledProgramInfoCard>
      {member && (
        <>
          <Link to={`/creators/${member.id}?tabkey=introduction`}>
            <AvatarImage src={member.pictureUrl || ''} size={96} className="my-3 mx-auto" />
          </Link>
          <Link to={`/creators/${member.id}?tabkey=introduction`}>
            <StyledInstructorName>{member.name}</StyledInstructorName>
          </Link>
        </>
      )}

      <ProgramContentCountBlock program={program} />

      <div className="text-center mb-3">
        {isEmpty(program.plans.filter(v => v.publishedAt)) && (
          <PriceLabel
            variant="inline"
            listPrice={program.plans[0]?.listPrice || 0}
            salePrice={isOnSale ? program.plans[0]?.salePrice || 0 : undefined}
          />
        )}
        {program.isCountdownTimerVisible && program.plans[0]?.soldAt && isOnSale && (
          <StyledCountDownBlock>
            <CountDownTimeBlock expiredAt={program.plans[0]?.soldAt} icon />
          </StyledCountDownBlock>
        )}
      </div>
    </StyledProgramInfoCard>
  )
}

export default ProgramInfoCard
