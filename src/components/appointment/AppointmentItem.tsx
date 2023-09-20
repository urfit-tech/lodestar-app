import React from 'react'
import { useIntl } from 'react-intl'
import styled, { css } from 'styled-components'
import { productMessages } from '../../helpers/translation'

const StyledItemWrapper = styled.div<{ variant?: 'default' | 'excluded' | 'disabled' }>`
  position: relative;
  margin-bottom: 0.5rem;
  margin-right: 0.5rem;
  padding: 0.75rem;
  width: 6rem;
  overflow: hidden;
  border: solid 1px ${props => (props.variant === 'disabled' ? 'var(--gray-light)' : 'var(--gray-dark)')};
  color: ${props => (props.variant === 'disabled' ? 'var(--gray-dark)' : 'var(--gray-darker)')};
  border-radius: 4px;
  cursor: ${props => (props.variant !== 'default' ? 'not-allowed' : 'pointer')};

  ${props =>
    props.variant === 'excluded'
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
        {isEnrolled
          ? formatMessage(productMessages.appointment.status.booked)
          : isExcluded
          ? formatMessage(productMessages.appointment.status.closed)
          : formatMessage(productMessages.appointment.status.bookable)}
      </StyledItemMeta>
    </StyledItemWrapper>
  )
}

export default AppointmentItem
