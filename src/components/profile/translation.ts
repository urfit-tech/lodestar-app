import { defineMessages } from 'react-intl'

const profileMessages = {
  ProfileAccountAdminCard: defineMessages({
    sendVerifiedEmailSuccessfully: {
      id: 'profile.ProfileAccountAdminCard.sendVerifiedEmailSuccessfully',
      defaultMessage: '驗證信寄送成功',
    },
    sendEmail: {
      id: 'profile.ProfileAccountAdminCard.sendEmail',
      defaultMessage: '寄驗證信',
    },
    sendEmailAfter: {
      id: 'profile.ProfileAccountAdminCard.sendEmailAfter',
      defaultMessage: '{count} 秒後可再寄送',
    },
  }),
  ProfileOtherAdminCard: defineMessages({
    otherInfoTitle: { id: 'profileMessages.ProfileOtherAdminCard.otherInfoTitle', defaultMessage: '其他資料' },
    phone: { id: 'profileMessages.ProfileOtherAdminCard.phone', defaultMessage: '手機號碼' },
    enterPhone: { id: 'profileMessages.ProfileOtherAdminCard.enterPhone', defaultMessage: '請輸入手機號碼' },
    enterCorrectPhone: {
      id: 'profileMessages.ProfileOtherAdminCard.enterCorrectPhone',
      defaultMessage: '請輸入正確手機格式',
    },
    enter: { id: 'profileMessages.ProfileOtherAdminCard.enter', defaultMessage: '請輸入 {enterLabel}' },
    uniformNumberIsInvalidated: {
      id: 'profileMessages.ProfileOtherAdminCard.uniformNumberIsInvalidated',
      defaultMessage: '統一編號無效',
    },
  }),
  ProfileBasicBusinessCard: defineMessages({
    basicInfo: { id: 'profileMessages.ProfileBasicBusinessCard.basicInfo', defaultMessage: '基本資料' },
    companyPicture: { id: 'profileMessages.ProfileBasicBusinessCard.companyPicture', defaultMessage: '公司 Logo' },
    notUploaded: { id: 'profileMessages.ProfileBasicBusinessCard.notUploaded', defaultMessage: '尚未上傳' },
  }),
  ProfileIntroBusinessCard: defineMessages({
    basicInfo: { id: 'profileMessages.ProfileIntroBusinessCard.basicInfo', defaultMessage: '公司描述' },
    abstract: { id: 'profileMessages.ProfileIntroBusinessCard.abstract', defaultMessage: '公司介紹' },
    intro: { id: 'profileMessages.ProfileIntroBusinessCard.intro', defaultMessage: '公司簡述' },
  }),
}

export default profileMessages
