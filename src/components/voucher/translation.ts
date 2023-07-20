import { defineMessages } from 'react-intl'

const voucherMessages = {
  '*': defineMessages({
    close: { id: 'voucher.*.close', defaultMessage: 'close' },
    cancel: { id: 'voucher.*.cancel', defaultMessage: 'cancel' },
    send: { id: 'voucher.*.send', defaultMessage: '送出' },
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
    exchanging: {
      id: 'voucher.VoucherExchangeModal.exchanging',
      defaultMessage: '兌換中',
    },
    pleaseEnterPinCode: {
      id: 'voucher.VoucherExchangeModal.pleaseEnterPinCode',
      defaultMessage: '請輸入兌換 PIN 碼',
    },
    pinCode: {
      id: 'voucher.VoucherExchangeModal.pinCode',
      defaultMessage: 'PIN 碼',
    },
    errorPinCode: {
      id: 'voucher.VoucherExchangeModal.errorPinCode',
      defaultMessage: '錯誤的 PIN 碼',
    },
    exchangingInfo: {
      id: 'voucher.VoucherExchangeModal.exchangingInfo',
      defaultMessage: '兌換中，請稍候',
    },
    exchangingError: {
      id: 'voucher.VoucherExchangeModal.exchangingError',
      defaultMessage: '兌換失敗',
    },
    exchangeVoucher: {
      id: 'voucher.VoucherExchangeModal.exchangeVoucher',
      defaultMessage: '兌換成功，請到「我的主頁」查看',
    },
  }),
  Voucher: defineMessages({
    fromNow: { id: 'voucher.Voucher.fromNow', defaultMessage: '即日起' },
    noUsePeriod: { id: 'voucher.Voucher.noUsePeriod', defaultMessage: '無使用期限' },
    redeemable: { id: 'voucher.Voucher.redeemable', defaultMessage: '可兌換' },
  }),
}

export default voucherMessages
