import { defineMessages } from 'react-intl'

const voucherMessages = {
  '*': defineMessages({}),
  VoucherDeliverModal: defineMessages({
    giftLink: { id: 'voucher.VoucherDeliverModal.giftLink', defaultMessage: '贈送連結' },
    copyLink: { id: 'voucher.VoucherDeliverModal.copyLink', defaultMessage: '複製連結' },
  }),
}

export default voucherMessages
