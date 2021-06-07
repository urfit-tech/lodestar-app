import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react'
import { update } from 'ramda'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { notEmpty } from '../../../helpers'
import { checkoutMessages, commonMessages } from '../../../helpers/translation'
import { useMemberValidation } from '../../../hooks/common'
import { Input } from '../../common/CommonForm'

const GroupBuyingPartnerInput: React.VFC<{
  index: number
  value: (string | null)[]
  onChange?: (value: (string | null)[]) => void
}> = ({ index, value, onChange }) => {
  const { formatMessage } = useIntl()
  const [email, setEmail] = useState('')
  const { validateStatus, memberId } = useMemberValidation(email)

  const existingMemberIds = value.slice(0, index).filter(notEmpty)
  const isMemberExisted = !!memberId && existingMemberIds.includes(memberId)

  useEffect(() => {
    if (isMemberExisted || validateStatus === 'error') {
      onChange?.(update(index, null, value))
    }
  }, [isMemberExisted, validateStatus])

  useEffect(() => {
    if (!isMemberExisted) {
      onChange?.(update(index, memberId, value))
    }
  }, [isMemberExisted, memberId])

  return (
    <FormControl isInvalid={isMemberExisted || validateStatus === 'error'}>
      <FormLabel>{formatMessage(checkoutMessages.label.partnerEmail)}</FormLabel>
      <Input
        type="email"
        status={validateStatus}
        placeholder={formatMessage(checkoutMessages.text.fillInPartnerEmail)}
        onBlur={e => setEmail(e.target.value)}
      />
      <FormErrorMessage>
        {isMemberExisted && formatMessage(checkoutMessages.text.existingPartner)}
        {validateStatus === 'error' && formatMessage(commonMessages.text.notFoundMemberEmail)}
      </FormErrorMessage>
    </FormControl>
  )
}

export default GroupBuyingPartnerInput
