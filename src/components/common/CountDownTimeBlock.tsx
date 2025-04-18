import { Icon } from '@chakra-ui/icons'
import React, { useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { commonMessages } from '../../helpers/translation'
import { useInterval } from '../../hooks/util'
import { ReactComponent as CalendarOIcon } from '../../images/calendar-alt-o.svg'
import { colors } from '../../pages/ProgramPage/Secondary/style'
import { BREAK_POINT } from './Responsive'

const StyledDiscountDown = styled.span<{ secondary?: boolean; yellow?: boolean }>`
  @media (min-width: ${BREAK_POINT}px) {
    &::before {
      content: '';
    }
  }
  ${props => (props.secondary ? 'font-weight: bold' : '')};
  span {
    color: ${props => (props.yellow ? colors.yellow : '#4a4a4a')};
  }
`
const StyledNumberBlock = styled.span<{ secondary?: boolean; yellow?: boolean }>`
  span:first-child {
    display: inline-block;
    min-width: 1.5rem;
    text-align: center;
  }
  ${props => (props.secondary ? 'font-weight: bold' : '')};
  .text-primary {
    color: ${props =>
      props.secondary ? colors.orange : props.yellow ? colors.yellow : props => props.theme['@primary-color']};
  }
  span {
    color: ${props => (props.yellow ? colors.yellow : '#4a4a4a')};
  }
`

const CountDownTimeBlock: React.FC<{
  expiredAt: Date
  text?: string
  secondary?: boolean
  yellow?: boolean
  renderIcon?: () => React.ReactElement
  onTimeUp?: () => void
}> = ({ text, renderIcon, expiredAt, secondary, yellow, onTimeUp }) => {
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
      <StyledDiscountDown secondary={secondary} yellow={yellow} className="discount-down mr-1">
        <span>{text || formatMessage(commonMessages.defaults.countdown)}</span>
      </StyledDiscountDown>
      {seconds > 86400 && (
        <StyledNumberBlock secondary={secondary} yellow={yellow}>
          <span className="text-primary">{Math.floor(seconds / 86400)}</span>
          <span>{formatMessage(commonMessages.unit.day)}</span>
        </StyledNumberBlock>
      )}
      {seconds > 3600 && (
        <StyledNumberBlock secondary={secondary} yellow={yellow}>
          <span className="text-primary">{Math.floor((seconds % 86400) / 3600)}</span>
          <span>{formatMessage(commonMessages.unit.hour)}</span>
        </StyledNumberBlock>
      )}
      {seconds > 60 && (
        <StyledNumberBlock secondary={secondary} yellow={yellow}>
          <span className="text-primary">{Math.floor((seconds % 3600) / 60)}</span>
          <span>{formatMessage(commonMessages.unit.min)}</span>
        </StyledNumberBlock>
      )}
      {seconds > 0 && (
        <StyledNumberBlock secondary={secondary} yellow={yellow}>
          <span className="text-primary">{Math.floor(seconds % 60)}</span>
          <span>{formatMessage(commonMessages.unit.sec)}</span>
        </StyledNumberBlock>
      )}
    </>
  )
}

export default CountDownTimeBlock
