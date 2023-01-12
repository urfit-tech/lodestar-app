import { Icon, ViewIcon } from '@chakra-ui/icons'
import { Progress } from 'antd'
import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'
import { useAppTheme } from 'lodestar-app-element/src/contexts/AppThemeContext'
import moment from 'moment'
import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { CustomRatioImage } from '../../components/common/Image'
import MemberAvatar from '../../components/common/MemberAvatar'
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

const StyledCard = styled.div<{ projectType?: string }>`
  overflow: hidden;
  ${props =>
    props.projectType !== 'portfolio' &&
    css`
      background: white;
      border-radius: 4px;
      box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
    `}
`
const StyledCardBody = styled.div<{ projectType?: string }>`
  color: var(--gray-dark);
  font-size: 14px;
  text-align: justify;
  line-height: 1.5rem;
  padding: 1.5rem 0 1rem;
  ${props =>
    props.projectType !== 'portfolio' &&
    css`
      padding: 1.5rem 1.25rem;
    `}
`
const StyledCardTitle = styled.div<{ projectType?: string }>`
  color: var(--gray-darker);
  font-size: 18px;
  font-weight: bold;
  text-align: justify;
  line-height: 1.5rem;
  ${props =>
    props.projectType !== 'portfolio' &&
    css`
      margin-bottom: 0.75rem;
      height: 3rem;
    `}
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
const InstructorPlaceHolder = styled.div`
  margin-bottom: 1rem;
  height: 2rem;
`

const ProjectIntroCard: React.VFC<ProjectIntroProps> = ({
  type,
  title,
  coverUrl,
  coverType,
  previewUrl,
  abstract,
  targetAmount,
  targetUnit,
  expiredAt,
  isParticipantsVisible,
  isCountdownTimerVisible,
  totalSales,
  enrollmentCount,
  authorId,
  id,
  views,
}) => {
  const { formatMessage } = useIntl()
  const theme = useAppTheme()
  return (
    <StyledCard projectType={type}>
      <CustomRatioImage
        shape={type === 'portfolio' ? 'rounded' : undefined}
        ratio={0.56}
        width="100%"
        src={previewUrl || (coverType === 'image' && coverUrl) || EmptyCover}
      />
      <StyledCardBody projectType={type}>
        <StyledCardTitle projectType={type}>
          <Link to={`/projects/${id}`}>{title}</Link>
        </StyledCardTitle>
        {type !== 'portfolio' && (
          <>
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
                        : Math.floor(
                            ((targetUnit === 'participants' ? enrollmentCount : totalSales) * 100) / targetAmount,
                          )
                    }
                    width={50}
                    strokeWidth={12}
                    strokeColor={theme.colors.primary[500]}
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
                      formatMessage(projectMessages.text.totalParticipants, { count: enrollmentCount })}
                    {targetUnit === 'funds' && <PriceLabel listPrice={totalSales || 0} />}
                  </StyledLabel>
                )}
                {isCountdownTimerVisible && expiredAt && (
                  <>
                    {moment().isAfter(expiredAt) ? (
                      <div>
                        <Icon as={CalendarAltOIcon} className="mr-1" />
                        {type === 'funding'
                          ? formatMessage(messages.isExpiredFunding)
                          : formatMessage(messages.isExpired)}
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
          </>
        )}
      </StyledCardBody>
      {type === 'portfolio' && (
        <InstructorPlaceHolder className="mb-3 d-flex p-2  align-content-center justify-content-between">
          {authorId && (
            <Link to={`/creators/${authorId}?tabkey=introduction`}>
              <MemberAvatar memberId={authorId} withName />
            </Link>
          )}
          {views && (
            <div>
              <Icon as={ViewIcon} className="mr-1" />
              <span>{views}</span>
            </div>
          )}
        </InstructorPlaceHolder>
      )}
    </StyledCard>
  )
}

export default ProjectIntroCard
