import { FormControl, FormLabel, ListItem, OrderedList, Stat } from '@chakra-ui/react'
import { update } from 'ramda'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { notEmpty } from '../../../helpers'
import { checkoutMessages } from '../../../helpers/translation'
import { CommonLargeTextMixin } from '../../common'
import GroupBuyingPartnerInput from './GroupBuyingPartnerInput'
import GroupBuyingRuleModal from './GroupBuyingRuleModal'

const StyledPlanTitle = styled.h3`
  ${CommonLargeTextMixin}
  line-height: 1.5;
  font-family: NotoSansCJKtc;
`

const CheckoutGroupBuyingForm: React.FC<{
  title?: string
  partnerCount?: number
  onChange?: (memberIds: string[]) => void
}> = ({ title = '12341', partnerCount = 5, onChange }) => {
  const { formatMessage } = useIntl()
  const [memberIds, setMemberIds] = useState<(string | null)[]>(new Array(partnerCount).fill(null))

  useEffect(() => {
    onChange?.(memberIds.filter(notEmpty))
  }, [JSON.stringify(memberIds)])

  return (
    <Stat>
      <OrderedList className="mb-4">
        <ListItem>{formatMessage(checkoutMessages.text.groupBuyingDescription1)}</ListItem>
        <ListItem>{formatMessage(checkoutMessages.text.groupBuyingDescription2)}</ListItem>
        <ListItem>
          {formatMessage(checkoutMessages.text.groupBuyingDescription3_1)}
          <GroupBuyingRuleModal />
          {formatMessage(checkoutMessages.text.groupBuyingDescription3_2)}
        </ListItem>
      </OrderedList>

      <div className="mb-4">
        <StyledPlanTitle className="mb-3">
          {formatMessage(checkoutMessages.label.groupBuyingPlan, { title })}
        </StyledPlanTitle>

        {memberIds.map((_, i) => (
          <FormControl className="mb-4">
            <FormLabel>{formatMessage(checkoutMessages.label.partnerEmail)}</FormLabel>
            <GroupBuyingPartnerInput
              existingMemberIds={memberIds.slice(0, i).filter(notEmpty)}
              onVerified={memberId => {
                setMemberIds(prevMemberIds => update(i, memberId, prevMemberIds))
              }}
            />
          </FormControl>
        ))}
      </div>
    </Stat>
  )
}

export default CheckoutGroupBuyingForm
