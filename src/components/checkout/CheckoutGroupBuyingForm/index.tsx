import { FormControl, FormErrorMessage, FormLabel, ListItem, OrderedList, Stat } from '@chakra-ui/react'
import { uniq } from 'ramda'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { notEmpty } from '../../../helpers'
import { checkoutMessages, commonMessages } from '../../../helpers/translation'
import { useSearchMembers } from '../../../hooks/common'
import { useAuth } from '../../auth/AuthContext'
import { CommonLargeTextMixin } from '../../common'
import { Input } from '../../common/CommonForm'
import GroupBuyingRuleModal from './GroupBuyingRuleModal'

const StyledPlanTitle = styled.h3`
  ${CommonLargeTextMixin}
  line-height: 1.5;
  font-family: NotoSansCJKtc;
`

let timeout: NodeJS.Timeout | null = null

const CheckoutGroupBuyingForm: React.FC<{
  title: string
  partnerCount: number
  onChange?: (value: { memberIds: string[]; withError: boolean }) => void
}> = ({ title, partnerCount, onChange }) => {
  const { formatMessage } = useIntl()
  const { currentMember } = useAuth()
  const searchEmails = useSearchMembers()
  const [emails, setEmails] = useState<string[]>(new Array(partnerCount).fill(''))
  const [members, setMembers] = useState<{ id: string; email: string }[]>([])

  const handleChange = (value: string, index: number) => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }

    timeout = setTimeout(async () => {
      const newEmails = emails.map((v, i) => (i === index ? value : v))
      setEmails(newEmails)
      const members = await searchEmails(uniq(newEmails))
      setMembers(members)
      onChange?.({
        memberIds: members.map(member => member.id),
        withError: newEmails.filter(notEmpty).length !== members.length,
      })
    }, 300)
  }

  return (
    <Stat>
      <OrderedList className="mb-4">
        <ListItem>{formatMessage(checkoutMessages.text.groupBuyingDescription1)}</ListItem>
        <ListItem>{formatMessage(checkoutMessages.text.groupBuyingDescription2)}</ListItem>
        <ListItem>
          {formatMessage(checkoutMessages.text.groupBuyingDescription3, { modal: <GroupBuyingRuleModal /> })}
        </ListItem>
      </OrderedList>

      <div className="mb-4">
        <StyledPlanTitle className="mb-3">
          {formatMessage(checkoutMessages.label.groupBuyingPlan, { title })}
        </StyledPlanTitle>

        {emails.map((email, i) => {
          const isInvalid = !!email && members.every(member => member.email !== email)
          const isSelf = !!email && email === currentMember?.email
          const isDuplicated = !!email && emails.filter(v => v === email).length > 1
          const errorMessage = isInvalid
            ? formatMessage(commonMessages.text.notFoundMemberEmail)
            : isSelf
            ? formatMessage(commonMessages.text.selfReferringIsNotAllowed)
            : isDuplicated
            ? formatMessage(checkoutMessages.text.existingPartner)
            : undefined

          return (
            <div key={i} className="col-12 col-lg-6 px-0 mb-3">
              <FormControl isInvalid={isInvalid || isSelf || isDuplicated}>
                <FormLabel>{formatMessage(checkoutMessages.label.partnerEmail)}</FormLabel>
                <Input
                  type="email"
                  status={email ? (isInvalid || isSelf || isDuplicated ? 'error' : 'success') : undefined}
                  placeholder={formatMessage(checkoutMessages.text.fillInPartnerEmail)}
                  onChange={e => handleChange(e.target.value, i)}
                />
                {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
              </FormControl>
            </div>
          )
        })}
      </div>
    </Stat>
  )
}

export default CheckoutGroupBuyingForm
