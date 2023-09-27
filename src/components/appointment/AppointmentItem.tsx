import { Skeleton, Spinner } from '@chakra-ui/react'
import { uniq } from 'ramda'
import React from 'react'
import { useIntl } from 'react-intl'
import styled, { css } from 'styled-components'
import { useMeetByAppointmentPlanIdAndPeriod } from '../../hooks/appointment'
import { useOverlapMeets } from '../../hooks/meet'
import appointmentMessages from './translation'

const StyledItemWrapper = styled.div<{
  variant?: 'bookable' | 'closed' | 'booked' | 'meetingFull'
}>`
  position: relative;
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
  padding: 0.75rem;
  width: 6rem;
  overflow: hidden;
  border: solid 1px
    ${props =>
      props.variant === 'booked' || props.variant === 'meetingFull' ? 'var(--gray-light)' : 'var(--gray-dark)'};
  color: ${props =>
    props.variant === 'booked' || props.variant === 'meetingFull' ? 'var(--gray-dark)' : 'var(--gray-darker)'};
  border-radius: 4px;
  cursor: ${props => (props.variant !== 'bookable' ? 'not-allowed' : 'pointer')};

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
  creatorId: string
  appointmentPlan: {
    id: string
    capacity: number
    defaultMeetGateway: string
  }
  period: {
    startedAt: Date
    endedAt: Date
  }
  services: { id: string; gateway: string }[]
  loadingServices?: boolean
  isPeriodExcluded?: boolean
  isEnrolled?: boolean
  onClick: () => void
}> = ({ creatorId, appointmentPlan, period, services, loadingServices, isPeriodExcluded, isEnrolled, onClick }) => {
  const { formatMessage } = useIntl()
  const { loading: loadingMeetMembers, meet } = useMeetByAppointmentPlanIdAndPeriod(
    appointmentPlan.id,
    period.startedAt,
    period.endedAt,
  )
  const { loading: loadingOverlapCreatorMeet, overlapMeets } = useOverlapMeets(period.startedAt, period.endedAt)
  const zoomServices = services.filter(service => service.gateway === 'zoom').map(service => service.id)
  const overlapCreatorMeets = overlapMeets.filter(overlapMeet => overlapMeet.hostMemberId === creatorId)
  const currentUseServices = uniq(overlapMeets.map(overlapMeet => overlapMeet.serviceId))

  let variant: 'bookable' | 'closed' | 'booked' | 'meetingFull' | undefined

  if (isPeriodExcluded) {
    variant = 'closed'
  } else if (isEnrolled) {
    variant = 'booked'
  } else if (overlapCreatorMeets.length > 1) {
    variant = 'meetingFull'
  } else {
    if (appointmentPlan.defaultMeetGateway === 'zoom') {
      if (
        zoomServices.length >= 1 &&
        zoomServices.filter(zoomService => !currentUseServices.includes(zoomService)).length >= 1
      ) {
        if (appointmentPlan.capacity === -1) {
          variant = 'bookable'
        } else {
          if (meet) {
            meet.meetMembers.length >= appointmentPlan.capacity ? (variant = 'meetingFull') : (variant = 'bookable')
          } else {
            variant = 'bookable'
          }
        }
      } else {
        variant = 'meetingFull'
      }
    } else {
      if (appointmentPlan.capacity === -1) {
        variant = 'bookable'
      } else {
        if (meet) {
          meet.meetMembers.length >= appointmentPlan.capacity ? (variant = 'meetingFull') : (variant = 'bookable')
        } else {
          variant = 'bookable'
        }
      }
    }
  }

  return (
    <StyledItemWrapper variant={variant} onClick={variant === 'bookable' ? onClick : undefined}>
      <StyledItemTitle>
        {period.startedAt.getHours().toString().padStart(2, '0')}:
        {period.startedAt.getMinutes().toString().padStart(2, '0')}
      </StyledItemTitle>
      <StyledItemMeta>
        {loadingMeetMembers || loadingOverlapCreatorMeet || loadingServices ? (
          <Spinner />
        ) : variant === 'booked' ? (
          formatMessage(appointmentMessages.AppointmentItem.booked)
        ) : variant === 'meetingFull' ? (
          formatMessage(appointmentMessages.AppointmentItem.meetingIsFull)
        ) : variant === 'bookable' ? (
          formatMessage(appointmentMessages.AppointmentItem.bookable)
        ) : (
          formatMessage(appointmentMessages.AppointmentItem.closed)
        )}
      </StyledItemMeta>
    </StyledItemWrapper>
  )
}

export default AppointmentItem
