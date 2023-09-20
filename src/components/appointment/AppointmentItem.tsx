import React from 'react'
import { useIntl } from 'react-intl'
import styled, { css } from 'styled-components'
import { useMeetMemberByAppointmentPlan } from '../../hooks/appointment'
import appointmentMessages from './translation'

const StyledItemWrapper = styled.div<{
  variant?: 'default' | 'closed' | 'booked' | 'meetingFull'
}>`
  position: relative;
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
  padding: 0.75rem;
  width: 6rem;
  overflow: hidden;
  border: solid 1px ${props => (props.variant === 'booked' ? 'var(--gray-light)' : 'var(--gray-dark)')};
  color: ${props => (props.variant === 'booked' ? 'var(--gray-dark)' : 'var(--gray-darker)')};
  border-radius: 4px;
  cursor: ${props => (props.variant !== 'default' ? 'not-allowed' : 'pointer')};

  ${props =>
    props.variant === 'closed'
      ? css`
          ::before {
            display: block;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            content: ' ';
            background-image: linear-gradient(90deg, transparent 5.5px, var(--gray) 5.5px);
            background-size: 6px 100%;
            background-repeat: repeat;
            transform: rotate(30deg) scale(2);
          }
        `
      : ''}
`
const StyledItemTitle = styled.div`
  position: relative;
  margin-bottom: 0.25rem;
  letter-spacing: 0.2px;
`
const StyledItemMeta = styled.div`
  position: relative;
  font-size: 12px;
  letter-spacing: 0.34px;
`

const AppointmentItem: React.VFC<{
  id: string
  appointmentPlanId: string
  appointmentPlanMeetType: string
  startedAt: Date
  isEnrolled?: boolean
  isExcluded?: boolean
  isBookedReachLimit?: boolean
  onClick: () => void
}> = ({ id, startedAt, isEnrolled, isExcluded, isBookedReachLimit, onClick }) => {
  const { formatMessage } = useIntl()

  const variant = isEnrolled ? 'booked' : isExcluded ? 'closed' : isBookedReachLimit ? 'meetingFull' : 'default'

  // 可預約
  //    會議室還沒滿
  //      appointment_plan capacity !== -1
  //      1,2 擇一
  //      1. appointment_plan capacity 的數量大於 appointment_period booked
  //      2. meet target 是 appointment_plan 的 id 且 meet_member 的數量小於 appointment_plan capacity
  //    他沒預約過
  //      appointment_plan_enrollment
  //    這個老師同時段其他的沒有被預約
  //      抓 meet 中的 host_member_id 為老師, 且沒有此時間的預約
  //    假如是 zoom 的話, service 額度要夠, meet 有 service_id
  //
  // 已關閉
  //   appointment_schedule -> excludes -> 陣列內的時間會等於 startedAt
  // 會議室已滿
  //   appointment_plan capacity !== -1 且
  //      1,2 擇一
  //    1. appointment_plan capacity 的數量小於 appointment_period booked
  //    2. meet target 是 appointment_plan 的 id 且 meet_member 的數量大於等於 appointment_plan capacity

  return (
    <StyledItemWrapper variant={variant} onClick={onClick}>
      <StyledItemTitle>
        {startedAt.getHours().toString().padStart(2, '0')}:{startedAt.getMinutes().toString().padStart(2, '0')}
      </StyledItemTitle>
      <StyledItemMeta>
        {variant === 'booked'
          ? formatMessage(appointmentMessages.AppointmentItem.booked)
          : variant === 'meetingFull'
          ? formatMessage(appointmentMessages.AppointmentItem.meetingIsFull)
          : variant === 'closed'
          ? formatMessage(appointmentMessages.AppointmentItem.bookable)
          : formatMessage(appointmentMessages.AppointmentItem.closed)}
      </StyledItemMeta>
    </StyledItemWrapper>
  )
}

export default AppointmentItem
