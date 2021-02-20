import { Icon } from '@chakra-ui/icons'
import { Progress } from 'antd'
import moment from 'moment'
import React, { useContext } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled, { ThemeContext } from 'styled-components'
import { CustomRatioImage } from '../../components/common/Image'
import PriceLabel from '../../components/common/PriceLabel'
import { projectMessages } from '../../helpers/translation'
import { ReactComponent as CalendarAltOIcon } from '../../images/calendar-alt-o.svg'
import EmptyCover from '../../images/empty-cover.png'
import { ReactComponent as UserOIcon } from '../../images/user-o.svg'
import { ProjectIntroProps } from '../../types/project'

const messages = defineMessages({
  people: { id: 'common.unit.people', defaultMessage: '{count} {count, plural, one {人} other {人}}' },
  onSaleCountDownDays: {
    id: 'project.label.onSaleCountDownDays',
    defaultMessage: '促銷倒數 {days} {days, plural, one {天} other {天}}',
  },
  isExpired: { id: 'project.label.isExpired', defaultMessage: '已結束' },
  isExpiredFunding: { id: 'project.label.isExpiredFunding', defaultMessage: '專案結束' },
})

const StyledCard = styled.div`
  overflow: hidden;
  background: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
`
const StyledCardBody = styled.div`
  padding: 1.5rem 1.25rem;
  color: var(--gray-dark);
  font-size: 14px;
  text-align: justify;
  line-height: 1.5rem;
`
const StyledCardTitle = styled.div`
  margin-bottom: 0.75rem;
  height: 3rem;
  color: var(--gray-darker);
  font-size: 18px;
  font-weight: bold;
  text-align: justify;
  line-height: 1.5rem;
`
const StyledCardAbstract = styled.div`
  margin-bottom: 3.5rem;
  height: 3rem;
  overflow: hidden;
`
const StyledCardMeta = styled.div`
  min-height: 1.5rem;
`
const StyledLabel = styled.div`
  color: ${props => props.theme['@primary-color']};
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

const ProjectIntroCard: React.FC<ProjectIntroProps> = ({
  type,
  title,
  coverUrl,
  previewUrl,
  abstract,
  targetAmount,
  targetUnit,
  expiredAt,
  isParticipantsVisible,
  isCountdownTimerVisible,
  totalSales,
  enrollmentCount,
}) => {
  const { formatMessage } = useIntl()
  const theme = useContext(ThemeContext)

  return (
    <StyledCard>
      <CustomRatioImage ratio={0.56} width="100%" src={previewUrl || coverUrl || EmptyCover} />
      <StyledCardBody>
        <StyledCardTitle>{title}</StyledCardTitle>
        <StyledCardAbstract>{abstract}</StyledCardAbstract>
        <StyledCardMeta className="d-flex align-items-end justify-content-between">
          <div>
            {type === 'funding' ? (
              <StyleProgress
                className={
                  !targetAmount || (targetUnit === 'participants' ? enrollmentCount === 0 : totalSales === 0)
                    ? 'ant-progress-zero'
                    : ''
                }
                type="circle"
                percent={
                  !targetAmount
                    ? 0
                    : Math.floor(((targetUnit === 'participants' ? enrollmentCount : totalSales) * 100) / targetAmount)
                }
                width={50}
                strokeWidth={12}
                strokeColor={theme['@primary-color']}
                format={() =>
                  `${
                    !targetAmount
                      ? 0
                      : Math.floor(
                          ((targetUnit === 'participants' ? enrollmentCount : totalSales) * 100) / targetAmount,
                        )
                  }%`
                }
              />
            ) : isParticipantsVisible ? (
              <>
                <Icon as={UserOIcon} className="mr-1" />
                {formatMessage(messages.people, { count: enrollmentCount })}
              </>
            ) : null}
          </div>

          <div className="text-right">
            {type === 'funding' && (
              <StyledLabel>
                {targetUnit === 'participants' &&
                  isParticipantsVisible &&
                  formatMessage(projectMessages.text.totalParticipants, { count: enrollmentCount })}
                {targetUnit === 'funds' && <PriceLabel listPrice={totalSales || 0} />}
              </StyledLabel>
            )}
            {isCountdownTimerVisible && expiredAt && (
              <>
                {moment().isAfter(expiredAt) ? (
                  <div>
                    <Icon as={CalendarAltOIcon} className="mr-1" />
                    {type === 'funding' ? formatMessage(messages.isExpiredFunding) : formatMessage(messages.isExpired)}
                  </div>
                ) : (
                  <StyledLabel>
                    <Icon as={CalendarAltOIcon} className="mr-1" />
                    {formatMessage(messages.onSaleCountDownDays, {
                      days: moment(expiredAt).diff(new Date(), 'days'),
                    })}
                  </StyledLabel>
                )}
              </>
            )}
          </div>
        </StyledCardMeta>
      </StyledCardBody>
    </StyledCard>
  )
}

export default ProjectIntroCard
