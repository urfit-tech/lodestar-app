import { defineMessages } from 'react-intl'

const programMessages = {
  '*': defineMessages({
    fetchError: { id: 'program.*.fetchError', defaultMessage: '讀取失敗' },
  }),
  ProgramContentNoAuthBlock: defineMessages({
    noAuth: { id: 'program.ProgramContentNoAuthBlock.noAuth', defaultMessage: '沒有此頁瀏覽權限' },
  }),
  ProgramCard: defineMessages({
    reviewCount: { id: 'program.ProgramCard.reviewCount', defaultMessage: '{count} 則' },
    noReviews: { id: 'program.ProgramCard.noReviews', defaultMessage: '目前無評價' },
    notForSale: { id: 'program.ProgramCard.notForSale', defaultMessage: '暫不販售' },
  }),
  ProgramContentMaterialBlock: defineMessages({
    loadingMaterialError: {
      id: 'program.ProgramContentMaterialBlock.loadingMaterialError',
      defaultMessage: '無法取得教材',
    },
    attachment: {
      id: 'program.ProgramContentMaterialBlock.attachment',
      defaultMessage: '附件',
    },
  }),
  ProgramContentMenu: defineMessages({
    materialAmount: { id: 'program.ProgramContentMenu.materialAmount', defaultMessage: '{amount}個檔案' },
    totalQuestion: { id: 'program.ProgramContentMenu.totalAmount', defaultMessage: '共 {count} 題' },
    programList: { id: 'program.ProgramContentMenu.head', defaultMessage: '課程列表' },
    unit: { id: 'program.ProgramContentMenu.unit', defaultMessage: '單元排序' },
    time: { id: 'program.ProgramContentMenu.time', defaultMessage: '時間排序' },
    expired: { id: 'program.ProgramContentMenu.expired', defaultMessage: '到期' },
  }),
  ProgramContentPlayer: defineMessages({
    next: { id: 'program.ProgramContentPlayer.next', defaultMessage: '接下來' },
  }),
  ProgramDisplayedListItem: defineMessages({
    expiredAt: { id: 'program.ProgramDisplayedListItem.expiredAt', defaultMessage: '到期' },
  }),
  ProgramSelector: defineMessages({
    allPrograms: { id: 'program.ProgramSelector.allPrograms', defaultMessage: '全部課程' },
  }),
}

export default programMessages
