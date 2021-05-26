import { Icon } from 'antd'
import React from 'react'
import styled from 'styled-components'
import FundingProgressBlock from '../../components/project/FundingProgressBlock'
import ProjectEnrollmentCounts from '../../containers/project/ProjectEnrollmentCounts'
import { ProjectIntroProps } from '../../types/project'
import CountDownTimeBlock from '../common/CountDownTimeBlock'
import { BREAK_POINT } from '../common/Responsive'

const StyledFundingSummaryBlock = styled.div`
  padding: 1.5rem 15px;
  color: var(--gray-darker);

  @media (min-width: ${BREAK_POINT}px) {
    padding: 0 15px;
  }
`
const StyledTitle = styled.h1`
  && {
    color: var(--gray-darker);
    font-size: 24px;
    font-weight: 600;
    line-height: 1.35;
    letter-spacing: 0.3px;
  }

  @media (min-width: ${BREAK_POINT}px) {
    && {
      font-size: 40px;
    }
  }
`
const StyledDescription = styled.div`
  && {
    color: var(--gray-darker);
    font-size: 14px;
    font-weight: 500;
  }
`
const StyledCountDownBlock = styled.div`
  background: #f8f8f8;
`

const FundingSummaryBlock: React.VFC<{
  projectId: string
  title: string
  abstract: string
  description: string
  targetAmount: number
  targetUnit: ProjectIntroProps['targetUnit']
  expiredAt: Date | null
  type: string
  isParticipantsVisible: boolean
  isCountdownTimerVisible: boolean
  totalSales: number
  enrollmentCount: number
}> = ({
  projectId,
  title,
  abstract,
  description,
  targetAmount,
  targetUnit,
  expiredAt,
  type,
  isParticipantsVisible,
  isCountdownTimerVisible,
  totalSales,
  enrollmentCount,
}) => {
  return (
    <StyledFundingSummaryBlock>
      <StyledTitle>{title}</StyledTitle>
      <StyledDescription className="mb-3">{abstract}</StyledDescription>

      {type === 'funding' && (
        <>
          <FundingProgressBlock
            targetAmount={targetAmount}
            targetUnit={targetUnit}
            totalSales={totalSales}
            enrollmentCount={enrollmentCount}
            isParticipantsVisible={isParticipantsVisible}
          />
          {expiredAt && (
            <StyledDescription>
              {isCountdownTimerVisible && <CountDownTimeBlock expiredAt={expiredAt} />}
            </StyledDescription>
          )}
        </>
      )}

      {type === 'pre-order' && expiredAt && (
        <>
          {isCountdownTimerVisible && (
            <StyledCountDownBlock className="mb-3 p-4">
              <Icon type="calendar" className="mr-2" />
              <CountDownTimeBlock expiredAt={expiredAt} />
            </StyledCountDownBlock>
          )}
          <StyledDescription>
            {isParticipantsVisible && <ProjectEnrollmentCounts projectId={projectId} />}
          </StyledDescription>
        </>
      )}
    </StyledFundingSummaryBlock>
  )
}

export default FundingSummaryBlock
