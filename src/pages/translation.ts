import { defineMessages } from 'react-intl'

const pageMessages = {
  '*': defineMessages({
    cancel: { id: 'page.*.cancel', defaultMessage: '取消' },
    review: { id: 'page.*.review', defaultMessage: '評價' },
    intro: { id: 'page.*.intro', defaultMessage: '簡介' },
  }),
  // AppPage
  AppPage: defineMessages({
    logoutAlert: { id: 'page.AppPage.logoutAlert', defaultMessage: '您已被登出，目前有其他裝置登入這組帳號' },
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
    download: {
      id: 'page.MemberCertificatePage.download',
      defaultMessage: '下載證書',
    },
  }),
  // MerchandisePage
  MerchandisePage: defineMessages({}),
  MerchandisePageTabs: defineMessages({
    overview: { id: 'page.MerchandisePageTabs.overview', defaultMessage: 'Overview' },
    qa: { id: 'page.MerchandisePageTabs.qa', defaultMessage: 'Q&A' },
  }),
  // PortfolioPage
  PortfolioPage: defineMessages({
    loadingPortfolioPageError: {
      id: 'page.PortfolioPage.loadingPortfolioPageError',
      defaultMessage: 'loading portfolio error',
    },
    participant: {
      id: 'page.PortfolioPage.participant',
      defaultMessage: 'participant',
    },
    relatedPortfolios: {
      id: 'page.PortfolioPage.relatedPortfolios',
      defaultMessage: 'Related Portfolios',
    },
    applyTag: {
      id: 'page.PortfolioPage.applyTag',
      defaultMessage: 'apply tag',
    },
  }),
  SearchPage: defineMessages({
    fundingProject: {
      id: 'page.SearchPage.fundingProject',
      defaultMessage: 'Funding Project',
    },
    portfolioProject: {
      id: 'page.SearchPage.portfolioProject',
      defaultMessage: 'Portfolio Project',
    },
    preOrderProject: {
      id: 'page.SearchPage.preOrderProject',
      defaultMessage: 'PreOrder Project',
    },
    noTagContent: { id: 'page.SearchPage.noTagContent', defaultMessage: 'No content found for this tag' },
    noSearchResult: { id: 'page.SearchPage.noSearchResult', defaultMessage: 'No related content found' },
    program: { id: 'page.SearchPage.program', defaultMessage: 'Online Course' },
    programPackage: { id: 'page.SearchPage.programPackage', defaultMessage: 'Program Package' },
    activity: { id: 'page.SearchPage.activity', defaultMessage: 'Activity' },
    podcast: { id: 'page.SearchPage.podcast', defaultMessage: 'Broadcast' },
    post: { id: 'page.SearchPage.post', defaultMessage: 'Post' },
    creator: { id: 'page.SearchPage.creator', defaultMessage: 'Master' },
    merchandise: { id: 'page.SearchPage.merchandise', defaultMessage: 'merchandise' },
    project: { id: 'page.SearchPage.project', defaultMessage: 'Project' },
  }),
  ResetPasswordPage: defineMessages({
    TitleFirstText: { id: 'page.ResetPasswordPage.TitleFirstText', defaultMessage: '你的帳號為 {account}' },
    TitleSecondText: { id: 'page.ResetPasswordPage.TitleSecondText', defaultMessage: '請輸入新密碼' },
  }),
}

export default pageMessages
