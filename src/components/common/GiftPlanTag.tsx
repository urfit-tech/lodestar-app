import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
const StyledTag = styled.p<{ color?: string }>`
  padding: 2px 6px;
  font-size: 12px;
  letter-spacing: 0.6px;
  color: ${props => (!!props.color ? props.color : props.theme['@primary-color'])};
  border: 1px solid ${props => (!!props.color ? props.color : props.theme['@primary-color'])};
  border-radius: 4px;
`
const messages = defineMessages({
  hasGiftPlan: { id: 'common.label.hasGiftPlan', defaultMessage: '附贈品' },
})

const GiftPlanTag: React.VFC<{ color?: string }> = ({ color }) => {
  const { formatMessage } = useIntl()
  return <StyledTag color={color}>{formatMessage(messages.hasGiftPlan)}</StyledTag>
}

export default GiftPlanTag
