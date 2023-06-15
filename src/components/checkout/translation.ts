import { defineMessages } from 'react-intl'

const checkoutMessages = {
  '*': defineMessages({
    use: { id: 'checkout.*.use', defaultMessage: '使用' },
  }),
  CouponInsertionCard: defineMessages({
    addSuccess: { id: 'checkout.CouponInsertionCard.addSuccess', defaultMessage: '成功加入折扣券' },
  }),
  CouponSelectionModal: defineMessages({
    addSuccess: { id: 'checkout.CouponSelectionModal.addSuccess', defaultMessage: '成功加入折扣券' },
  }),
  CoinCheckoutModal: defineMessages({
    currentOwnedCoins: {
      id: 'checkout.CoinCheckoutModal.currentOwnedCoins',
      defaultMessage: '目前擁有 ',
    },
    inputLabel: {
      id: 'checkout.CoinCheckoutModal.inputLabel',
      defaultMessage: '手機（寄送預約通知使用）',
    },
    pleaseEnterPhone: {
      id: 'checkout.CoinCheckoutModal.pleaseEnterPhone',
      defaultMessage: '請輸入手機號碼',
    },
    checkPhoneFormat: {
      id: 'checkout.CoinCheckoutModal.checkPhoneFormat',
      defaultMessage: '請確認格式',
    },
  }),
}

export default checkoutMessages
