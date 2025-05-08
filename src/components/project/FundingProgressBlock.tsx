import { Progress } from 'antd'
import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'
import { useAppTheme } from 'lodestar-app-element/src/contexts/AppThemeContext'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { commonMessages, productMessages } from '../../helpers/translation'
import { ProjectIntroProps } from '../../types/project'
import projectMessages from './translation'

const StyledWrapper = styled.div`
  position: relative;
  margin-bottom: 1rem;
  padding: 1.5rem;
  background: #f8f8f8;
`
const StyledTitle = styled.div<{ variant?: 'participants' }>`
  font-size: ${props => (props.variant === 'participants' ? '18px' : '24px')};
  font-weight: bold;
  letter-spacing: 0.3px;
`
const StyledMeta = styled.div`
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
`
const StyledDescription = styled.div`
  margin-top: 1.25rem;
  font-size: 14px;
  font-weight: bold;
`
const StyledGoalAchievedBlock = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 48px;
  height: 48px;
  background-color: var(--warning);
  box-shadow: 2px 2px 8px 0 rgba(222, 186, 96, 0.3);
  color: white;
  font-size: 12px;
  line-height: 1.17;
  letter-spacing: 0.58px;
  transform: rotate(9deg);
  border-radius: 50%;

  div {
    position: relative;
  }

  ::before {
    display: block;
    position: absolute;
    left: 10px;
    bottom: 0;
    width: 16px;
    height: 16px;
    content: ' ';
    background-color: var(--warning);
    transform: rotate(80deg) skew(10deg, 10deg);
  }
`
const StyleProgress = styled(Progress)`
  &.ant-progress-zero {
    & .ant-progress-text {
      color: #ececec;
    }
  }
  & span.ant-progress-text {
    color: #585858;
  }
  &.ant-progress-status-success {
    & span.ant-progress-text {
      color: #585858;
    }
  }
`

const FundingProgressBlock: React.FC<{
  targetAmount: number
  targetUnit: ProjectIntroProps['targetUnit']
  totalSales: number
  enrollmentCount: number
  isParticipantsVisible: boolean
}> = ({ targetAmount, targetUnit, totalSales, enrollmentCount, isParticipantsVisible }) => {
  const theme = useAppTheme()
  const { formatMessage } = useIntl()
  const percent = !targetAmount
    ? 0
    : Math.floor(((targetUnit === 'participants' ? enrollmentCount : totalSales) * 100) / targetAmount)

  return (
    <StyledWrapper className="d-flex justify-content-between align-items-center">
      <div>
        {targetUnit === 'participants' && (
          <>
            <StyledTitle variant="participants">
              {formatMessage(projectMessages.FundingProgressBlock.totalParticipants, { count: enrollmentCount })}
            </StyledTitle>
            <StyledMeta>
              {formatMessage(productMessages.project.paragraph.goal)} {targetAmount}{' '}
              {formatMessage(commonMessages.unit.people)}
            </StyledMeta>
          </>
        )}
        {targetUnit === 'funds' && (
          <>
            <StyledTitle>
              <PriceLabel listPrice={totalSales} />
            </StyledTitle>
            <StyledMeta>
              {formatMessage(productMessages.project.paragraph.goal)} <PriceLabel listPrice={targetAmount} />
            </StyledMeta>
            {isParticipantsVisible && (
              <StyledDescription>
                {formatMessage(productMessages.project.paragraph.numberOfParticipants)} {enrollmentCount}{' '}
                {formatMessage(commonMessages.unit.people)}
              </StyledDescription>
            )}
          </>
        )}
      </div>
      <StyleProgress
        type="circle"
        className={
          !targetAmount || (targetUnit === 'participants' ? enrollmentCount === 0 : totalSales === 0)
            ? 'ant-progress-zero'
            : ''
        }
        percent={percent}
        format={() =>
          !targetAmount
            ? 0
            : `${Math.floor(((targetUnit === 'participants' ? enrollmentCount : totalSales) * 100) / targetAmount)}%`
        }
        status="normal"
        width={70}
        strokeColor={theme.colors.primary[500]}
        strokeWidth={10}
      />

      {percent >= 100 && (
        <StyledGoalAchievedBlock className="d-flex align-items-center justify-content-center">
          <div>
            {formatMessage(projectMessages.FundingProgressBlock.funding)}
            <br />
            {formatMessage(projectMessages.FundingProgressBlock.achieved)}
          </div>
        </StyledGoalAchievedBlock>
      )}
    </StyledWrapper>
  )
}

export default FundingProgressBlock
