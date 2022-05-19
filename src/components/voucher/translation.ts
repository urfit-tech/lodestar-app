import { defineMessages } from 'react-intl'

const voucherMessages = {
  '*': defineMessages({
    close: { id: 'voucher.*.close', defaultMessage: 'close' },
    cancel: { id: 'voucher.*.cancel', defaultMessage: 'cancel' },
  }),
  VoucherDeliverModal: defineMessages({
    giftLink: { id: 'voucher.VoucherDeliverModal.giftLink', defaultMessage: '贈送連結' },
    copyLink: { id: 'voucher.VoucherDeliverModal.copyLink', defaultMessage: '複製連結' },
    transfer: { id: 'voucher.VoucherDeliverModal.transfer', defaultMessage: '轉贈' },
  }),
  VoucherExchangeModal: defineMessages({
    useNow: { id: 'voucher.VoucherExchangeModal.useNow', defaultMessage: '立即使用' },
    exchange: { id: 'voucher.VoucherExchangeModal.exchange', defaultMessage: '兌換' },
    notice: { id: 'voucher.VoucherExchangeModal.notice', defaultMessage: '兌換券為一次使用後失效，請一次兌換完畢' },
    productQuantityLimitText: {
      id: 'voucher.VoucherExchangeModal.productQuantityLimitText',
      defaultMessage: 'can exchange {productQuantityLimit} items',
    },
    emptyNoticeText: {
      id: 'voucher.VoucherExchangeModal.emptyNoticeText',
      defaultMessage: 'This Product is outdated,',
    },
    emptyNoticeText2: {
      id: 'voucher.VoucherExchangeModal.emptyNoticeText2',
      defaultMessage: 'please contact staff for assistance',
    },
  }),
}

export default voucherMessages
