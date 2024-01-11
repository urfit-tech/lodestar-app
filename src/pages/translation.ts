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
    TitleSecondText: { id: 'page.ResetPasswordPage.TitleSecondText', defaultMessage: '請輸入密碼來完成帳號設定' },
  }),
}

export const termPrivacyMessages = {
  Defaults: defineMessages({
    term: { id: 'term', defaultMessage: '使用條款' },
  }),
  TermPrivacyTitlePage: defineMessages({
    title: { id: 'term.privacy.title', defaultMessage: '隱私權政策' },
  }),
  TermPrivacyClausePage: defineMessages({
    item1: { id: 'term.privacy.clause.item1', defaultMessage: '一、總則' },
    item2: { id: 'term.privacy.clause.item2', defaultMessage: '二、資訊的收集' },
    item3: { id: 'term.privacy.clause.item3', defaultMessage: '三、資訊的使用與處理' },
    item4: { id: 'term.privacy.clause.item4', defaultMessage: '四、資訊的分享與披露' },
    item5: { id: 'term.privacy.clause.item5', defaultMessage: '五、資訊的安全' },
    item6: { id: 'term.privacy.clause.item6', defaultMessage: '六、Cookie 和相似技術' },
    item7: { id: 'term.privacy.clause.item7', defaultMessage: '七、隱私權政策的修改' },
    item8: { id: 'term.privacy.clause.item8', defaultMessage: '八、個人資料權利' },
    item9: { id: 'term.privacy.clause.item9', defaultMessage: '九、聯絡我們' },
  }),
  TermPrivacyParagraphPage: defineMessages({
    item1: {
      id: 'term.privacy.paragraph.item1',
      defaultMessage:
        '歡迎使用本服務。本隱私權政策旨在告知您我們如何收集、使用、保護及處理您的個人資訊，並遵循相關法規與Facebook平臺的隱私政策。本隱私權政策適用於使用我們服務的所有用戶，包括透過Facebook登入的用戶。',
    },
    item2: {
      id: 'term.privacy.paragraph.item2',
      defaultMessage:
        '註冊資訊： 當您註冊成為我們的會員時，我們可能會收集您的姓名、電子郵件地址、居住地址、電話號碼等必要的註冊資訊。Facebook 登入資訊： 若您透過Facebook登入，我們可能會取得您在Facebook上的公開資訊，包括但不限於個人檔案資訊、朋友清單、聯絡資訊。使用資訊： 我們可能會自動收集使用資訊，包括IP地址、訪問時間、使用的瀏覽器類型等，以優化使用者體驗。',
    },
    item3: {
      id: 'term.privacy.paragraph.item3',
      defaultMessage:
        '提供服務： 收集的資訊將用於提供、維護、改進我們的服務，確保您有安全、高效的使用體驗。個別化服務： 我們可能使用您的資訊提供個別化的內容、推薦或廣告，並提高服務品質。Facebook 登入資訊的使用： 我們僅在必要時使用Facebook登入資訊，不會未經您同意而發布在您Facebook帳戶的資訊。',
    },
    item4: {
      id: 'term.privacy.paragraph.item4',
      defaultMessage:
        '第三方分享： 我們不會出售、交換或轉讓您的個人資訊給第三方，除非經您同意或法律要求。合規披露： 我們將依法披露必要的資訊，以回應法律程序、法院命令或保護我們和其他用戶的權利。',
    },
    item5: {
      id: 'term.privacy.paragraph.item5',
      defaultMessage:
        '安全措施： 我們實施合理的安全措施，以保護您的個人資訊免受未經授權的存取、使用或披露。數據存儲： 您的資訊可能會存儲於我們的伺服器或合作夥伴的安全伺服器上。',
    },
    item6: {
      id: 'term.privacy.paragraph.item6',
      defaultMessage: 'Cookie的使用： 我們可能使用Cookie和相似技術以提升使用者體驗，但您可在瀏覽器中進行相應設定。',
    },
    item7: {
      id: 'term.privacy.paragraph.item7',
      defaultMessage: '政策修改： 我們保留修改本隱私權政策的權利，修改後的政策將在我們的網站上發佈。',
    },
    item8: {
      id: 'term.privacy.paragraph.item8',
      defaultMessage:
        '個人資料權利： 您有權查詢、更正、刪除您的個人資訊，以及反對或限制其處理。如欲行使上述權利，請聯繫我們。',
    },
    item9: { id: 'term.privacy.paragraph.item9', defaultMessage: '若您對本隱私權政策有任何疑問或疑慮，請聯絡我們。' },
  }),
}

export default pageMessages
