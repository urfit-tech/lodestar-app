import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { checkoutMessages, commonMessages } from '../../../helpers/translation'
import { useMemberValidation } from '../../../hooks/common'
import { Input } from '../../common/CommonForm'

const GroupBuyingPartnerInput: React.FC<{
  existingMemberIds: string[]
  onVerified?: (memberId: string | null) => void
}> = ({ existingMemberIds, onVerified }) => {
  const { formatMessage } = useIntl()
  const [email, setEmail] = useState('')
  const { validateStatus, memberId } = useMemberValidation(email)

  const isMemberExisted = !!memberId && existingMemberIds?.includes(memberId)

  useEffect(() => {
    if (isMemberExisted || validateStatus === 'error') {
      onVerified?.(null)
      return
    }
    if (!isMemberExisted) {
      onVerified?.(memberId)
    }
  }, [memberId, isMemberExisted, validateStatus])

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
