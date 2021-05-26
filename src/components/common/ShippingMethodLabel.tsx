import React from 'react'
import { defineMessages, useIntl } from 'react-intl'

const messages = defineMessages({
  sevenEleven: { id: 'merchandise.label.sevenEleven', defaultMessage: '7-11超商取貨' },
  familyMart: { id: 'merchandise.label.familyMart', defaultMessage: '全家超商取貨' },
  hiLife: { id: 'merchandise.label.hiLife', defaultMessage: '萊爾富超商取貨' },
  okMart: { id: 'merchandise.label.okMart', defaultMessage: 'OK超商取貨' },
  homeDelivery: { id: 'merchandise.label.homeDelivery', defaultMessage: '宅配' },
  sendByPost: { id: 'merchandise.label.sendByPost', defaultMessage: '郵寄' },
  other: { id: 'merchandise.label.other', defaultMessage: '其他' },
})

const ShippingMethodLabel: React.VFC<{ shippingMethodId: string }> = ({ shippingMethodId }) => {
  const { formatMessage } = useIntl()

  switch (shippingMethodId) {
    case 'seven-eleven':
      return <>{formatMessage(messages.sevenEleven)}</>
    case 'family-mart':
      return <>{formatMessage(messages.familyMart)}</>
    case 'hi-life':
      return <>{formatMessage(messages.hiLife)}</>
    case 'ok-mart':
      return <>{formatMessage(messages.okMart)}</>
    case 'home-delivery':
      return <>{formatMessage(messages.homeDelivery)}</>
    case 'send-by-post':
      return <>{formatMessage(messages.sendByPost)}</>
    case 'other':
      return <>{formatMessage(messages.other)}</>
    default:
      return null
  }
}

export default ShippingMethodLabel
