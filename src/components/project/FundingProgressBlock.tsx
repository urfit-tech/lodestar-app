import { Progress } from 'antd'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import styled, { ThemeContext } from 'styled-components'
import { commonMessages, productMessages, projectMessages } from '../../helpers/translation'
import { ProjectIntroProps } from '../../types/project'
import PriceLabel from '../common/PriceLabel'

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
}> = ({ targetAmount, targetUnit, totalSales, enrollmentCount }) => {
  const theme = useContext(ThemeContext)
  const { formatMessage } = useIntl()
  const percent = !targetAmount
    ? 0
    : Math.floor(((targetUnit === 'participants' ? enrollmentCount : totalSales) * 100) / targetAmount)

  return (
    <StyledWrapper className="d-flex justify-content-between align-items-center">
      {targetUnit === 'participants' ? (
        <div>
          <StyledTitle variant="participants">
            {formatMessage(projectMessages.text.totalParticipants, { count: enrollmentCount })}
          </StyledTitle>
          <StyledMeta>
            {formatMessage(productMessages.project.paragraph.goal)} {targetAmount}{' '}
            {formatMessage(commonMessages.unit.people)}
          </StyledMeta>
        </div>
      ) : (
        <div>
          <StyledTitle>
            <PriceLabel listPrice={totalSales} />
          </StyledTitle>
          <StyledMeta>
            {formatMessage(productMessages.project.paragraph.goal)} <PriceLabel listPrice={targetAmount} />
          </StyledMeta>
          <StyledDescription>
            {formatMessage(productMessages.project.paragraph.numberOfParticipants)} {enrollmentCount}{' '}
            {formatMessage(commonMessages.unit.people)}
          </StyledDescription>
        </div>
      )}

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
        strokeColor={theme['@primary-color']}
        strokeWidth={10}
      />

      {percent >= 100 && (
        <StyledGoalAchievedBlock className="d-flex align-items-center justify-content-center">
          <div>
            募資
            <br />
            達標
          </div>
        </StyledGoalAchievedBlock>
      )}
    </StyledWrapper>
  )
}

export default FundingProgressBlock
