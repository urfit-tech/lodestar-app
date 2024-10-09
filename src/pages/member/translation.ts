import { defineMessages } from 'react-intl'

const memberPageMessages = {
  '*': defineMessages({}),
  ProfileAdminPage: defineMessages({
    verifiedEmailSuccess: {
      id: 'memberPage.ProfileAdminPage.verifiedEmailSuccess',
      defaultMessage: '信箱驗證成功',
    },
  }),
  PracticeCollectionAdminPage: defineMessages({
    noAssignments: {
      id: 'practiceCollectionAdminPage.noAssignments',
      defaultMessage: '沒有作業唷，可以去課程裡繳交作業，之後來這查看。',
    },
  }),
}

export default memberPageMessages
