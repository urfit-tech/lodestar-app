import { Icon } from '@chakra-ui/icons'
import React, { useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { commonMessages } from '../../helpers/translation'
import { useInterval } from '../../hooks/util'
import { ReactComponent as CalendarOIcon } from '../../images/calendar-alt-o.svg'
import { BREAK_POINT } from './Responsive'

const StyledDiscountDown = styled.span<{ secondary?: boolean }>`
  @media (min-width: ${BREAK_POINT}px) {
    &::before {
      content: '';
    }
  }
  ${props => (props.secondary ? 'font-weight: bold' : '')};
`
const StyledNumberBlock = styled.span<{ secondary?: boolean }>`
  span:first-child {
    display: inline-block;
    min-width: 1.5rem;
    text-align: center;
  }
  ${props => (props.secondary ? 'font-weight: bold' : '')};
  .text-primary {
    color: ${props => (props.secondary ? '#ff2f1a' : props => props.theme['@primary-color'])};
  }
`

const CountDownTimeBlock: React.VFC<{
  expiredAt: Date
  text?: string
  secondary?: boolean
  renderIcon?: () => React.ReactElement
  onTimeUp?: () => void
}> = ({ text, renderIcon, expiredAt, secondary, onTimeUp }) => {
  const { formatMessage } = useIntl()
  const timeUpRef = useRef(false)
  const expiredAtRef = useRef(expiredAt)
  const countDown = expiredAtRef.current.getTime() - Date.now()
  const [seconds, setSeconds] = useState(countDown / 1000)
  useInterval(() => {
    setSeconds(countDown / 1000)
    if (seconds <= 0 && !timeUpRef.current) {
      timeUpRef.current = true
      onTimeUp?.()
    }
  }, 1000)

  if (countDown < 0) {
    return null
  }

  return (
    <>
      {renderIcon ? renderIcon() : <Icon as={CalendarOIcon} className="mr-2" />}
      <StyledDiscountDown secondary={secondary} className="discount-down mr-1">
        {text || formatMessage(commonMessages.defaults.countdown)}
      </StyledDiscountDown>
      {seconds > 86400 && (
        <StyledNumberBlock secondary={secondary}>
          <span className="text-primary">{Math.floor(seconds / 86400)}</span>
          <span>{formatMessage(commonMessages.unit.day)}</span>
        </StyledNumberBlock>
      )}
      {seconds > 3600 && (
        <StyledNumberBlock secondary={secondary}>
          <span className="text-primary">{Math.floor((seconds % 86400) / 3600)}</span>
          <span>{formatMessage(commonMessages.unit.hour)}</span>
        </StyledNumberBlock>
      )}
      {seconds > 60 && (
        <StyledNumberBlock secondary={secondary}>
          <span className="text-primary">{Math.floor((seconds % 3600) / 60)}</span>
          <span>{formatMessage(commonMessages.unit.min)}</span>
        </StyledNumberBlock>
      )}
      {seconds > 0 && (
        <StyledNumberBlock secondary={secondary}>
          <span className="text-primary">{Math.floor(seconds % 60)}</span>
          <span>{formatMessage(commonMessages.unit.sec)}</span>
        </StyledNumberBlock>
      )}
    </>
  )
}

export default CountDownTimeBlock
