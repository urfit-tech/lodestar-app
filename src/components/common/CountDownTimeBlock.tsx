import { Icon } from '@chakra-ui/icons'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { commonMessages } from '../../helpers/translation'
import { useInterval } from '../../hooks/util'
import { ReactComponent as CalendarOIcon } from '../../images/calendar-alt-o.svg'
import { BREAK_POINT } from './Responsive'

const StyledDiscountDown = styled.span`
  @media (min-width: ${BREAK_POINT}px) {
    &::before {
      content: '';
    }
  }
`
const StyledNumberBlock = styled.span`
  span:first-child {
    display: inline-block;
    min-width: 1.5rem;
    text-align: center;
  }
  .text-primary {
    color: ${props => props.theme['@primary-color']};
  }
`

const CountDownTimeBlock: React.VFC<{
  text?: string
  expiredAt: Date
  icon?: boolean
}> = ({ text, expiredAt, icon }) => {
  const { formatMessage } = useIntl()
  const countDown = expiredAt.getTime() - Date.now()
  const [seconds, setSeconds] = useState(countDown / 1000)
  useInterval(() => setSeconds((expiredAt.getTime() - Date.now()) / 1000), 1000)

  if (countDown < 0) {
    return null
  }

  return (
    <>
      {icon && <Icon as={CalendarOIcon} className="mr-2" />}
      <StyledDiscountDown className="discount-down mr-1">
        {text || formatMessage(commonMessages.defaults.countdown)}
      </StyledDiscountDown>
      {seconds > 86400 && (
        <StyledNumberBlock>
          <span className="text-primary">{Math.floor(seconds / 86400)}</span>
          <span>{formatMessage(commonMessages.unit.day)}</span>
        </StyledNumberBlock>
      )}
      {seconds > 3600 && (
        <StyledNumberBlock>
          <span className="text-primary">{Math.floor((seconds % 86400) / 3600)}</span>
          <span>{formatMessage(commonMessages.unit.hour)}</span>
        </StyledNumberBlock>
      )}
      {seconds > 60 && (
        <StyledNumberBlock>
          <span className="text-primary">{Math.floor((seconds % 3600) / 60)}</span>
          <span>{formatMessage(commonMessages.unit.min)}</span>
        </StyledNumberBlock>
      )}
      {seconds > 0 && (
        <StyledNumberBlock>
          <span className="text-primary">{Math.floor(seconds % 60)}</span>
          <span>{formatMessage(commonMessages.unit.sec)}</span>
        </StyledNumberBlock>
      )}
    </>
  )
}

export default CountDownTimeBlock
