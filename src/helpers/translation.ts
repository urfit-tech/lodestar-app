import { defineMessages } from 'react-intl'

export const authMessages = {
  title: defineMessages({
    login: { id: 'auth.title.login', defaultMessage: '登入' },
  }),
  ui: defineMessages({
    facebookLogin: { id: 'auth.ui.facebookLogin', defaultMessage: 'Facebook 登入/註冊' },
    lineLogin: { id: 'auth.ui.lineLogin', defaultMessage: '使用 Line 繼續' },
    parentingLogin: { id: 'auth.ui.parentingLogin', defaultMessage: '使用 親子天下帳號 繼續' },
    googleLogin: { id: 'auth.ui.googleLogin', defaultMessage: 'Google 登入/註冊' },
  }),
  content: defineMessages({
    noMember: { id: 'auth.content.noMember', defaultMessage: '還不是會員嗎？' },
    isMember: { id: 'auth.content.isMember', defaultMessage: '已經是會員了嗎?' },
    loginFb: { id: 'auth.content.loginFb', defaultMessage: 'Facebook 登入/註冊' },
  }),
  message: defineMessages({
    fbError: { id: 'auth.message.error.fb', defaultMessage: `無法從 Facebook 登入/註冊` },
    googleError: { id: 'auth.message.error.google', defaultMessage: `無法從 Google 登入/註冊` },
  }),
  link: defineMessages({
    forgotPassword: { id: 'auth.link.password.forgot', defaultMessage: '忘記密碼？' },
  }),
}

export const commonMessages = {
  defaults: defineMessages({
    establish: { id: 'common.establish', defaultMessage: '建立' },
    participants: { id: 'common.participants', defaultMessage: '參與名單' },
    or: { id: 'common.or', defaultMessage: '或' },
    about: { id: 'common.about', defaultMessage: '約' },
    countdown: { id: 'common.countdown', defaultMessage: '優惠倒數' },
    more: { id: 'common.more', defaultMessage: '查看更多' },
  }),
  term: defineMessages({
    grid: { id: 'common.term.grid', defaultMessage: '格狀' },
    list: { id: 'common.term.list', defaultMessage: '清單' },
    expiredAt: { id: 'common.term.expiredAt', defaultMessage: '到期' },
  }),
  status: defineMessages({
    activityStart: { id: 'product.activity.ticket.start', defaultMessage: '活動開始' },
    onSale: { id: 'product.project.tag.onSale', defaultMessage: '優惠中' },
    solving: { id: 'common.checkbox.solving', defaultMessage: '解決中' },
    uploading: { id: 'common.uploading', defaultMessage: '上傳中' },
    coming: { id: 'product.activity.ticket.coming', defaultMessage: '即將舉行' },
    loading: { id: 'common.loading', defaultMessage: '載入中' },
    loadingError: { id: 'common.loading.error', defaultMessage: '載入失敗' },
    loadingNotificationError: { id: 'common.loading.error.notification', defaultMessage: '無法載入通知' },
    loadingQuestionError: { id: 'common.loading.error.question', defaultMessage: '無法取得問題' },
    loadingProductError: { id: 'common.loading.error.product', defaultMessage: '讀取產品錯誤' },
    loadingDataError: { id: 'common.loading.error.data', defaultMessage: '無法載入資料' },
    loadingUnable: { id: 'common.loading.unable', defaultMessage: '無法載入' },
    readingError: { id: 'common.reading.error', defaultMessage: '讀取錯誤' },
    readingFail: { id: 'common.reading.fail', defaultMessage: '讀取失敗' },
    programError: { id: 'common.courseProblem.error', defaultMessage: '課程問題錯誤' },
    noProgramError: { id: 'common.courseProblem.no', defaultMessage: '沒有課程問題' },
    fail: { id: 'common.fail', defaultMessage: '付款失敗' },
    finished: { id: 'common.finished', defaultMessage: '已結束' },
    unsolved: { id: 'common.checkbox.unsolved', defaultMessage: '已解決' },
    expired: { id: 'common.expired', defaultMessage: '已失效' },
    projectFinished: { id: 'common.project.finished', defaultMessage: '專案結束' },
    available: { id: 'common.available', defaultMessage: '可使用' },
    sendable: { id: 'common.status.sendable', defaultMessage: '可發送' },
    participable: { id: 'common.status.participable', defaultMessage: '可參與' },
    sent: { id: 'common.status.sent', defaultMessage: '已發送' },
    received: { id: 'common.status.received', defaultMessage: '已收到' },
  }),
  ui: defineMessages({
    programs: { id: 'common.program', defaultMessage: '課程' },
    activities: { id: 'common.activity', defaultMessage: '活動' },
    merchandise: { id: 'common.merchandise', defaultMessage: '商品' },
    memberCards: { id: 'common.memberCard', defaultMessage: '會員卡' },
    packages: { id: 'common.package', defaultMessage: '課程組合' },
    projects: { id: 'common.project', defaultMessage: '專案方案' },
    podcast: { id: 'common.podcast', defaultMessage: '廣播節目' },
    podcastSubscription: { id: 'common.podcast.subscription', defaultMessage: '廣播方案' },
    allPrograms: { id: 'common.program.all', defaultMessage: '所有單次課程' },
    allActivities: { id: 'common.activity.all', defaultMessage: '所有實體' },
    allMerchandise: { id: 'common.merchandise.all', defaultMessage: '所有商品' },
    allSubscriptions: { id: 'common.subscription.all', defaultMessage: '所有訂閱方案' },
    allCourseContents: { id: 'common.courseContent.all', defaultMessage: '所有課程內容' },
    allMemberCards: { id: 'common.memberCard.all', defaultMessage: '所有會員卡' },
    all: { id: 'common.ui.all', defaultMessage: '全部' },
    back: { id: 'common.ui.back', defaultMessage: '返回' },
    repay: { id: 'common.ui.repay', defaultMessage: '重新付款' },
    search: { id: 'common.ui.search', defaultMessage: '搜尋' },
    upload: { id: 'common.ui.upload', defaultMessage: '上傳' },
    uploadFile: { id: 'common.ui.uploadFile', defaultMessage: '上傳檔案' },
    uploadImage: { id: 'common.ui.uploadImage', defaultMessage: '上傳圖片' },
    cancel: { id: 'common.ui.cancel', defaultMessage: '取消' },
    groupBuying: { id: 'common.ui.groupBuying', defaultMessage: '我的團購' },
    send: { id: 'common.ui.send', defaultMessage: '發送' },
    sendNow: { id: 'common.ui.sendNow', defaultMessage: '立即發送' },
    purchase: { id: 'common.ui.purchase', defaultMessage: '立即購買' },
    physical: { id: 'common.ui.physical', defaultMessage: '實體' },
    virtual: { id: 'common.ui.virtual', defaultMessage: '虛擬' },
    allCategory: { id: 'common.ui.allCategory', defaultMessage: '全部分類' },
    groupBuy: { id: 'common.ui.groupBuy', defaultMessage: '立即團購' },
  }),
  title: defineMessages({
    addCourse: { id: 'common.title.course', defaultMessage: '開設課程' },
    subscription: { id: 'common.title.programPlan', defaultMessage: '訂閱方案' },
    point: { id: 'common.title.point', defaultMessage: '點數紀錄' },
    podcastSubscription: { id: 'common.title.podcast.subscribe', defaultMessage: '訂閱廣播頻道' },
    forgotPassword: { id: 'common.title.password.forgot', defaultMessage: '忘記密碼' },
    sortContent: { id: 'product.program.title.content.sort', defaultMessage: '內容排序' },
    courseDelete: { id: 'product.program.title.course.delete', defaultMessage: '刪除課程' },
    notification: { id: 'product.program.title.notification', defaultMessage: '你的通知' },
    purchasedItemAvailable: { id: 'common.message.success.purchasedItemAvailable', defaultMessage: '購買的項目已開通' },
    systemBusy: { id: 'common.message.success.systemBusy', defaultMessage: '系統忙碌中' },
    purchasedItemPreparing: { id: 'common.message.success.purchasedItemPreparing', defaultMessage: '購買的項目準備中' },
    paymentFail: { id: 'common.fail', defaultMessage: '付款失敗' },
    creditCardConfirm: { id: 'common.confirm.credit', defaultMessage: '請確認您的信用卡資料正確後，再付款一次。' },
    error: { id: 'common.title.error', defaultMessage: 'Oops !' },
    routeError: { id: 'common.title.routeError', defaultMessage: '找不到頁面' },
    repairing: { id: 'common.label.repairing', defaultMessage: '網站維護中' },
  }),
  tab: defineMessages({
    course: { id: 'common.tab.course', defaultMessage: '參與課程' },
    project: { id: 'common.tab.project', defaultMessage: '專案項目' },
    activity: { id: 'common.tab.activityTicket', defaultMessage: '我的票券' },
    podcast: { id: 'common.tab.podcasts', defaultMessage: '我的廣播' },
    appointment: { id: 'common.tab.appointments', defaultMessage: '預約服務' },
  }),
  message: {
    success: defineMessages({
      passwordUpdate: { id: 'common.message.success.password.updated', defaultMessage: '已更新密碼' },
      save: { id: 'common.message.success.save', defaultMessage: '儲存成功' },
    }),
  },
  event: defineMessages({
    successfullySaved: { id: 'common.event.successfullySaved', defaultMessage: '儲存成功' },
    successfullyUpload: { id: 'common.event.successfullyUpload', defaultMessage: '上傳成功' },
    loading: { id: 'common.event.loading', defaultMessage: '載入中' },
    successfullyCreated: { id: 'common.event.successfullyCreated', defaultMessage: '建立成功' },
    successfullyEdited: { id: 'common.event.successfullyEdited', defaultMessage: '編輯成功' },
    successfullyDeleted: { id: 'common.event.successfullyDeleted', defaultMessage: '刪除成功' },
  }),
  alert: defineMessages({
    noPath: { id: 'common.alert.noPath', defaultMessage: '無此路徑' },
    isEnrolled: { id: 'common.alert.isEnrolled', defaultMessage: '你已持有課堂課程，確定要換購嗎？' },
  }),
  button: defineMessages({
    reset: { id: 'common.button.reset', defaultMessage: '重置' },
    inquire: { id: 'common.button.inquire', defaultMessage: '查詢' },
    register: { id: 'common.button.register', defaultMessage: '立即報名' },
    print: { id: 'common.button.print', defaultMessage: '列印' },
    download: { id: 'common.button.download', defaultMessage: '下載名單' },
    attend: { id: 'common.button.attend', defaultMessage: '進入會議' },
    unreleased: { id: 'common.button.unreleased', defaultMessage: '尚未發售' },
    unOpened: { id: 'common.button.unOpened', defaultMessage: '尚未開放' },
    soldOut: { id: 'common.button.soldOut', defaultMessage: '已售完' },
    cutoff: { id: 'common.button.cutoff', defaultMessage: '已截止' },
    cutoffProject: { id: 'common.button.cutoff.project', defaultMessage: '專案已結束' },
    onSale: { id: 'common.button.onSale', defaultMessage: '販售中' },
    toCalendar: { id: 'common.button.toCalendar', defaultMessage: '加入行事曆' },
    signUp: { id: 'common.button.signUp', defaultMessage: '註冊' },
    sendSms: { id: 'common.button.sendSms', defaultMessage: '發送簡訊碼' },
    sendSmsIdle: { id: 'common.button.sendSmsIdle', defaultMessage: '已發送簡訊碼，請稍後再嘗試' },
    verifySms: { id: 'common.button.verifySms', defaultMessage: '驗證簡訊碼' },
    login: { id: 'auth.login', defaultMessage: '登入' },
    save: { id: 'common.button.save', defaultMessage: '儲存' },
    list: { id: 'common.button.list', defaultMessage: `查看清單` },
    back: { id: 'common.button.back', defaultMessage: '返回' },
    subscribeNow: { id: 'common.subscribe.now', defaultMessage: '立即訂閱' },
    subscribe: { id: 'common.subscribe', defaultMessage: '立即參與' },
    details: { id: 'common.button.details', defaultMessage: '詳情' },
    add: { id: 'common.button.add', defaultMessage: '新增' },
    confirm: { id: 'common.button.confirm', defaultMessage: '確認' },
    cart: { id: 'common.button.cart', defaultMessage: '前往購物車' },
    addCart: { id: 'common.button.cart.add', defaultMessage: '加入購物車' },
    join: { id: 'common.button.join', defaultMessage: '立即參與' },
    reselectCoupon: { id: 'checkout.form.radio.coupon.reselect', defaultMessage: '重新選擇' },
    chooseCoupon: { id: 'checkout.form.radio.coupon.choose', defaultMessage: '選擇折價券' },
    reupload: { id: 'common.reupload', defaultMessage: '重新上傳' },
    viewCourse: { id: 'common.button.course.view', defaultMessage: '查看課程內容' },
    viewProgram: { id: 'common.button.program.view', defaultMessage: '查看課程' },
    viewSubscription: { id: 'product.program.subscription.view', defaultMessage: '查看訂閱方案' },
    viewProject: { id: 'common.button.view', defaultMessage: '查看方案' },
    enterPodcast: { id: 'common.button.podcast', defaultMessage: '進入頻道' },
    notification: { id: 'common.button.notification', defaultMessage: '查看通知' },
    markAll: { id: 'common.button.markAll', defaultMessage: '全部標示為已讀' },
    backstage: { id: 'common.button.backstage', defaultMessage: '個人管理後台' },
    home: { id: 'common.button.home', defaultMessage: '首頁' },
    backToHome: { id: 'common.button.backToHome', defaultMessage: '回首頁' },
    myPage: { id: 'common.member.myPage', defaultMessage: '我的主頁' },
    reply: { id: 'common.button.reply', defaultMessage: '回覆' },
    leaveQuestion: { id: 'common.button.leaveQuestion', defaultMessage: '留下你的問題...' },
    allCategory: { id: 'common.button.all', defaultMessage: '全部分類' },
    joinNow: { id: 'common.button.joinNow', defaultMessage: '立即加入' },
    pledge: { id: 'common.button.pledge', defaultMessage: '前往參與' },
    intro: { id: 'common.button.introduction', defaultMessage: '簡介' },
    expand: { id: 'common.button.expand', defaultMessage: '展開內容並試聽' },
    enter: { id: 'common.button.enter', defaultMessage: '進入課程' },
    establish: { id: 'common.button.establish', defaultMessage: '建立方案' },
    sortProgram: { id: 'common.button.program.sort', defaultMessage: '課程排序' },
    unpublish: { id: 'common.button.unpublish', defaultMessage: '取消發佈' },
    deleteCourse: { id: 'common.button.course.delete', defaultMessage: '刪除課程' },
    adding: { id: 'common.button.block.adding', defaultMessage: '新增區塊中' },
    addBlock: { id: 'common.button.block.add', defaultMessage: '新增區塊' },
    unknownContent: { id: 'common.button.unknownContent', defaultMessage: '未命名內容' },
    addContent: { id: 'common.button.addContent', defaultMessage: '新增內容' },
    ticket: { id: 'common.button.ticket', defaultMessage: '查看票券' },
    edit: { id: 'common.button.edit', defaultMessage: '編輯' },
    previousPage: { id: 'common.button.page.previous', defaultMessage: '返回上頁' },
    loginRegister: { id: 'common.button.loginRegister', defaultMessage: '登入 / 註冊' },
    resendEmail: { id: 'users.form.message.email.resended', defaultMessage: '再寄一次' },
    socialConnect: { id: 'common.button.socialConnect', defaultMessage: '綁定' },
    delete: { id: 'common.button.delete', defaultMessage: '刪除' },
    usePoint: { id: 'common.button.usePoint', defaultMessage: '使用點數' },
    useCoin: { id: 'common.button.useCoin', defaultMessage: '使用代幣' },
    reload: { id: 'common.button.reload', defaultMessage: '重新整理' },
    review: { id: 'common.button.review', defaultMessage: '評價' },
    loadMore: { id: 'common.button.loadMore', defaultMessage: '載入更多' },
  }),
  link: defineMessages({
    more: { id: 'common.profile', defaultMessage: '查看簡介' },
    fillIn: { id: 'common.button.fillIn', defaultMessage: '前往填寫' },
    copied: { id: 'common.link.copied', defaultMessage: '已複製連結' },
  }),
  label: defineMessages({
    title: { id: 'common.label.title', defaultMessage: '標題' },
    name: { id: 'common.label.name', defaultMessage: '名稱' },
    category: { id: 'common.label.category', defaultMessage: '類別' },
    username: { id: 'common.label.username', defaultMessage: '帳號' },
    email: { id: 'settings.label.email', defaultMessage: '信箱' },
    phone: { id: 'checkout.label.phone', defaultMessage: '手機' },
    couponTitle: { id: 'checkout.label.title', defaultMessage: '折價方案名稱' },
    referrer: { id: 'common.label.referrer', defaultMessage: '推薦人' },
    partnerChoose: { id: 'common.label.partnerChoose', defaultMessage: '發送設定' },
    targetPartner: { id: 'common.label.targetPartner', defaultMessage: '發送對象' },
    target: { id: 'common.term.target', defaultMessage: '對象：' },
    from: { id: 'common.term.from', defaultMessage: '來自：' },
    date: { id: 'common.term.date', defaultMessage: '日期：' },
    availableForLimitTime: { id: 'common.label.availableForLimitTime', defaultMessage: '可觀看' },
    isExpired: { id: 'common.label.isExpired', defaultMessage: '已到期' },
  }),
  form: {
    message: defineMessages({
      name: { id: 'common.form.message.name', defaultMessage: '請輸入名稱' },
      username: { id: 'common.form.message.username', defaultMessage: '請輸入使用者名稱' },
      password: { id: 'common.form.message.password', defaultMessage: '請輸入密碼' },
      email: { id: 'common.form.message.email', defaultMessage: '請輸入 Email' },
      emailFormatMessage: { id: 'common.form.message.email.format', defaultMessage: "'Email 格式錯誤'" },
      usernameAndEmail: { id: 'common.form.message.username.email', defaultMessage: '請輸入使用者名稱或 Email' },
      phone: { id: 'common.form.message.phone', defaultMessage: '請輸入手機' },
      smsVerification: { id: 'common.form.message.smsVerification', defaultMessage: '請輸入簡訊驗證碼' },
      enterEmail: { id: 'users.form.message.email.enter', defaultMessage: '請輸入信箱' },
      emailFormat: { id: 'users.form.message.email.format', defaultMessage: '請輸入信箱格式' },
    }),
    placeholder: defineMessages({
      username: { id: 'common.form.placeholder.username', defaultMessage: '使用者名稱' },
      password: { id: 'common.form.placeholder.password', defaultMessage: '密碼' },
      email: { id: 'common.form.placeholder.email', defaultMessage: 'Email' },
      phone: { id: 'common.form.placeholder.phone', defaultMessage: '手機號碼' },
      smsVerification: { id: 'common.form.placeholder.smsVerification', defaultMessage: '簡訊驗證碼' },
      search: { id: 'common.searchPlaceholder', defaultMessage: '選擇兌換項目' },
      referrerEmail: { id: 'common.label.referrerEmail', defaultMessage: '請輸入推薦人的註冊信箱' },
    }),
    option: defineMessages({
      unsolved: { id: 'common.select.option.unsolved', defaultMessage: '未解決' },
      solved: { id: 'common.select.option.solved', defaultMessage: '已解決' },
      all: { id: 'common.select.option.all', defaultMessage: '全部' },
      email: { id: 'users.form.message.email.registered', defaultMessage: '輸入你註冊的信箱' },
    }),
  },
  content: defineMessages({
    memberProfile: { id: 'common.memberProfile', defaultMessage: '個人檔案' },
    personalSettings: { id: 'common.personalSettings', defaultMessage: '個人設定' },
    courseProblem: { id: 'common.courseProblem', defaultMessage: '課程問題' },
    practiceManagement: { id: 'common.practiceManagement', defaultMessage: '作業管理' },
    orderHistory: { id: 'common.orderHistory', defaultMessage: '訂單紀錄' },
    contracts: { id: 'common.contracts', defaultMessage: '合約紀錄' },
    coinsAdmin: { id: 'common.coinsAdmin', defaultMessage: '代幣紀錄' },
    pointsAdmin: { id: 'common.pointsAdmin', defaultMessage: '點數紀錄' },
    coupon: { id: 'common.coupon', defaultMessage: '折價券' },
    voucher: { id: 'voucher', defaultMessage: '兌換券' },
    socialCard: { id: 'common.socialCard', defaultMessage: '社群證' },
    memberCard: { id: 'common.memberCard', defaultMessage: '會員卡' },
    certificate: { id: 'common.certificate', defaultMessage: '我的證書' },
    contact: { id: 'common.contact', defaultMessage: '聯絡客服' },
    myPage: { id: 'common.member.myPage', defaultMessage: '我的主頁' },
    logout: { id: 'common.list.item.logout', defaultMessage: '登出' },
    addCourse: { id: 'common.member.course', defaultMessage: '開設課程' },
    appointments: { id: 'common.member.appointments', defaultMessage: '大師預約' },
    browse: { id: 'common.browse', defaultMessage: '瀏覽全部' },
    podcasts: { id: 'common.member.podcasts', defaultMessage: '廣播頻道' },
    blog: { id: 'common.content.blog', defaultMessage: '部落格' },
    noPeriod: { id: 'common.period.no', defaultMessage: '無使用期限' },
    notification: { id: 'common.notification', defaultMessage: '通知' },
    recommendCourse: { id: 'common.recommend', defaultMessage: '推薦課程' },
    selectPodcast: { id: 'product.podcast.title.select', defaultMessage: '精選廣播' },
    salePrice: { id: 'product.program.content.price.sale', defaultMessage: '優惠價' },
    managementSystem: { id: 'common.content.managementSystem', defaultMessage: '管理後台' },
    deviceManagement: { id: 'common.content.deviceManagement', defaultMessage: '裝置管理' },
    resetPassword: {
      id: 'users.form.message.password.reset.already',
      defaultMessage: '已重設您的密碼，請回首頁並重新登入。',
    },
    creatorCollection: { id: 'users.title.creator.collection', defaultMessage: '大師列表' },
    description: { id: 'product.program.description', defaultMessage: '方案：' },
    noAuthority: { id: 'common.noAuthority', defaultMessage: '你沒有此頁面的讀取權限' },
    busy: {
      id: 'common.content.busy',
      defaultMessage: '您已付款成功！',
    },
    busyProcessing: {
      id: 'common.content.busyProcessing',
      defaultMessage: '由於目前系統忙碌中，訂單狀態與權益開通正在處理中',
    },
    busyCheck: { id: 'common.content.busyCheck', defaultMessage: '請於 5 ~ 10 分鐘後至訂單記錄頁進行查詢' },
    busyContact: { id: 'commonMessages.content.busyContact', defaultMessage: '若還是未開通訂單，請聯繫平台客服' },
    busySyncJob: { id: 'commonMessages.content.busySyncJob', defaultMessage: '同步訂單發生錯誤，請聯繫平台客服' },
    busyOther: { id: 'commonMessages.content.busyOther', defaultMessage: '訂單出現異狀，請聯繫平台客服' },
    busyError: { id: 'commonMessages.conetnt.busyError', defaultMessage: '錯誤代碼：{errorCode}' },
    prepare: {
      id: 'common.prepare',
      defaultMessage: '訂單查驗需要數秒的時間，將於一分鐘內會更新您的訂單資訊',
    },
    atm: {
      id: 'common.atm',
      defaultMessage: '若你選擇「ATM轉帳」或「超商付款」需於付款完成後，等待 1-2 個工作日才會開通。',
    },
    checkEmailForSecurity: {
      id: 'users.form.message.email.checked.security',
      defaultMessage: '為了安全考量，請至信箱收信更換密碼',
    },
    checkEmail: {
      id: 'users.form.message.email.checked',
      defaultMessage: '請至信箱收信更換密碼',
    },
    noIntroduction: {
      id: 'common.noIntroduction',
      defaultMessage: '目前還沒有新增介紹',
    },
    noProgram: {
      id: 'common.noProgram',
      defaultMessage: '目前還沒有建立課程',
    },
    noPost: {
      id: 'common.noPost',
      defaultMessage: '目前還沒有建立文章',
    },
    noPodcast: {
      id: 'common.noPodcast',
      defaultMessage: '目前還沒有建立廣播',
    },
    noActivity: {
      id: 'common.noActivity',
      defaultMessage: '目前還沒有建立活動',
    },
    noAppointment: {
      id: 'common.noAppointment',
      defaultMessage: '目前還沒有建立預約服務',
    },
    errorDescription: {
      id: 'common.loading.error.description',
      defaultMessage: '似乎出了點問題，請重新整理此頁面',
    },
    routeErrorDescription: {
      id: 'common.route.error',
      defaultMessage: '頁面無法正常運作或是網址已不存在',
    },
    repairingDescriptionWithPeriod: {
      id: 'common.text.repairingDescriptionWithPeriod',
      defaultMessage: '本系統於 {period}{br}進行例行性維護，暫時無法提供服務。{br}造成不便敬請見諒。',
    },
    repairingDescription: {
      id: 'common.text.repairingDescription',
      defaultMessage: '本系統正在進行例行性維護，暫時無法提供服務。{br}造成不便敬請見諒。',
    },
    noProgramPackage: {
      id: 'common.content.noProgramPackage',
      defaultMessage: '沒有參與任何課程組合',
    },
  }),
  unknown: defineMessages({
    default: { id: 'common.unknown', defaultMessage: '未知' },
    period: { id: 'common.unknown.period', defaultMessage: '未知週期' },
    character: { id: 'helper.role.character.unknown', defaultMessage: '未知角色' },
    type: { id: 'common.unknown.type', defaultMessage: '未知類別' },
    identity: { id: 'common.unknown.identity', defaultMessage: '未知身份' },
  }),
  role: defineMessages({
    owner: { id: 'common.role.owner', defaultMessage: '課程擁有者' },
    instructor: { id: 'common.role.instructor', defaultMessage: '講師' },
    assistant: { id: 'common.role.assistant', defaultMessage: '助教' },
    appOwner: { id: 'common.role.appOwner', defaultMessage: '管理員' },
    author: { id: 'common.role.author', defaultMessage: '作者' },
  }),
  unit: defineMessages({
    min: { id: 'common.unit.min', defaultMessage: '分' },
    content: { id: 'product.program.content.content', defaultMessage: '內容' },
    chapter: { id: 'product.program.content.chapter', defaultMessage: '章節' },
    piece: { id: 'common.unit.piece', defaultMessage: '張' },
    perDay: { id: 'common.periodType.day.per', defaultMessage: '每天' },
    perWeek: { id: 'common.periodType.week.per', defaultMessage: '每週' },
    perMonth: { id: 'common.periodType.month.per', defaultMessage: '每月' },
    perYear: { id: 'common.periodType.year.per', defaultMessage: '每年' },
    sec: { id: 'common.periodType.sec', defaultMessage: '秒' },
    hour: { id: 'common.periodType.hour', defaultMessage: '時' },
    day: { id: 'common.periodType.day', defaultMessage: '天' },
    week: { id: 'common.periodType.week', defaultMessage: '週' },
    month: { id: 'common.periodType.month', defaultMessage: '月' },
    monthWithQuantifier: { id: 'common.periodType.monthWithQuantifier', defaultMessage: '個月' },
    year: { id: 'common.periodType.year', defaultMessage: '年' },
    point: { id: 'common.point', defaultMessage: '點' },
    off: { id: 'checkout.coupon.off', defaultMessage: '折' },
    people: { id: 'common.amount.people', defaultMessage: '人' },
    item: { id: 'voucher.items', defaultMessage: '個項目' },
    currency: { id: 'common.unit.currency', defaultMessage: '元' },
    unknown: { id: 'common.unit.unknown', defaultMessage: '未知週期' },
  }),
  checkbox: {
    viewAllQuestion: { id: 'common.checkbox.allQuestions.view', defaultMessage: '查看所有人問題' },
  },
  editor: {
    defaults: defineMessages({ fontSize: { id: 'common.editor.fontSize', defaultMessage: '字級' } }),
    title: defineMessages({
      clearStyles: { id: 'common.editor.title.styles.clear', defaultMessage: '清除樣式' },
      code: { id: 'common.editor.title.code', defaultMessage: '程式碼' },
      link: { id: 'common.editor.title.link', defaultMessage: '連結' },
      hr: { id: 'common.editor.title.hr', defaultMessage: '水平線' },
      fullscreen: { id: 'common.editor.title.fullscreen', defaultMessage: '全螢幕' },
    }),
  },
  text: defineMessages({
    addToCartSuccessfully: {
      id: 'product.text.addToCartSuccessfully',
      defaultMessage: '成功加入購物車',
    },
    notFoundMemberEmail: { id: 'common.text.notFoundMemberEmail', defaultMessage: '找不到這個註冊信箱' },
    selfReferringIsNotAllowed: { id: 'common.text.selfReferringIsNotAllowed', defaultMessage: '不可填寫自己的信箱' },
    fillInEnrolledEmail: {
      id: 'common.text.fillInEnrolledEmail',
      defaultMessage: '請填寫對方在站上註冊的電子信箱',
    },
    selfDeliver: { id: 'common.text.selfDeliver', defaultMessage: '不能發送給自己' },
    delivered: { id: 'common.text.delivered', defaultMessage: '已發送的電子郵件' },
    noOrderLog: { id: 'common.text.noOrderLog', default: '尚無消費紀錄' },
  }),
}

export const voucherMessages = {
  title: defineMessages({
    addVoucher: { id: 'voucher.title.add', defaultMessage: '新增兌換券' },
    addVoucherPlan: { id: 'voucher.modal.title.add', defaultMessage: '建立兌換方案' },
  }),
  content: defineMessages({
    details: { id: 'voucher.content', defaultMessage: '詳情' },
    fromNow: { id: 'voucher.fromNow', defaultMessage: '即日起' },
    noUsePeriod: { id: 'voucher.noUsePeriod', defaultMessage: '無使用期限' },
    redeemable: { id: 'voucher.redeemable', defaultMessage: '可兌換' },
    amount: { id: 'voucher.amount', defaultMessage: '數量' },
    editProject: { id: 'voucher.modal.project.edit', defaultMessage: '編輯方案' },
  }),
  tab: defineMessages({
    exchange: { id: 'voucher.tab.exchange', defaultMessage: '兌換代碼' },
  }),
  form: {
    placeholder: defineMessages({
      voucherEnter: { id: 'voucher.enter', defaultMessage: '輸入兌換碼' },
      startedAt: { id: 'voucher.datePicker.placeholder.startedAt', defaultMessage: '開始日期' },
      endedAt: { id: 'voucher.datePicker.placeholder.endedAt', defaultMessage: '截止日期' },
      notNecessary: { id: 'common.form.placeholder.necessary.not', defaultMessage: '非必填' },
    }),
    label: defineMessages({
      title: { id: 'voucher.label.title', defaultMessage: '兌換方案名稱' },
      quantityLimit: { id: 'voucher.label.quantityLimit', defaultMessage: '兌換項目數量' },
      voucherCodes: { id: 'voucher.label.voucherCodes', defaultMessage: '兌換碼' },
      voucherItem: { id: 'voucher.label.voucher.item', defaultMessage: '兌換項目' },
      validity: { id: 'voucher.label.validity', defaultMessage: '有效期限' },
      description: { id: 'voucher.form.label.description', defaultMessage: '使用限制和描述' },
    }),
  },
  messages: {
    addVoucher: { id: 'common.message.success.addVoucher', defaultMessage: '成功加入兌換券' },
    addVoucherError: { id: 'common.message.error.voucher.add.unable', defaultMessage: '無法加入兌換券' },
    exchangeVoucher: { id: 'common.message.success.exchangeVoucher', defaultMessage: '兌換成功，請到「我的主頁」查看' },
    useVoucherError: { id: 'common.message.error.voucher.use.unable', defaultMessage: '無法使用兌換券' },
    addVoucherPlan: { id: 'common.message.success', defaultMessage: '已建立兌換方案' },
    addVoucherPlanError: { id: 'common.message.error.voucher.add.fail', defaultMessage: '建立兌換方案失敗' },
    updateVoucherPlan: { id: 'common.message.success', defaultMessage: '已更新兌換方案' },
    updateVoucherPlanFail: { id: 'common.message.success', defaultMessage: '已更新兌換方案' },
    enterVoucherTitle: { id: 'voucher.label.title', defaultMessage: '請輸入兌換方案名稱' },
    quantityLimit: { id: 'voucher.message.quantityLimit', defaultMessage: '數量至少為 1' },
    voucherCode: { id: 'voucher.message.voucherCodes', defaultMessage: '至少一組兌換碼' },
    duplicateVoucherCode: { id: 'common.message.error.voucher.duplicate', defaultMessage: '該兌換碼已被使用' },
  },
}

export const checkoutMessages = {
  title: defineMessages({
    cart: { id: 'checkout.title.cart', defaultMessage: '購物清單' },
    purchaseItem: { id: 'checkout.modal.title.purchaseItem', defaultMessage: '購買項目' },
    discountCode: { id: 'checkout.coupon.title.discountCode', defaultMessage: '折扣代碼' },
    editCoupon: { id: 'checkout.coupon.title.coupon.edit', defaultMessage: '編輯折價方案' },
    chooseMemberCard: { id: 'checkout.modal.title.memberCard.choose', defaultMessage: '選擇會員卡' },
    chooseCoupon: { id: 'checkout.modal.title', defaultMessage: '選擇折價券' },
    chooseCart: { id: 'checkout.title.chooseCart', defaultMessage: '選擇結帳購物車' },
  }),
  button: defineMessages({
    cartSubmit: { id: 'checkout.cart.submit', defaultMessage: '前往結帳' },
  }),
  ui: defineMessages({
    gift: { id: 'checkout.ui.gift', defaultMessage: '贈品' },
  }),
  label: defineMessages({
    groupBuying: { id: 'checkout.label.groupBuying', defaultMessage: '多人同行揪團' },
    groupBuyingPlan: {
      id: 'checkout.label.groupBuyingTitle',
      defaultMessage: '你購買「{title}」多人同行 方案：',
    },
    partnerEmail: {
      id: 'checkout.label.partnerEmail',
      defaultMessage: '同行者信箱',
    },
    groupBuyingRuleTitle: {
      id: 'checkout.label.groupBuyingRuleTitle',
      defaultMessage: '多人同行揪團規定與退費說明',
    },
  }),
  message: defineMessages({
    creditCardError: { id: 'checkout.message.error.creditCard', defaultMessage: '信用卡資料錯誤' },
    discountError: { id: 'checkout.message.error.discount', defaultMessage: '無法更新折扣方案' },
    couponExistError: {
      id: 'checkout.message.error.couponExist',
      defaultMessage: '無法創建折扣方案，可能原因為此折扣碼已存在',
    },
    leastOneSet: { id: 'checkout.coupon.form.message.leastOneSet', defaultMessage: '至少一組折扣碼' },
    unableAddCoupon: { id: 'checkout.coupon.message.unable', defaultMessage: '無法加入折價券' },
    noCoupon: { id: 'checkout.coupon.message.noCoupon', defaultMessage: '請選擇折價券' },
    notEnoughCoins: { id: 'checkout.message.notEnoughCoins', defaultMessage: '代幣不足' },
    checkingCoins: { id: 'checkout.message.checkingCoins', defaultMessage: '確認代幣中' },
  }),
  help: defineMessages({
    notation: { id: 'checkout.coupon.form.help', defaultMessage: '折抵方式為比例時，額度範圍為 0 - 100' },
  }),
  text: defineMessages({
    groupBuyingDescription1: {
      id: 'checkout.text.groupBuyingDescription1',
      defaultMessage:
        '可於底下填寫同行者信箱帳號，將於完成付款後隨即開通，主揪者與同行者皆可在「我的主頁」內找到購買項目。',
    },
    groupBuyingDescription2: {
      id: 'checkout.text.groupBuyingDescription2',
      defaultMessage: '若本次未填寫同行者信箱，則會保留在後台的「我的揪團」，可以之後再指定開通給其他會員。',
    },
    groupBuyingDescription3: {
      id: 'checkout.text.groupBuyingDescription3',
      defaultMessage: '注意事項：購買即同意以下多人同行揪團{modal}辦法。',
    },

    groupBuyingRuleLink: {
      id: 'checkout.text.groupBuyingRuleLink',
      defaultMessage: '規定與退費',
    },
    groupBuyingRule1: {
      id: 'checkout.text.groupBuyingRule1',
      defaultMessage: ' 選擇多人同行方案，僅會開立一張發票，無法另外提供多張發票。',
    },
    groupBuyingRule2: {
      id: 'checkout.text.groupBuyingRule2',
      defaultMessage: '多人同行方案不得與其他優惠合併使用。',
    },
    groupBuyingRule3: {
      id: 'checkout.text.groupBuyingRule3',
      defaultMessage: '多人同行方案於購買後 7 天內，只要所有人尚未使用，即可申請全額退費。',
    },
    groupBuyingRule4: {
      id: 'checkout.text.groupBuyingRule4',
      defaultMessage: '退費時由多人同行方案的購買人向平台方提出申請，平台方也將統一退費給當初的購買人，將不分別退費。',
    },
    groupBuyingRule5: {
      id: 'checkout.text.groupBuyingRule5',
      defaultMessage: '會員之間的項目轉讓，均屬會員的私人行為，平台方均不干涉。',
    },
    fillInPartnerEmail: {
      id: 'checkout.text.fillInPartnerEmail',
      defaultMessage: '請填寫同行者在站上註冊的電子信箱',
    },
    existingPartner: {
      id: 'checkout.text.existingPartner',
      defaultMessage: '重複的同行者',
    },
  }),
  content: defineMessages({
    cartNothing: { id: 'checkout.cart.nothing', defaultMessage: `購物車沒有東西` },
    firstTime: { id: 'checkout.paragraph.firstTime', defaultMessage: '首期' },
    secondStart: { id: 'checkout.paragraph.secondStart', defaultMessage: '第二期開始' },
    discountDirectly: { id: 'checkout.discount.directly', defaultMessage: '直接折抵' },
    unableAddCoupon: { id: 'checkout.coupon.message.unable', defaultMessage: '無法加入折價券' },
    amount: { id: 'checkout.amount', defaultMessage: '數量' },
    useMemberCard: { id: 'checkout.form.radio.memberCard.use', defaultMessage: '使用會員卡' },
    warningText: {
      id: 'checkout.podcast.content.warning.text',
      defaultMessage: '若訂閱金額為 NT$0 時，系統皆會酌收 NT$1 的驗證手續費',
    },
    fullDiscount: { id: 'checkout.coupon.full', defaultMessage: '消費滿 {amount} 折抵' },
    couponAmount: { id: 'checkout.coupon.amount', defaultMessage: '金額 {amount} 元' },
    couponCode: { id: 'checkout.coupon.codes', defaultMessage: '折扣代碼' },
    total: { id: 'checkout.content.total', defaultMessage: '共' },
    gift: {
      id: 'checkout.content.gift',
      defaultMessage: '【贈品】',
    },
  }),
  link: defineMessages({
    cartExplore: { id: 'checkout.cart.explore', defaultMessage: `來去逛逛` },
  }),
  form: {
    label: defineMessages({
      cardNo: { id: 'checkout.form.label.cardNo', defaultMessage: '卡號' },
      cardExp: { id: 'checkout.form.label.cardExp', defaultMessage: '有效期' },
      addCoupon: { id: 'checkout.form.label.coupon.add', defaultMessage: '新增折價券' },
      couponCode: { id: 'checkout.coupon.form.label.codes', defaultMessage: '折扣碼' },
      discount: { id: 'checkout.coupon.form.label.discount', defaultMessage: '折抵額度' },
      constraint: { id: 'checkout.coupon.form.label.constraint', defaultMessage: '消費需達' },
      validityPeriod: { id: 'checkout.coupon.form.label.validityPeriod', defaultMessage: '有效期限' },
      description: { id: 'checkout.coupon.form.label.description', defaultMessage: '使用限制與描述' },
      notRequired: { id: 'checkout.coupon.form.placeholder.notRequired', defaultMessage: '非必要' },
      all: { id: 'checkout.coupon.label.all', defaultMessage: '不限' },
      phone: { id: 'checkout.form.label.phone', defaultMessage: '手機' },
      receiverName: { id: 'checkout.form.label.receiverName', defaultMessage: '收件人姓名' },
      receiverAddress: { id: 'checkout.form.label.receiverAddress', defaultMessage: '收件人地址' },
      receiverPhone: { id: 'checkout.form.label.receiverPhone', defaultMessage: '收件人電話' },
      invoiceType: { id: 'checkout.form.label.invoiceType', defaultMessage: '發票類型' },
      uniformNumberInvoice: { id: 'checkout.form.label.uniformNumberInvoice', defaultMessage: '公司' },
    }),
    message: defineMessages({
      couponTitle: { id: 'checkout.coupon.form.message.title', defaultMessage: '請輸入折價方案名稱' },
      email: { id: 'checkout.form.message.email', defaultMessage: '聯絡信箱' },
      phone: { id: 'checkout.form.message.phone', defaultMessage: '手機' },
      nameText: { id: 'checkout.form.message.name', defaultMessage: '真實姓名' },
      addressText: { id: 'checkout.form.message.addressText', defaultMessage: '請輸入地址' },
      postCodeText: { id: 'checkout.form.message.postCodeText', defaultMessage: '請輸入郵遞區號' },
      receiverAddressText: { id: 'checkout.form.message.receiverAddressText', defaultMessage: '請輸入巷弄號樓' },
      receiverPhoneText: { id: 'checkout.form.message.receiverPhoneText', defaultMessage: '請輸入電話號碼' },
    }),
    placeholder: defineMessages({
      discount: { id: 'checkout.coupon.form.placeholder.discount', defaultMessage: '額度' },
      startDate: { id: 'checkout.coupon.form.placeholder.startDate', defaultMessage: '開始日期' },
      endDate: { id: 'checkout.coupon.form.placeholder.endDate', defaultMessage: '截止日期' },
      amount: { id: 'checkout.form.placeholder.amount', defaultMessage: '發行數量' },
      custom: { id: 'checkout.form.input.placeholder.custom', defaultMessage: '自訂' },
      enter: { id: 'checkout.coupon.form.placeholder.enter', defaultMessage: '輸入折扣碼' },
    }),
    radio: defineMessages({
      noDiscount: { id: 'checkout.form.radio.coupon.noDiscount', defaultMessage: '無折扣' },
      useCoupon: { id: 'checkout.form.radio.coupon.use', defaultMessage: '使用折價券' },
    }),
    option: defineMessages({
      amount: { id: 'checkout.coupon.select.option.amount', defaultMessage: '折扣金額' },
      discount: { id: 'checkout.coupon.select.option.discount', defaultMessage: '折扣比例' },
      random: { id: 'checkout.select.option.random', defaultMessage: '隨機' },
      custom: { id: 'checkout.select.option.custom', defaultMessage: '自訂' },
    }),
  },
  coupon: defineMessages({
    fromNow: { id: 'checkout.coupon.fromNow', defaultMessage: '即日起' },
    noPeriod: { id: 'common.period.no', defaultMessage: '無使用期限' },
    full: { id: 'checkout.coupon.full', defaultMessage: '消費滿 {amount} 折抵' },
    amount: { id: 'checkout.coupon.amount', defaultMessage: '金額 {amount} 元' },
    proportion: { id: 'checkout.coupon.proportion', defaultMessage: '比例 {amount}%' },
  }),
  point: {
    statistic: defineMessages({
      title: { id: 'checkout.point.statistic.title', defaultMessage: '目前擁有' },
      suffix: { id: 'checkout.point.statistic.suffix', defaultMessage: 'Point' },
    }),
  },
  shipping: defineMessages({
    shippingInput: { id: 'checkout.label.shippingInput', defaultMessage: '寄送資訊' },
    shippingMethod: { id: 'checkout.label.shippingMethod', defaultMessage: '寄送方式' },
    specification: { id: 'checkout.label.specification', defaultMessage: '商品規格與備註' },
    selectStore: { id: 'checkout.label.selectStore', defaultMessage: '選擇門市' },
    sevenEleven: { id: 'checkout.label.sevenEleven', defaultMessage: '7-11超商取貨' },
    familyMart: { id: 'checkout.label.familyMart', defaultMessage: '全家超商取貨' },
    hiLife: { id: 'checkout.label.hiLife', defaultMessage: '萊爾富超商取貨' },
    okMart: { id: 'checkout.label.okMart', defaultMessage: 'OK超商取貨' },
    sendByPost: { id: 'checkout.label.sendByPost', defaultMessage: '郵寄' },
    homeDelivery: { id: 'checkout.label.homeDelivery', defaultMessage: '宅配' },
    other: { id: 'checkout.label.other', defaultMessage: '其他' },
    outsideTaiwanIslandNoShipping: {
      id: 'checkout.label.outsideTaiwanIslandNoShipping',
      defaultMessage: '台灣離島/海外不寄送',
    },
    giftPlanDeliverNotice1: {
      id: 'checkout.label.giftPlanDeliverNotice1',
      defaultMessage: '(1) 請確實填寫收件地址與聯絡電話，以利贈品順利送達。',
    },
    giftPlanDeliverNotice2: {
      id: 'checkout.label.giftPlanDeliverNotice2',
      defaultMessage: '(2) 贈品若因資訊填寫錯誤而無法順利送達，將不再補發寄送。',
    },
    giftPlanDeliverNotice3: {
      id: 'checkout.label.giftPlanDeliverNotice3',
      defaultMessage: '(3) 台灣離島/海外恕不寄送，請勾選下方選項。',
    },
  }),
  event: defineMessages({
    inventoryShortage: { id: 'checkout.event.inventoryShortage', defaultMessage: '庫存不足請調整數量' },
    removeSoldOutProduct: { id: 'checkout.event.removeSoldOutProduct', defaultMessage: '請移除已售完項目' },
  }),
}

export const programMessages = {
  label: defineMessages({
    practiceUpload: { id: 'program.ui.practiceUpload', defaultMessage: '作業上傳' },
    discussion: { id: 'program.ui.discussion', defaultMessage: '問題討論' },
  }),
  text: defineMessages({
    uploadPractice: { id: 'program.text.uploadPractice', defaultMessage: '快上傳成果吧！' },
    groupBuying: { id: 'program.text.groupBuying', defaultMessage: '{count} 人同行' },
  }),
  tab: defineMessages({
    downloadMaterials: {
      id: 'program.tab.downloadMaterials',
      defaultMessage: '下載教材',
    },
  }),
}

export const activityMessages = {
  label: defineMessages({
    online: { id: 'activity.label.online', defaultMessage: '線上' },
    offline: { id: 'activity.label.offline', defaultMessage: '實體' },
    both: { id: 'activity.label.both', defaultMessage: '實體 & 線上' },
  }),
  text: defineMessages({
    live: { id: 'activity.ui.live', defaultMessage: '線上直播' },
    liveLink: { id: 'activity.text.liveLink', defaultMessage: '直播連結' },
  }),
}

export const practiceMessages = {
  button: defineMessages({
    delete: { id: 'practice.button.delete', defaultMessage: '刪除作業' },
  }),
}

export const productMessages = {
  activity: {
    tab: defineMessages({
      now: { id: 'product.activity.tab.now', defaultMessage: '正在舉辦' },
      finished: { id: 'product.activity.tab.finished', defaultMessage: '已結束' },
      unpublished: { id: 'product.activity.tab.unpublished', defaultMessage: '未上架' },
    }),
    title: defineMessages({
      default: { id: 'product.activity.title', defaultMessage: '活動' },
      sessions: { id: 'product.activity.title.sessions', defaultMessage: '包含場次' },
      remark: { id: 'product.activity.title.remark', defaultMessage: '備註說明' },
      release: { id: 'product.activity.title.release', defaultMessage: '售票時間' },
      event: { id: 'product.activity.title.event', defaultMessage: '場次資訊' },
      organizer: { id: 'product.activity.title.organizer', defaultMessage: '主辦簡介' },
    }),
    content: defineMessages({
      least: { id: 'product.activity.session.least', defaultMessage: '最少' },
      warningText: {
        id: 'product.activity.warningText',
        defaultMessage: '請留下你的真實聯絡資訊，以利入場身份核對與確保獲得場次的最新消息。',
      },
      email: { id: 'common.meta.email', defaultMessage: '信箱：' },
      phone: { id: 'common.meta.phone', defaultMessage: '手機：' },
      orderNo: { id: 'common.meta.orderNo', defaultMessage: '票券編號：' },
      remaining: { id: 'product.activity.content.remaining', defaultMessage: '剩餘' },
    }),
  },
  appointment: {
    status: defineMessages({
      booked: { id: 'product.appointment.status.booked', defaultMessage: '已預約' },
      closed: { id: 'product.appointment.status.closed', defaultMessage: '已關閉' },
      bookable: { id: 'product.appointment.status.bookable', defaultMessage: '可預約' },
    }),
    warningText: defineMessages({
      news: {
        id: 'product.appointment.warning.text',
        defaultMessage: '請留下你的真實聯絡資料，以確保獲得預約時段的最新消息',
      },
    }),
    content: defineMessages({
      timezone: { id: 'product.appointment.content.timezone', defaultMessage: '時間以 {city} (GMT{timezone}) 顯示' },
    }),
  },
  program: {
    defaults: defineMessages({
      warningText: {
        id: 'checkout.program.content.warning.text',
        defaultMessage: '訂閱金額為 NT$0 時，系統需紀錄您的信用卡卡號，並於下期進行扣款',
      },
    }),
    checkbox: defineMessages({
      trial: { id: 'product.program.checkbox.trial', defaultMessage: '試看' },
      display: { id: 'product.program.checkbox.display', defaultMessage: '顯示' },
      discountDown: { id: 'product.program.form.checkbox.discountDown', defaultMessage: '首期折扣' },
    }),
    form: {
      label: defineMessages({
        duration: { id: 'product.program.form.label.duration', defaultMessage: '內容時長（分鐘）' },
        description: { id: 'product.program.form.label.description', defaultMessage: '內文' },
        programName: { id: 'product.program.form.label.programName', defaultMessage: '課程名稱' },
        category: { id: 'product.program.form.label.category', defaultMessage: '類別' },
        subscription: { id: 'product.program.form.label.subscription', defaultMessage: '選擇課程付費方案' },
        coverImage: { id: 'product.program.form.label.cover.image', defaultMessage: '課程封面' },
        coverVideo: { id: 'product.program.form.label.cover.video', defaultMessage: '介紹影片' },
        abstract: { id: 'product.program.form.label.abstract', defaultMessage: '課程摘要' },
        programDescription: { id: 'product.program.form.label.description.program', defaultMessage: '課程描述' },
        listPrice: { id: 'product.program.form.label.price.list', defaultMessage: '定價' },
        salePrice: { id: 'product.program.form.label.price.sale', defaultMessage: '優惠價' },
        programPlan: { id: 'product.program.form.label.title.programPlan', defaultMessage: '方案名稱' },
        periodType: { id: 'product.program.form.label.periodType', defaultMessage: '訂閱週期' },
        projectDescription: { id: 'product.program.form.label.project.description', defaultMessage: '方案描述' },
      }),
      placeholder: defineMessages({
        coverVideo: { id: 'product.program.form.placeholder.cover.video', defaultMessage: '貼上影片網址' },
        expiredDate: { id: 'product.program.form.placeholder.expired.date', defaultMessage: '優惠截止日期' },
      }),
      radio: defineMessages({
        once: { id: 'product.program.form.radio.label.once', defaultMessage: '單次付費' },
        subscription: { id: 'product.program.form.radio.label.subscription', defaultMessage: '訂閱付費' },
        enablePastContent: { id: 'product.program.form.radio.pastContent.enable', defaultMessage: '可看過去內容' },
        disablePastContent: { id: 'product.program.form.radio.pastContent.disable', defaultMessage: '不可看過去內容' },
      }),
    },
    message: defineMessages({
      confirm: { id: 'product.program.message.confirm', defaultMessage: '你確定要刪除此內容？此動作無法還原' },
      chooseDate: { id: 'product.program.form.message.date.choose', defaultMessage: '請選擇日期' },
      programPlan: { id: 'product.program.form.message.programPlan', defaultMessage: '請輸入方案名稱' },
      type: { id: 'product.program.form.label.type', defaultMessage: '選擇內容觀看權限' },
      confirm2: {
        id: 'product.program.message.confirm.block',
        defaultMessage: '此區塊內的所有內容將被刪除，此動作無法還原',
      },
      noNotification: { id: 'product.program.message.notification.no', defaultMessage: '目前沒有任何通知' },
      missSummary: { id: 'product.program.message.summary.missing', defaultMessage: '尚未填寫課程摘要' },
      missDescription: { id: 'product.program.message.description.missing', defaultMessage: `尚未填寫課程描述` },
      noContent: { id: 'product.program.message.content.no', defaultMessage: '尚未新增任何內容' },
      noPrice: { id: 'product.program.message.price.no', defaultMessage: '尚未訂定售價' },
    }),
    title: defineMessages({
      courseSetting: { id: 'product.program.title.course.settings', defaultMessage: '課程設定' },
      courseIntro: { id: 'product.program.title.adminCard', defaultMessage: '課程介紹' },
      instructorIntro: { id: 'product.program.instructor.intro', defaultMessage: '講師簡介' },
      authorIntro: { id: 'product.program.title.author.intro', defaultMessage: '作者簡介' },
      instructor: { id: 'product.program.title.instructor', defaultMessage: '講師' },
      assistant: { id: 'product.program.title.assistant', defaultMessage: '助教' },
      changePassword: { id: 'settings.profile.title.password.change', defaultMessage: '修改密碼' },
      organizer: { id: 'product.program.title.organizer', defaultMessage: '主辦單位簡介' },
      explore: { id: 'product.program.title.explore', defaultMessage: '探索' },
      sale: { id: 'product.program.title.project.sale', defaultMessage: '銷售方案' },
      establishProgram: { id: 'common.establish.program', defaultMessage: '建立課程' },
      identity: { id: 'product.program.title.identity', defaultMessage: '身份管理' },
      owner: { id: 'product.program.title.owner', defaultMessage: '課程負責人' },
      release: { id: 'product.program.title.release', defaultMessage: '發佈設定' },
      published: { id: 'product.program.title.course.published', defaultMessage: '已發佈課程' },
      unpublished: { id: 'product.program.title.course.unpublished', defaultMessage: '尚未發佈課程' },
      invalidate: {
        id: 'product.program.title.course.invalidate',
        defaultMessage: '尚有未完成項目',
      },
      trial: { id: 'product.program.title.trial', defaultMessage: '試看課程' },
      content: { id: 'product.program.title.content', defaultMessage: '課程內容' },
      unnamedBlock: { id: 'product.program.section.block', defaultMessage: '未命名區塊' },
      programContent: { id: 'product.program.title.content', defaultMessage: '課程內容' },
      basicSettings: { id: 'product.program.title.basicSettings', defaultMessage: '基本設定' },
      course: { id: 'product.program.title.course', defaultMessage: '課程' },
    }),
    content: defineMessages({
      subscribe: { id: 'product.program.content.subscribe', defaultMessage: '訂閱' },
      onlineCourse: { id: 'product.program.content.course.online', defaultMessage: '線上課程' },
      expired: { id: 'product.program.form.message.content.expired', defaultMessage: '已過期' },
      discountDownFree: { id: 'product.program.price.free.discountDown', defaultMessage: '首期免費 $ 0' },
      free: { id: 'product.program.price.free', defaultMessage: '免費 $ 0' },
      currentPrice: { id: 'product.program.price.current', defaultMessage: '第二期開始' },
      notation: {
        id: 'product.program.content.notation',
        defaultMessage: '購買到優惠價的會員，往後每期皆以優惠價收款',
      },
      warning: {
        id: 'product.program.warning',
        defaultMessage: '請仔細確認是否真的要刪除課程，因為一旦刪除就無法恢復',
      },
      danger: {
        id: 'product.program.warning.danger',
        defaultMessage: '注意：只有在無人購買的情況下才能刪除課程。',
      },
      blockDelete: { id: 'product.program.dropdown.menu.item', defaultMessage: '刪除區塊' },
      provide: { id: 'product.program.content.provide', defaultMessage: '僅提供' },
      watch: { id: 'product.program.content.watch', defaultMessage: '觀看' },
      unPurchased: { id: 'product.program.content.unPurchased', defaultMessage: '購買方案解鎖內容' },
      description: { id: 'product.program.description', defaultMessage: '方案：' },
      trial: { id: 'product.program.tag.trial', defaultMessage: '試看' },
      total: {
        id: 'product.program.content.notation.total',
        defaultMessage: '定價或優惠價 - 首期折扣 = 首期支付金額',
      },
      example: {
        id: 'product.program.content.notation.example',
        defaultMessage: 'EX：100 - 20 = 80，此欄填入 20',
      },
      originPrice: { id: 'product.program.price.origin', defaultMessage: '原價' },
      programProblem: { id: 'common.courseProblem', defaultMessage: '課程問題' },
      noProgram: { id: 'product.program.title.course.no', defaultMessage: '沒有參與任何課程' },
    }),
    paragraph: defineMessages({
      firstTime: { id: 'product.program.paragraph.firstTime', defaultMessage: '首期優惠' },
      published: {
        id: 'product.program.paragraph.published',
        defaultMessage: '現在你的課程已經發佈，此課程並會出現在頁面上，學生將能購買此課程。',
      },
      unpublished: {
        id: 'product.program.paragraph.unpublished',
        defaultMessage: '因你的課程未發佈，此課程並不會顯示在頁面上，學生也不能購買此課程。',
      },
      invalidate: {
        id: 'product.program.paragraph.invalidate',
        defaultMessage: '請填寫以下必填資料，填寫完畢即可由此發佈',
      },
    }),
    status: defineMessages({
      subscribed: {
        id: 'product.program.content.subscribed',
        defaultMessage: '已訂閱',
      },
      sold: { id: 'product.program.content.sold', defaultMessage: '已售' },
    }),
    modal: {
      title: defineMessages({
        confirm: { id: 'product.program.modal.title.confirm', defaultMessage: '你確定要取消發佈？' },
        subscription: { id: 'product.program.modal.title.subscription', defaultMessage: '訂閱付費方案' },
      }),
      content: defineMessages({
        confirm: {
          id: 'product.program.modal.content.confirm',
          defaultMessage: '課程將下架且不會出現在課程列表，已購買的學生仍然可以看到課程內容。',
        },
      }),
    },
  },
  project: {
    title: defineMessages({
      intro: { id: 'product.project.title.introduction', defaultMessage: '方案介紹' },
    }),
    paragraph: defineMessages({
      intro: {
        id: 'product.podcast.paragraph',
        defaultMessage: '立即成為VIP，開啟你的全方位設計核心能力，學習設計不用花大錢！',
      },
      noPerson: { id: 'product.project.person.no', defaultMessage: '-- 人' },
      zeroPerson: { id: 'product.project.person.zero', defaultMessage: '0 人' },
      numberOfParticipants: { id: 'product.project.funding.numberOfParticipants', defaultMessage: '參與人數' },
      goal: { id: 'product.project.funding.goal', defaultMessage: '目標' },
    }),
    tab: defineMessages({
      intro: { id: 'product.project.funding.tab.intro', defaultMessage: '計劃內容' },
      contents: { id: 'product.project.funding.tab.contents', defaultMessage: '課程章節' },
      updateProject: { id: 'product.project.funding.tab.update', defaultMessage: '計畫更新' },
      recommend: { id: 'product.project.funding.tab.recommend', defaultMessage: '學員推薦' },
      project: { id: 'product.project', defaultMessage: '方案項目' },
    }),
  },
  podcast: {
    defaults: defineMessages({
      warningText: {
        id: 'checkout.podcast.content.warning.text',
        defaultMessage: '若訂閱金額為 NT$0 時，系統皆會酌收 NT$1 的驗證手續費',
      },
    }),
    title: defineMessages({
      hottest: { id: 'product.podcast.title.hottest', defaultMessage: '熱門訂閱頻道' },
      podcast: { id: 'product.podcast.title', defaultMessage: '廣播' },
      subscribe: { id: 'common.subscribe.podcast', defaultMessage: '訂閱頻道' },
      broadcast: { id: 'product.podcast.broadcast', defaultMessage: '音頻廣播' },
      playlist: { id: 'podcast.label.playlist', defaultMessage: '清單列表' },
      allPodcast: { id: 'podcast.label.allPodcast', defaultMessage: '全部廣播' },
      playlistPlaceholder: { id: 'podcast.text.playlistPlaceholder', defaultMessage: '字數限12字元' },
    }),
    content: defineMessages({
      unsubscribed: { id: 'product.podcast.content', defaultMessage: '尚未訂閱任何頻道' },
    }),
  },
  programPackage: {
    label: defineMessages({
      availableForLimitTime: {
        id: 'programPackage.label.availableForLimitTime',
        defaultMessage: '可觀看 {amount} {unit}',
      },
    }),
  },
  programPackagePlan: {
    content: defineMessages({
      banner: {
        id: 'product.programPackagePlan.banner',
        defaultMessage: '<span>課程<br />組合</span>',
      },
    }),
  },
  merchandise: {
    title: defineMessages({
      mall: {
        id: 'product.merchandise.mall',
        defaultMessage: '線上商城',
      },
    }),
    content: defineMessages({
      noMerchandiseOrder: {
        id: 'product.merchandise.noMerchandiseOrder',
        defaultMessage: '沒有任何商品紀錄',
      },
    }),
  },
}

export const profileMessages = {
  title: defineMessages({
    basicInfo: { id: 'settings.profile.form.label.title', defaultMessage: '基本資料' },
  }),
  form: {
    label: defineMessages({
      avatar: { id: 'settings.profile.form.label.avatar', defaultMessage: '頭像' },
      name: { id: 'settings.profile.form.label.name', defaultMessage: '名稱' },
      planIds: { id: 'product.program.form.label.planIds', defaultMessage: '適用方案' },
      video: { id: 'product.program.form.label.video', defaultMessage: '影片' },
      subtitle: { id: 'product.program.form.label.subtitle', defaultMessage: '字幕' },
      socialConnect: { id: 'profile.label.socialConnect', defaultMessage: '社群綁定' },
    }),
    message: defineMessages({
      enterName: {
        id: 'common.form.message.name',
        defaultMessage: '請輸入名稱',
      },
      title: { id: 'common.title', defaultMessage: '稱謂' },
      abstract: { id: 'common.abstract', defaultMessage: '摘要（100 字內）' },
      intro: { id: 'common.introduction', defaultMessage: '描述' },
      currentPassword: {
        id: 'settings.profile.form.message.currentPassword',
        defaultMessage: '請輸入目前密碼',
      },
      socialConnected: { id: 'profile.message.socialConnected', defaultMessage: '已綁定 {site} 帳號' },
      socialUnconnected: { id: 'profile.message.socialUnconnected', defaultMessage: '尚未綁定 {site} 帳號' },
      noYouTubeChannel: { id: 'profile.message.noYouTubeChannel', defaultMessage: '無 YouTube 頻道' },
    }),
    placeholder: defineMessages({
      title: {
        id: 'product.program.form.placeholder.title',
        defaultMessage: '標題名稱',
      },
      planIds: {
        id: 'product.program.form.placeholder.planIds',
        defaultMessage: '選擇方案',
      },
    }),
    uploadText: defineMessages({
      video: {
        id: 'product.program.form.uploadText.video',
        defaultMessage: '上傳影片',
      },
      subtitle: {
        id: 'product.program.form.uploadText.subtitle',
        defaultMessage: '上傳字幕',
      },
    }),
  },
  dropdown: defineMessages({
    delete: { id: 'product.program.dropdown.item.delete', defaultMessage: '刪除內容' },
  }),
}

export const settingsMessages = {
  title: defineMessages({
    profile: { id: 'settings.profile.title', defaultMessage: '帳號資料' },
  }),
  profile: {
    form: {
      label: defineMessages({
        currentPassword: { id: 'settings.profile.form.label.currentPassword', defaultMessage: '目前密碼' },
        newPassword: { id: 'settings.profile.form.label.newPassword', defaultMessage: '新密碼' },
        confirmation: { id: 'settings.profile.form.label.confirmation', defaultMessage: '確認密碼' },
      }),
      message: defineMessages({
        newPassword: {
          id: 'settings.profile.form.message.newPassword',
          defaultMessage: '請輸入新密碼',
        },
        confirmation: {
          id: 'settings.profile.form.message.confirmation',
          defaultMessage: '請確認新密碼',
        },
      }),
      validator: defineMessages({
        password: {
          id: 'common.form.validator',
          defaultMessage: '確認密碼與新密碼相同',
        },
      }),
    },
  },
}

export const issueMessages = {
  title: defineMessages({
    program: { id: 'common.program.noTitle', defaultMessage: '無課程標題' },
  }),
  message: defineMessages({
    enterReplyContent: { id: 'issue.reply.form.message.content', defaultMessage: '請輸入回覆內容' },
  }),
  messageError: defineMessages({
    question: { id: 'issue.question.message.error', defaultMessage: 'Cannot change question' },
    update: { id: 'common.message.error.update.no', defaultMessage: '無法更新回覆' },
  }),
  form: {
    title: defineMessages({
      fillQuestion: { id: 'issue.form.title', defaultMessage: '填寫問題' },
    }),
    label: defineMessages({
      question: { id: 'issue.form.label.question', defaultMessage: '問題內容' },
    }),
    placeholder: defineMessages({
      reply: { id: 'issue.reply.form.placeholder', defaultMessage: '回覆...' },
    }),
    message: defineMessages({
      title: { id: 'issue.form.message.title', defaultMessage: '請輸入問題內容' },
    }),
    validator: defineMessages({
      enterQuestion: { id: 'issue.form.validator', defaultMessage: '請輸入問題內容' },
    }),
  },
  dropdown: {
    content: defineMessages({
      editQuestion: { id: 'issue.question.dropdown.edit', defaultMessage: 'Edit Question' },
      confirmMessage: {
        id: 'issue.question.message.confirm',
        defaultMessage: '此問題的留言將被一併刪除',
      },
      delete: { id: 'issue.question.dropdown.delete', defaultMessage: 'Delete Question' },
      unsolved: { id: 'issue.question.dropdown.unsolved', defaultMessage: '未解決' },
      solved: { id: 'issue.question.dropdown.solved', defaultMessage: '已解決' },
      edit: { id: 'issue.reply.dropdown.edit', defaultMessage: '編輯回覆' },
      unrecoverable: { id: 'issue.reply.message.confirm', defaultMessage: '此動作無法復原' },
      deleteReply: { id: 'issue.reply.dropdown.delete', defaultMessage: '刪除回覆' },
    }),
  },
  modal: {
    text: defineMessages({
      ok: { id: 'issue.modal.text.ok', defaultMessage: '送出問題' },
    }),
  },
  content: defineMessages({ markAs: { id: 'common.markAs', defaultMessage: '標示為' } }),
  status: defineMessages({
    loadingReply: {
      id: 'common.loadingReply',
      defaultMessage: '載入回覆中',
    },
    loadingReplyError: {
      id: 'common.loading.error.reply',
      defaultMessage: '無法載入回覆',
    },
  }),
}

export const helperMessages = {
  messages: defineMessages({
    imageFormatError: { id: 'common.message.error.image.format', defaultMessage: '請上傳圖片格式' },
    imageSizeError: { id: 'common.message.error.image.size', defaultMessage: '圖片大小請小於' },
  }),
  role: defineMessages({
    anonymous: { id: 'helper.role.anonymous', defaultMessage: '正在使用 匿名使用者 身份瀏覽' },
    generalMember: { id: 'helper.role.generalMember', defaultMessage: '正在使用 一般會員 身份瀏覽' },
    contentCreator: { id: 'helper.role.contentCreator', defaultMessage: '正在使用 創作者 身份瀏覽' },
    appOwner: { id: 'helper.role.appOwner', defaultMessage: '正在使用 管理員 身份瀏覽' },
  }),
}

export const termMessages = {
  defaults: defineMessages({
    term: { id: 'term', defaultMessage: '使用條款' },
  }),
  title: defineMessages({
    term: { id: 'term.title', defaultMessage: '隱私權條款' },
    terms: { id: 'term.title.terms', defaultMessage: '使用者條款' },
    report: { id: 'term.title.report', defaultMessage: '舉報' },
    refund: { id: 'term.title.refund', defaultMessage: '退費辦法' },
  }),
  subtitle: defineMessages({
    scope: { id: 'term.subtitle.scope', defaultMessage: '隱私權保護政策的適用範圍' },
    personalData: { id: 'term.subtitle.personalData', defaultMessage: '個人資料的蒐集、處理及利用方式' },
    link: { id: 'term.subtitle.link', defaultMessage: '網站對外的相關連結' },
    policy: { id: 'term.subtitle.policy', defaultMessage: '與第三人共用個人資料之政策' },
    personalInfo: { id: 'term.subtitle.personalInfo', defaultMessage: '更新/刪除您的個人資訊' },
    cookie: { id: 'term.subtitle.cookie', defaultMessage: 'COOKIE之使用' },
    terms: { id: 'term.subtitle.terms', defaultMessage: '同意條款' },
    confidentiality: { id: 'term.subtitle.confidentiality', defaultMessage: '註冊義務、帳號密碼及資料保密' },
    condition: { id: 'term.subtitle.condition', defaultMessage: '使用規定和條約' },
    suspension: { id: 'term.title.suspension', defaultMessage: '暫停或終止服務' },
    refundPolicy: { id: 'term.subtitle.refund.policy', defaultMessage: '退費規定' },
    refundMethod: { id: 'term.subtitle.refund.method', defaultMessage: '退費方式' },
  }),
  paragraph: defineMessages({
    scope: {
      id: 'term.paragraph.scope',
      defaultMessage:
        '隱私權保護政策內容，包括 {name} 如何處理在您使用網站服務時收集到的個人識別資料。隱私權保護政策不適用於 {name} 以外的相關連結網站，也不適用於非 {name} 所委託或參與管理的人員。',
    },
    personalData: {
      id: 'term.paragraph.personalData',
      defaultMessage:
        '當您造訪 {name} 或使用 {name} 所提供之功能服務時，我們將視該服務功能性質，請您提供必要的個人資料，並在該特定目的範圍內處理及利用您的個人資料；非經您書面同意， {name} 不會將個人資料用於其他用途。',
    },
    personalData2: {
      id: 'term.paragraph.personalData2',
      defaultMessage:
        '於一般瀏覽時，伺服器會自行記錄相關行徑，包括您使用連線設備的IP位址、使用時間、使用的瀏覽器、瀏覽及點選資料記錄等，做為我們增進網站服務的參考依據，此記錄為內部應用，決不對外公佈。',
    },
    link: {
      id: 'term.paragraph.link',
      defaultMessage:
        '{name} 的網頁提供其他網站的網路連結，您也可經由 {name} 所提供的連結，點選進入其他網站。但該連結網站不適用 {name} 的隱私權保護政策，您必須參考該連結網站中的隱私權保護政策。',
    },
    policy: {
      id: 'term.paragraph.policy',
      defaultMessage:
        '{name} 絕不會提供、交換、出租或出售任何您的個人資料給其他個人、團體、私人企業或公務機關，但有法律依據或合約義務者，不在此限。',
    },
    policy2: {
      id: 'term.paragraph.policy2',
      defaultMessage:
        '{name} 如舉辦任何回饋活動，你所提供給主辦單位的得獎連絡資料，也僅供此活動使用。{name} 不會將活動資料直接交付或售予第三方。如果 {name} 與第三方服務合作，亦應依法要求該第三方 {name} 的會員網站使用對應的約定及隱私權政策，{name} 將會盡全力保障所有會員個人資料的安全性。',
    },
    personalInfo: {
      id: 'term.paragraph.personalInfo',
      defaultMessage:
        '若您已註冊並希望自「{name}」提供的系統中刪除您提供給我們的任何註冊資訊，請透過分頁底部的「聯絡我們」連結與我們聯繫。根據您的需求，我們將盡力於30天內自活動數據庫中刪除您的註冊資訊，並在可行的情況下從我們的備份媒體中刪除您的註冊資訊。',
    },
    personalInfo2: {
      id: 'term.paragraph.personalInfo2',
      defaultMessage:
        '請注意，永久刪除您的註冊資訊，您的所有個人資料亦從資料庫中清除。這道流程完成後，您再也無法使用您的任一項服務，您的使用者帳號與所有資料均將永久移除，「{name}」將無法恢復您的帳號，或於日後擷取您的個人資料。若您於日後聯絡「{name}」支援管道，系統將無法辨認您的帳號與找回已刪除的帳號。',
    },
    cookie: {
      id: 'term.paragraph.cookie',
      defaultMessage:
        '為了提供您最佳的服務， {name} 會在您的電腦中放置並取用我們的Cookie，若您不願接受Cookie的寫入，您可在您使用的瀏覽器功能項中設定隱私權等級為高，即可拒絕Cookie的寫入，但可能會導至網站某些功能無法正常執行。',
    },
    terms: {
      id: 'term.paragraph.terms',
      defaultMessage:
        '非常歡迎您使用 {name}（以下簡稱本服務），為了讓您能夠安心使用 {name} 的各項服務與資訊，特此向您說明 {name} 的隱私權保護政策，以保障您的權益，應詳細閱讀本條款所有內容。當您使用本服務時，即表示您已閱讀、了解並同意本條款所有內容。此外，因 {name} 提供多種服務，某些服務可能因其特殊之性質而有附加條款，當您開始使用該服務即視為您同意該附加條款或相關規定亦屬本條款之一部份。{name} 有權於任何時間修改或變更本條款內容，建議您隨時注意該修改或變更。當您於任何修改或變更後繼續使用本服務，視為您已閱讀、了解並同意接受該修改或變更內容。如果使⽤者不同意 {name} 對本條款進⾏的修改，請離開 {name} 網站並⽴即停⽌使⽤ {name} 服務。同時，會員應刪除個⼈檔案並註銷會員資格，{name} 亦有權刪除會員個⼈檔案並註銷會員資格。請您詳閱下列內容：',
    },
    confidentiality: {
      id: 'term.paragraph.confidentiality',
      defaultMessage:
        '用戶登錄資料須提供使用者本人正確、最新及完整的資料。用戶登錄資料不得有偽造、不實、冒用等之情事(如：個人資料及信用卡資料)，一經發現本公司可拒絕其加入用戶資格之權利。並得以暫停或終止其用戶資格，若違反中華民國相關法律，亦將依法追究。用戶應妥善保管密碼，不可將密碼洩露或提供給他人知道或使用；以同一個用戶身分證字號和密碼使用本服務所進行的所有行行為，都將被認為是該用戶本人和密碼持有人的行為。',
    },
    confidentiality2: {
      id: 'term.paragraph.confidentiality2',
      defaultMessage:
        '若使⽤者本人未滿七歲，要由使⽤者的⽗⺟或法定監護⼈申請加⼊會員。若使⽤者已滿七歲未滿⼆⼗歲，則必須在申請加⼊會員之前，請⽗⺟或法定監護⼈閱讀本條款，並得到⽗⺟或監護⼈同意後，才可以申請、註冊及使⽤ {name} 所提供的服務；當使⽤者滿⼆⼗歲之前使⽤ {name} 服務，則必須向本公司擔保已取得⽗⺟或監護⼈的同意。',
    },
    condition: {
      id: 'term.paragraph.condition',
      defaultMessage: `不論註冊與否，會員及一般使用者在使用本公司所提供之服務時，您應遵守相關法律，並同意不得利用本服務從事侵害他人權利或違法行為，此行為包含但不限於：`,
    },
    suspension: {
      id: 'term.paragraph.suspension',
      defaultMessage:
        '本服務於網站相關軟硬體設備進行行更更換、升級或維修時，得暫停或中斷本服務。如因維修或不可抗力因素，導致本公司網站服務暫停，暫停的期間造成直接或間接利利益之損失，本公司不負損失賠償責任。如果本服務需有或內含可下載軟體，該軟體可能會在提供新版或新功能時，在您的裝置上自動更更新。部分情況下可以讓您調整您的自動更新設定。',
    },
    suspension2: {
      id: 'term.paragraph.suspension2',
      defaultMessage:
        '您使用本服務之行為若有任何違反法令或本使用條款或危害本公司或第三者權益之虞時，在法律准許範圍內，於通知或未通知之情形下，立即暫時或永久終止您使用本服務之授權。此外，使用者同意若本服務之使用被中斷或終止帳號及相關信息和文件被關閉或刪除，{name} 對使用者或任何第三人均不承擔任何責任。',
    },
    report: {
      id: 'term.paragraph.report',
      defaultMessage: '倘發現任何違反本服務條款之情事，請通知 {name}',
    },
    refund1: {
      id: 'term.paragraph.refund1',
      defaultMessage:
        '已上架的課程，學員於購買七日之內（含購買當日）認為不符合需求，且未觀看課程者（除試看單元外），可透過「聯繫客服」的方式提出退費申請。',
    },
    refund2: {
      id: 'term.paragraph.refund2',
      defaultMessage: '退費作業僅退回實際花費金額，若原訂單有使用 折價券 折價、或是 點數 折抵購課，皆不予退回。',
    },
    refund3: {
      id: 'term.paragraph.refund3',
      defaultMessage: '匯款退費：如果您購課時採用ATM轉帳或超商付款，則採匯款退費方式。採匯款退費者須負擔手續費30元。',
    },
    refund4: {
      id: 'term.paragraph.refund4',
      defaultMessage: '退費申請流程：請您聯繫客服，將有專人回覆。',
    },
  }),
  list: defineMessages({
    item1: {
      id: 'term.list.item1',
      defaultMessage:
        '上載、張貼、公布或傳送任何誹謗、侮辱、具威脅性、攻擊性、不雅、猥褻、不實、違反公共秩序或善良風俗或其他不法之文字、圖片或任何形式的檔案。',
    },
    item2: {
      id: 'term.list.item2',
      defaultMessage: '侵害他人名譽、隱私權、營業秘密、商標權、著作權、專利權、其他智慧財產權及其他權利。',
    },
    item3: {
      id: 'term.list.item3',
      defaultMessage: '違反法律、契約或協議所應負之保密義務。',
    },
    item4: {
      id: 'term.list.item4',
      defaultMessage: '企圖入侵本公司伺服器、資料庫、破解本公司安全機制或其他危害本公司服務提供安全性或穩定性之行為。',
    },
    item5: {
      id: 'term.list.item5',
      defaultMessage: '從事不法交易行為或張貼虛假不實、引人犯罪之訊息。',
    },
    item6: {
      id: 'term.list.item6',
      defaultMessage:
        '未經本公司明確授權同意並具書面授權同意證明，不得利用本服務或 {name} 所提供其他資源，包括但不限於圖文、影音資料庫、編寫製作網頁之軟體等，從事任何商業交易行為，或招攬廣告商或贊助人。',
    },
    item7: {
      id: 'term.list.item7',
      defaultMessage: '販賣槍枝、毒品、盜版軟體或其他違禁物。',
    },
    item8: {
      id: 'term.list.item8',
      defaultMessage: '提供賭博資訊或以任何方式引誘他人參與賭博。',
    },
    item9: {
      id: 'term.list.item9',
      defaultMessage: '濫發廣告訊息、垃圾訊息、連鎖信、違法之多層次傳銷訊息等。',
    },
    item10: {
      id: 'term.list.item10',
      defaultMessage: '其他 {name} 有正當理由認為不適當之行為。',
    },
  }),
}

export const saleMessages = {
  title: defineMessages({
    sum: { id: 'sale.title.sum', defaultMessage: '銷售總額' },
  }),
  contents: defineMessages({
    sum: { id: 'sale.content.price.sum.actual', defaultMessage: '實際銷售總額' },
    tip: { id: 'sale.content.tipsText', defaultMessage: '銷售總額 - 訂閱首期折扣 = 實際銷售總額' },
    totalCount: { id: 'sale.title.totalCount', defaultMessage: '共 {totalCount} 筆' },
    totalAmount: { id: 'sale.content.price.totalAmount', defaultMessage: '總金額' },
  }),
  column: {
    title: defineMessages({
      orderNo: { id: 'sale.column.title.orderNo', defaultMessage: '訂單編號' },
      orderName: { id: 'sale.column.title.name', defaultMessage: '姓名' },
      orderStatus: { id: 'sale.column.title.orderStatus', defaultMessage: '訂單狀態' },
      orderPrice: { id: 'sale.column.title.orderPrice', defaultMessage: '訂單金額' },
      purchaseDate: { id: 'common.purchaseDate', defaultMessage: '購買日期' },
      totalPrice: { id: 'common.totalPrice', defaultMessage: '購買總額' },
    }),
  },
  status: defineMessages({
    unpaid: { id: 'sale.status.unpaid', defaultMessage: '待付款' },
    expired: { id: 'sale.status.expired', defaultMessage: '已失效' },
    fail: { id: 'sale.status.fail', defaultMessage: '付款失敗' },
    partialPaid: { id: 'sale.status.partialPaid', defaultMessage: '部分付款' },
    completed: { id: 'sale.status.completed', defaultMessage: '已完成' },
    partialRefund: { id: 'sale.status.partialRefund', defaultMessage: '部分退款' },
    refunded: { id: 'sale.status.refunded', defaultMessage: '已退款' },
    deleted: { id: 'sale.status.deleted', defaultMessage: '已刪除' },
    preparing: { id: 'sale.status.preparing', defaultMessage: '準備中' },
    paying: { id: 'sale.status.paying', defaultMessage: '付款中' },
    refunding: { id: 'sale.status.refunding', defaultMessage: '退款中' },
    partialExpired: { id: 'sale.status.partialExpired', defaultMessage: '部分過期' },
    unknown: { id: 'sale.status.unknown', defaultMessage: '未知' },
  }),
}

export const usersMessages = {
  content: defineMessages({
    creatorList: {
      id: 'users.title.creator.collection',
      defaultMessage: '大師列表',
    },
    recommend: {
      id: 'users.title.creator.collection.recommend',
      defaultMessage: '推薦大師',
    },
    allCreators: {
      id: 'users.title.creator.collection.all',
      defaultMessage: '所有大師',
    },
    callToAction: {
      id: 'users.cta.creator.podcast',
      defaultMessage: '立即購買訂閱方案開通這個頻道的所有內容',
    },
    unreceivedEmail: {
      id: 'users.form.message.email.unreceived',
      defaultMessage: '收不到信？',
    },
  }),
  tab: defineMessages({
    intro: { id: 'users.tab.member.intro', defaultMessage: '介紹' },
    addPrograms: { id: 'common.member.course', defaultMessage: '開設課程' },
    addActivities: { id: 'common.member.activity', defaultMessage: '開設活動' },
    mediaPost: { id: 'common.tab.mediaPost', defaultMessage: '媒體文章' },
    podcasts: { id: 'common.member.podcasts', defaultMessage: '廣播頻道' },
    appointments: { id: 'common.tab.appointments', defaultMessage: '預約服務' },
    merchandises: { id: 'common.tab.merchandises', defaultMessage: '商店商品' },
    notYet: { id: 'common.notYet', defaultMessage: '未啟用' },
    available: { id: 'common.available', defaultMessage: '可使用' },
    expired: { id: 'common.expired', defaultMessage: '已失效' },
  }),
  title: defineMessages({
    coupon: { id: 'common.coupon', defaultMessage: '折價券' },
    resetPassword: { id: 'users.title.password.reset', defaultMessage: '重設密碼' },
  }),
  messages: defineMessages({
    enterPassword: {
      id: 'users.form.message.password.enter',
      defaultMessage: '請輸入密碼',
    },
    confirmPassword: {
      id: 'users.form.message.password.confirmation',
      defaultMessage: '請輸入確認密碼',
    },
    resetPassword: { id: 'common.message.success', defaultMessage: '已寄送重設密碼信' },
  }),
  placeholder: defineMessages({
    enterNewPassword: {
      id: 'users.form.placeholder.password.enter',
      defaultMessage: '輸入新密碼',
    },
    enterNewPasswordAgain: {
      id: 'users.form.placeholder.password.again',
      defaultMessage: '再次輸入新密碼',
    },
  }),
}

export const projectMessages = {
  text: defineMessages({
    totalParticipants: {
      id: 'project.text.totalParticipants',
      defaultMessage: '已有 {count} {count, plural, one {人} other {人}}參與',
    },
  }),
}
export const podcastMessages = {
  label: defineMessages({
    nowPlaying: {
      id: 'podcast.label.nowPlaying',
      defaultMessage: '現正播放',
    },
  }),
}

export const podcastAlbumMessages = {
  label: defineMessages({
    freePublic: {
      id: 'podcastAlbum.label.freePublic',
      defaultMessage: '免費公開',
    },
    podcastContent: {
      id: 'podcastAlbum.label.podcastContent',
      defaultMessage: '專輯內容',
    },
  }),
  text: defineMessages({
    sectionCount: {
      id: 'podcastAlbum.text.sectionCount',
      defaultMessage: '共 {sectionCount} 單元',
    },
  }),
}

export const reviewMessages = {
  title: defineMessages({
    programReview: { id: 'review.title.programReview', defaultMessage: '課程評價' },
  }),
  status: defineMessages({
    edited: { id: 'review.status.edited', defaultMessage: '已編輯' },
  }),
  text: defineMessages({
    reviewAmount: { id: 'review.text.amount', defaultMessage: '{amount} 則評價' },
    notEnoughReviews: { id: 'review.text.notEnoughReviews', defaultMessage: '評價不足{amount}人無法顯示' },
    reply: { id: 'review.text.reply', defaultMessage: '回覆...' },
    reviewModalDescription: {
      id: 'review.text.reviewModalDescription',
      defaultMessage: '歡迎給予鼓勵、分享心得或是提出建議！為維護評價公正性，累計三則以上評價才會公開呦！',
    },
  }),
  button: defineMessages({
    reply: { id: 'review.button.review', defaultMessage: '回覆' },
    toReview: { id: 'review.button.toReview', defaultMessage: '我要評價' },
    editReview: { id: 'review.button.editReview', defaultMessage: '修改評價' },
  }),
  modal: defineMessages({
    fillReview: { id: 'review.modal.fillReview', defaultMessage: '填寫評價與心得' },
    score: { id: 'review.modal.score', defaultMessage: '評分 (點擊星星評等，預設為五星)' },
    title: { id: 'review.modal.title', defaultMessage: '評價標題' },
    content: { id: 'review.modal.content', defaultMessage: '評價內容' },
    private: { id: 'review.modal.private', defaultMessage: '私下想給老師的話 (選填)' },
  }),
  event: defineMessages({
    isSubmitReview: { id: 'review.event.isSubmitReview', defaultMessage: '已送出評價' },
  }),
  validate: defineMessages({
    titleIsRequired: { id: 'review.validate.titleIsRequired', defaultMessage: '請填入評價標題' },
    contentIsRequired: { id: 'review.validate.contentIsRequired', defaultMessage: '請填入評價內容' },
  }),
}

export const codeMessages = defineMessages({
  SUCCESS: {
    id: 'code.SUCCESS',
    defaultMessage: '成功',
  },
  E_INPUT: {
    id: 'code.E_INPUT',
    defaultMessage: '輸入資料有誤',
  },
  E_USERNAME_EXISTS: {
    id: 'code.E_USERNAME_EXISTS',
    defaultMessage: '使用者名稱已存在',
  },
  E_EMAIL_EXISTS: {
    id: 'code.E_EMAIL_EXISTS',
    defaultMessage: '電子信箱已存在',
  },
  E_SEND_EMAIL: {
    id: 'code.E_SEND_EMAIL',
    defaultMessage: '寄送信件失敗',
  },
  E_UNKNOWN: {
    id: 'code.E_UNKNOWN',
    defaultMessage: '未知錯誤',
  },
  E_INSERT_QUEUE: {
    id: 'code.E_INSERT_QUEUE',
    defaultMessage: 'E_INSERT_QUEUE',
  },
  E_NO_MEMBER: {
    id: 'code.E_NO_MEMBER',
    defaultMessage: '找不到該使用者',
  },
  E_NO_APP_HOST: {
    id: 'code.E_NO_APP_HOST',
    defaultMessage: 'E_NO_APP_HOST',
  },
  E_NO_ORDER: {
    id: 'code.E_NO_ORDER',
    defaultMessage: '找不到該訂單',
  },
  E_NO_PAYMENT: {
    id: 'code.E_NO_PAYMENT',
    defaultMessage: '找不到該付款紀錄',
  },
  E_NO_EMAIL: {
    id: 'code.E_NO_EMAIL',
    defaultMessage: '找不到信箱',
  },
  E_PASSWORD: {
    id: 'code.E_PASSWORD',
    defaultMessage: '密碼錯誤',
  },
  E_PROVIDER: {
    id: 'code.E_PROVIDER',
    defaultMessage: 'E_PROVIDER',
  },
  E_PROVIDER_TOKEN: {
    id: 'code.E_PROVIDER_TOKEN',
    defaultMessage: 'E_PROVIDER_TOKEN',
  },
  E_UPDATE_PASSWORD: {
    id: 'code.E_UPDATE_PASSWORD',
    defaultMessage: '更新密碼錯誤',
  },
  E_CHECKOUT_ORDER: {
    id: 'code.E_CHECKOUT_ORDER',
    defaultMessage: '結帳錯誤',
  },
  E_MPG_SERVICE: {
    id: 'code.E_MPG_SERVICE',
    defaultMessage: 'E_MPG_SERVICE',
  },
  E_SPGATEWAY_NOTIFY: {
    id: 'code.E_SPGATEWAY_NOTIFY',
    defaultMessage: 'E_SPGATEWAY_NOTIFY',
  },
  E_UPDATE_ORDER_STATUS: {
    id: 'code.E_UPDATE_ORDER_STATUS',
    defaultMessage: 'E_UPDATE_ORDER_STATUS',
  },
  E_LOGOUT: {
    id: 'code.E_LOGOUT',
    defaultMessage: '登出錯誤',
  },
  E_DELIVER_PRODUCTS: {
    id: 'code.E_DELIVER_PRODUCTS',
    defaultMessage: 'E_DELIVER_PRODUCTS',
  },
  E_ISSUE_INVOICE: {
    id: 'code.E_ISSUE_INVOICE',
    defaultMessage: '開立發票錯誤',
  },
  E_NO_CODE: {
    id: 'code.E_NO_CODE',
    defaultMessage: '無此序號',
  },
  E_EXCHANGE_CODE: {
    id: 'code.E_EXCHANGE_CODE',
    defaultMessage: 'Unable to exchange this discount',
  },
  E_OUTDATED_CODE: {
    id: 'code.E_OUTDATED_CODE',
    defaultMessage: '此序號已過期',
  },
  E_VALIDATE_CREDIT_CARD: {
    id: 'code.E_VALIDATE_CREDIT_CARD',
    defaultMessage: '信用卡驗證錯誤',
  },
  E_SETUP_TPCLIENT: {
    id: 'code.E_SETUP_TPCLIENT',
    defaultMessage: 'E_SETUP_TPCLIENT',
  },
  E_QUEUE: {
    id: 'code.E_QUEUE',
    defaultMessage: '系統正在忙碌中。',
  },
  E_BIND_CREDIT_CARD: {
    id: 'code.E_BIND_CREDIT_CARD',
    defaultMessage: '綁定信用卡錯誤',
  },
  E_PAYPAL_EXEC: {
    id: 'code.E_PAYPAL_EXEC',
    defaultMessage: 'PAYPAL執行操作失敗',
  },
  E_PAYPAL_ORDER: {
    id: 'code.E_PAYPAL_ORDER',
    defaultMessage: 'PAYPAL建立付款失敗',
  },
  E_PAYPAL_CAPTURE: {
    id: 'code.E_PAYPAL_CAPTURE',
    defaultMessage: 'PAYPAL請款失敗',
  },
  E_NO_PAYMENT_METHOD: {
    id: 'code.E_NO_PAYMENT_METHOD',
    defaultMessage: '找不到該付款方式',
  },
  E_INVALID_PAYMENT_METHOD: {
    id: 'code.E_INVALID_PAYMENT_METHOD',
    defaultMessage: '該付款方式無效',
  },
  E_PAY_TPCLIENT: {
    id: 'code.E_PAY_TPCLIENT',
    defaultMessage: '信用卡付款失敗請重新輸入卡號',
  },
  E_SIGN_URL: {
    id: 'code.E_SIGN_URL',
    defaultMessage: 'E_SIGN_URL',
  },
  E_ZOOM_SECRET: {
    id: 'code.E_ZOOM_SECRET',
    defaultMessage: 'E_ZOOM_SECRET',
  },
  E_LIST_ZOOM_USER: {
    id: 'code.E_LIST_ZOOM_USER',
    defaultMessage: 'E_LIST_ZOOM_USER',
  },
  E_HANDLE_TRIGGER: {
    id: 'code.E_HANDLE_TRIGGER',
    defaultMessage: 'E_HANDLE_TRIGGER',
  },
  E_GET_MEMBER: {
    id: 'code.E_GET_MEMBER',
    defaultMessage: '無法取得使用者',
  },
  E_REGISTER_MEMBER: {
    id: 'code.E_REGISTER_MEMBER',
    defaultMessage: '註冊使用者錯誤',
  },
  E_PAYMENT_GATEWAY: {
    id: 'code.E_PAYMENT_GATEWAY',
    defaultMessage: 'E_PAYMENT_GATEWAY',
  },
  E_RESET_PASSWORD_TOKEN: {
    id: 'code.E_RESET_PASSWORD_TOKEN',
    defaultMessage: '連結已失效',
  },
  E_SETUP_PAYPAL: {
    id: 'code.E_SETUP_PAYPAL',
    defaultMessage: 'Paypal 環境設定失敗',
  },
  E_CW_SETUP: {
    id: 'code.E_CW_SETUP',
    defaultMessage: 'CW 環境設定失敗',
  },
  E_CW_SERVICE: {
    id: 'code.E_CW_SERVICE',
    defaultMessage: 'CW 導入付款頁失敗',
  },
  E_REFUND: {
    id: 'code.E_REFUND',
    defaultMessage: '退款失敗',
  },
  E_REDEEM: {
    id: 'code.E_REDEEM',
    defaultMessage: '接收失敗',
  },
  E_CHECK_PRODUCT_VALID: {
    id: 'code.E_CHECK_PRODUCT_VALID',
    defaultMessage: 'product is invalid',
  },
  E_PRODUCT_SESSION_OUTDATE: {
    id: 'code.E_PRODUCT_SESSION_OUTDATE',
    defaultMessage: 'session is outdated',
  },
  E_NO_PRODUCT: {
    id: 'code.E_NO_PRODUCT',
    defaultMessage: 'product does not exist',
  },
  E_DUPLICATED_EXCHANGE: {
    id: 'code.E_DUPLICATED_EXCHANGE',
    defaultMessage: 'Discount already exchange',
  },
  E_ORDER_STATUS: {
    id: 'code.E_ORDER_STATUS',
    defaultMessage: '訂單已被限制，請重新下單',
  },
  E_PAYMENT_LIMIT: {
    id: 'code.E_PAYMENT_LIMIT',
    defaultMessage: '付款次數已達十次上限，請建立新訂單',
  },
  E_COIN_INCLUDED: {
    id: 'code.E_COIN_INCLUDED',
    defaultMessage: '無法建立含有代幣的交易，請移除該項目',
  },
  E_NOT_ENOUGH_COINS: {
    id: 'code.E_NOT_ENOUGH_COINS',
    defaultMessage: '代幣不足，無法建立交易',
  },
  E_NO_PRICE: {
    id: 'code.E_NO_PRICE',
    defaultMessage: '零元訂單無法建立交易',
  },
  E_BIND_DEVICE: {
    id: 'code.E_BIND_DEVICE',
    defaultMessage: '該帳號登入裝置已達上限',
  },
})

export const certificateMessages = {
  text: defineMessages({
    congratulations: {
      id: 'certificate.text.congratulations',
      defaultMessage: '已取得證書，快分享給身邊的朋友吧！',
    },
    share: {
      id: 'certificate.text.share',
      defaultMessage: '分享社群',
    },
  }),
}
