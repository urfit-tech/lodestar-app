import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
const StyledTag = styled.p`
  padding: 2px 6px;
  font-size: 12px;
  letter-spacing: 0.6px;
  color: ${props => props.theme['@primary-color']};
  border: 1px solid ${props => props.theme['@primary-color']};
  border-radius: 4px;
`
const messages = defineMessages({
  hasGiftPlan: { id: 'common.label.hasGiftPlan', defaultMessage: '有贈品' },
})

const GiftPlanTag: React.VFC = () => {
  const { formatMessage } = useIntl()
  return <StyledTag>{formatMessage(messages.hasGiftPlan)}</StyledTag>
}

export default GiftPlanTag
