import { defineMessages } from 'react-intl'

const pageMessages = {
  '*': defineMessages({
    cancel: { id: 'page.*.cancel', defaultMessage: '取消' },
    review: { id: 'page.*.review', defaultMessage: '評價' },
    intro: { id: 'page.*.intro', defaultMessage: '簡介' },
  }),
  // ProgramContentPage
  ProgramContentPage: defineMessages({
    foo: { id: 'page.ProgramContentPage.foo', defaultMessage: 'Foo Message' },
    bar: { id: 'page.ProgramContentPage.bar', defaultMessage: 'Bar Message' },
  }),
  ProgramContentTabs: defineMessages({
    foo: { id: 'page.ProgramContentTabs.foo', defaultMessage: 'Foo Message' },
    bar: { id: 'page.ProgramContentTabs.bar', defaultMessage: 'Bar Message' },
  }),
  ProgramContentBlock: defineMessages({
    loginTrial: { id: 'page.ProgramContentBlock.loginTrial', defaultMessage: '登入後試看' },
  }),
  // ProgramPage
  ProgramPage: defineMessages({
    foo: { id: 'page.ProgramPage.foo', defaultMessage: 'Foo Message' },
    bar: { id: 'page.ProgramPage.bar', defaultMessage: 'Bar Message' },
  }),
  // JoinPage
  JoinPage: defineMessages({
    title: { id: 'page.JoinPage.title', defaultMessage: 'Join KOLABLE!' },
  }),
  // ProfilePage
  ProfilePage: defineMessages({
    activity: { id: 'page.ProfilePage.activity', defaultMessage: 'Activity' },
    merchandise: { id: 'page.ProfilePage.merchandise', defaultMessage: 'Merchandise' },
    program: { id: 'page.ProfilePage.program', defaultMessage: 'Program' },
    post: { id: 'page.ProfilePage.post', defaultMessage: 'Post' },
    appointment: { id: 'page.ProfilePage.appointment', defaultMessage: 'Appointment' },
    updatedAt: { id: 'page.ProfilePage.updatedAt', defaultMessage: 'Last updated' },
    editProfile: { id: 'page.ProfilePage.editProfile', defaultMessage: 'Edit Profile' },
    customizePage: { id: 'page.ProfilePage.customizePage', defaultMessage: 'Customize Page' },
    addActivity: { id: 'page.ProfilePage.addActivity', defaultMessage: 'New Activity' },
    addProgram: { id: 'page.ProfilePage.addProgram', defaultMessage: 'New Program' },
    addPost: { id: 'page.ProfilePage.addPost', defaultMessage: 'New Post' },
    addMerchandise: { id: 'page.ProfilePage.addMerchandise', defaultMessage: 'New Merchandise' },
    addAppointment: { id: 'page.ProfilePage.addAppointment', defaultMessage: 'New Appointment' },
  }),
  MemberCertificatePage: defineMessages({
    number: { id: 'page.MemberCertificatePage.number', defaultMessage: '證書編號：{number}' },
    expiredTime: { id: 'page.MemberCertificatePage.expiredTime', defaultMessage: '證書效期：{expiredTime} 止' },
    deliveredAt: {
      id: 'page.MemberCertificatePage.deliveredAt',
      defaultMessage: '發放日期：{deliveredAt}',
    },
    congratulations: {
      id: 'page.MemberCertificatePage.congratulations',
      defaultMessage: '已取得證書，快分享給身邊的朋友吧！',
    },
    share: {
      id: 'page.MemberCertificatePage.share',
      defaultMessage: '分享社群',
    },
    qualification: {
      id: 'page.MemberCertificatePage.qualification',
      defaultMessage: '學習時數',
    },
  }),
  // MerchandisePage
  MerchandisePage: defineMessages({}),
  MerchandisePageTabs: defineMessages({
    overview: { id: 'page.MerchandisePageTabs.overview', defaultMessage: 'Overview' },
    qa: { id: 'page.MerchandisePageTabs.qa', defaultMessage: 'Q&A' },
  }),
}

export default pageMessages
