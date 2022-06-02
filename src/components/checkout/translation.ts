import { defineMessages } from 'react-intl'

const checkoutMessages = {
  '*': defineMessages({}),
  CouponInsertionCard: defineMessages({
    addSuccess: { id: 'checkout.CouponInsertionCard.addSuccess', defaultMessage: '成功加入折扣券' },
  }),
  CouponSelectionModal: defineMessages({
    addSuccess: { id: 'checkout.CouponSelectionModal.addSuccess', defaultMessage: '成功加入折扣券' },
  }),
}

export default checkoutMessages
