import { defineMessages } from 'react-intl'

const RedeemPageMessages = {
  '*': defineMessages({
    duplicate: { id: 'RedeemPageMessages.*.duplicate', defaultMessage: '複製' },
    noItem: { id: 'RedeemPageMessages.*.noItem', defaultMessage: '查無項目' },
  }),
  idle: defineMessages({
    buttonTitle: { id: 'RedeemPageMessages.idle.receiveNow', defaultMessage: 'Receive Now' },
    title: { id: 'RedeemPageMessages.idle.receiveTitle', defaultMessage: 'Receive {discountTypeText}' },
    message: {
      id: 'RedeemPageMessages.idle.receiveMessage',
      defaultMessage: 'A gift from {ownerName}: "{title}" {discountTypeText}',
    },
  }),
  loading: defineMessages({
    buttonTitle: { id: 'RedeemPageMessages.loading.receiveNow', defaultMessage: 'Receive Now' },
    title: { id: 'RedeemPageMessages.loading.receiveTitle', defaultMessage: 'Receive {discountTypeText}' },
    message: {
      id: 'RedeemPageMessages.loading.receiveMessage',
      defaultMessage: 'A gift from {ownerName}: "{title}" {discountTypeText}',
    },
  }),
  success: defineMessages({
    buttonTitle: { id: 'RedeemPageMessages.success.viewNow', defaultMessage: 'View Now' },
    title: { id: 'RedeemPageMessages.success.receivedTitle', defaultMessage: 'Received {discountTypeText}' },
    message: {
      id: 'RedeemPageMessages.success.receivedMessage',
      defaultMessage: 'You can now use {discountTypeText}!',
    },
  }),
  failed: defineMessages({
    buttonTitle: { id: 'RedeemPageMessages.failed.backToHome', defaultMessage: 'Back to Home' },
    title: { id: 'RedeemPageMessages.failed.expiredTitle', defaultMessage: '{discountTypeText} Expired' },
    message: {
      id: 'RedeemPageMessages.failed.expiredMessage',
      defaultMessage: 'The gift from {ownerName}: "{title}" {discountTypeText} has expired',
    },
  }),
}

export default RedeemPageMessages
