import React from 'react'
import { useIntl } from 'react-intl'
import styled, { css } from 'styled-components'
import appointmentMessages from './translation'

const StyledItemWrapper = styled.div<{ variant?: 'default' | 'isEnrolled' | 'isMeetingFull' }>`
  position: relative;
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
  padding: 0.75rem;
  width: 6rem;
  overflow: hidden;
  border: solid 1px ${props => (props.variant === 'default' ? 'var(--gray-dark)' : 'var(--gray-light)')};
  color: ${props => (props.variant === 'default' ? 'var(--gray-darker)' : 'var(--gray-dark)')};
  border-radius: 4px;
  cursor: ${props => (props.variant !== 'default' ? 'not-allowed' : 'pointer')};

  ${props =>
    props.variant !== 'default'
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
  startedAt: Date
  isEnrolled?: boolean
  isExcluded?: boolean
  onClick: () => void
}> = ({ startedAt, isEnrolled, isExcluded, onClick }) => {
  const { formatMessage } = useIntl()

  return (
    <StyledItemWrapper variant={isEnrolled ? 'disabled' : isExcluded ? 'excluded' : 'default'} onClick={onClick}>
      <StyledItemTitle>
        {startedAt.getHours().toString().padStart(2, '0')}:{startedAt.getMinutes().toString().padStart(2, '0')}
      </StyledItemTitle>
      <StyledItemMeta>
        {variant === 'default'
          ? formatMessage(appointmentMessages.AppointmentItem.bookable)
          : variant === 'isEnrolled'
          ? formatMessage(appointmentMessages.AppointmentItem.booked)
          : variant === 'isMeetingFull'
          ? formatMessage(appointmentMessages.AppointmentItem.isMeetingFull)
          : ''}
      </StyledItemMeta>
    </StyledItemWrapper>
  )
}

export default AppointmentItem
