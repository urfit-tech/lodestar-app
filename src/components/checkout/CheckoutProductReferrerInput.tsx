import { Form, Input } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'
import { useAuth } from '../../components/auth/AuthContext'
import { commonMessages } from '../../helpers/translation'

const CheckoutProductReferrerInput: React.VFC<{
  referrerStatus: 'success' | 'error' | 'validating' | undefined
  referrerId: string | null
  onEmailSet: (email: string) => void
}> = ({ referrerStatus, referrerId, onEmailSet }) => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()

  return (
    <Form.Item
      validateStatus={referrerStatus}
      hasFeedback
      help={
        referrerStatus === 'error'
          ? referrerId === currentMemberId
            ? formatMessage(commonMessages.text.selfReferringIsNotAllowed)
            : formatMessage(commonMessages.text.notFoundReferrerEmail)
          : undefined
      }
    >
      <Input
        placeholder={formatMessage(commonMessages.form.placeholder.referrerEmail)}
        onBlur={e => onEmailSet(e.target.value)}
      />
    </Form.Item>
  )
}

export default CheckoutProductReferrerInput
