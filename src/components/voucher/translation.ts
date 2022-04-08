import { defineMessages } from 'react-intl'

const voucherMessages = {
  '*': defineMessages({}),
  VoucherDeliverModal: defineMessages({
    giftLink: { id: 'voucher.VoucherDeliverModal.giftLink', defaultMessage: '贈送連結' },
    copyLink: { id: 'voucher.VoucherDeliverModal.copyLink', defaultMessage: '複製連結' },
    transfer: { id: 'voucher.VoucherDeliverModal.transfer', defaultMessage: '轉贈' },
  }),
}

export default voucherMessages
