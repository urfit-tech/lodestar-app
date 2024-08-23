import { defineMessages } from 'react-intl'

const GroupBuyingReceivedPageMessages = {
  '*': defineMessages({
    duplicate: { id: 'RedeemPageMessages.*.duplicate', defaultMessage: '複製' },
    noItem: { id: 'RedeemPageMessages.*.noItem', defaultMessage: '查無項目' },
  }),
  productWording: defineMessages({
    receiveProgram: {
      id: 'groupBuyingReceivedPage.text.receiveProgram',
      defaultMessage: '你已收到一堂課程',
    },
    programPlanName: {
      id: 'groupBuyingReceivedPage.text.programPlanName',
      defaultMessage: '課程',
    },
    availableProgram: {
      id: 'groupBuyingReceivedPage.text.availableProgram',
      defaultMessage: '現在你可使用課程囉！',
    },
    receiveTicket: {
      id: 'groupBuyingReceivedPage.text.receiveTicket',
      defaultMessage: '你已收到一張票券',
    },
    ticketName: {
      id: 'groupBuyingReceivedPage.text.ticketName',
      defaultMessage: '票券',
    },
    availableActivity: {
      id: 'groupBuyingReceivedPage.text.availableActivity',
      defaultMessage: '接下來就可以參與活動囉！',
    },
    receiveProduct: {
      id: 'groupBuyingReceivedPage.text.receiveProduct',
      defaultMessage: '你已收到一個商品',
    },
    productName: {
      id: 'groupBuyingReceivedPage.text.productName',
      defaultMessage: '商品',
    },
    availableProduct: {
      id: 'groupBuyingReceivedPage.text.availableProduct',
      defaultMessage: '現在你可使用產品囉！',
    },
    confirmReceive: {
      id: 'groupBuyingReceivedPage.text.confirmReceive',
      defaultMessage: '確認領取',
    },
    receiveNow: {
      id: 'groupBuyingReceivedPage.text.receiveNow',
      defaultMessage: '立即接收',
    },
    viewNow: {
      id: 'groupBuyingReceivedPage.text.viewNow',
      defaultMessage: '立即查看',
    },
    expired: {
      id: 'groupBuyingReceivedPage.text.expired',
      defaultMessage: '超過領取效期',
    },
    itemReceived: {
      id: 'groupBuyingReceivedPage.text.itemReceived',
      defaultMessage: '該項目已被領取',
    },
    contactOwner: {
      id: 'groupBuyingReceivedPage.text.contactOwner',
      defaultMessage: '請與 {ownerName} 聯繫。',
    },
    idleMessage: {
      id: 'groupBuyingReceivedPage.text.idleMessage',
      defaultMessage: '來自 {ownerName} 贈送的「{title}」的{productName}，請於 {expDate} 前領取。',
    },
    loadingMessage: {
      id: 'groupBuyingReceivedPage.text.loadingMessage',
      defaultMessage: '來自 {ownerName} 贈送的「{title}」{exp}',
    },
    failedMessage: {
      id: 'groupBuyingReceivedPage.text.failedMessage',
      defaultMessage: '{productName}已超過領取效期，請與 {ownerName} 聯繫。',
    },
    transferredMessage: {
      id: 'groupBuyingReceivedPage.text.transferredMessage',
      defaultMessage: '該項目已被領取，請與 {ownerName} 聯繫。',
    },
    receiveTitle: {
      id: 'groupBuyingReceivedPage.text.receiveTitle',
      defaultMessage: '接收{productName}',
    },
    successTitle: {
      id: 'groupBuyingReceivedPage.text.successTitle',
      defaultMessage: '已收到{productName}',
    },
    backToHome: {
      id: 'groupBuyingReceivedPage.text.backToHome',
      defaultMessage: '回首頁',
    },
  }),
}

export default GroupBuyingReceivedPageMessages
