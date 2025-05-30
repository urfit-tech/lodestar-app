import { defineMessages } from 'react-intl'

const authMessages = {
  '*': defineMessages({
    login: { id: 'auth.*.login', defaultMessage: '登入' },
    isRequiredWarning: { id: 'auth.*.isRequiredWarning', defaultMessage: '請填入{name}' },
    formatIsInvalidated: { id: 'auth.*.formatIsInvalidated', defaultMessage: '格式有誤' },
  }),
  RegisterSection: defineMessages({
    smsVerificationFailed: {
      id: 'auth.RegisterSection.smsVerificationFailed',
      defaultMessage: '簡訊驗證失敗',
    },
    smsSentSuccess: {
      id: 'auth.RegisterSection.smsSentSuccess',
      defaultMessage: '成功發送簡訊碼',
    },
    enterPhoneNumber: {
      id: 'auth.RegisterSection.enterPhoneNumber',
      defaultMessage: '請輸入手機號碼',
    },
    emailIsAlreadyRegistered: {
      id: 'auth.RegisterSection.emailIsAlreadyRegistered',
      defaultMessage: '此信箱已註冊',
    },
    usernameIsAlreadyRegistered: {
      id: 'auth.RegisterSection.usernameIsAlreadyRegistered',
      defaultMessage: '此使用者名稱已註冊',
    },
    signupInfo: {
      id: 'auth.RegisterSection.signupInfo',
      defaultMessage: '註冊資訊',
    },
    nextStep: {
      id: 'auth.RegisterSection.nextStep',
      defaultMessage: '下一步',
    },
    name: {
      id: 'auth.RegisterSection.name',
      defaultMessage: '姓名',
    },
    enterName: {
      id: 'auth.RegisterSection.enterName',
      defaultMessage: '請填入姓名',
    },
    nameFieldWarning: {
      id: 'auth.RegisterSection.nameFieldWarning',
      defaultMessage: 'please enter your name.',
    },
    term: { id: 'auth.RegisterSection.term', defaultMessage: '條款' },
    businessTerm: {
      id: 'auth.RegisterSection.businessTerm',
      defaultMessage: '我保證本人為公司官方代表，並有權代表公司建立及管理專頁。本人和公司皆同意公司專頁的額外條款',
    },
    isMember: { id: 'auth.RegisterSection.isMember', defaultMessage: '已經是會員了嗎?' },
    isBusiness: { id: 'auth.RegisterSection.isBusiness', defaultMessage: '已有公司帳號?' },
    registration: {
      id: 'auth.RegisterSection.registration',
      defaultMessage: '註冊表示您已閱讀並同意各項',
    },
    signUp: { id: 'auth.RegisterSection.signUp', defaultMessage: '立即註冊' },
    smsVerification: { id: 'auth.RegisterSection.smsVerification', defaultMessage: '驗證手機號碼' },
    fetchError: { id: 'auth.RegisterSection.fetchError', defaultMessage: '讀取失敗' },
    registerFailed: { id: 'auth.RegisterSection.registerFailed', defaultMessage: '註冊失敗，請聯繫網站管理者' },
    companyPictureFile: { id: 'auth.RegisterSection.companyPictureFile', defaultMessage: '公司標誌' },
    companyTitle: { id: 'auth.RegisterSection.companyTitle', defaultMessage: '公司抬頭' },
    companyTitleIsRequired: { id: 'auth.RegisterSection.companyTitleIsRequired', defaultMessage: '請填入公司抬頭' },
    companyShortName: { id: 'auth.RegisterSection.companyShortName', defaultMessage: '公司簡稱' },
    companyShortNameMessage: {
      id: 'auth.RegisterSection.companyShortNameMessage',
      defaultMessage: '未輸入則以「公司抬頭」作為專頁顯示名稱',
    },
    companyUniformNumber: { id: 'auth.RegisterSection.companyUniformNumber', defaultMessage: '公司統編' },
    uniformNumberLength: { id: 'auth.RegisterSection.uniformNumberLength', defaultMessage: '統一編號為八碼數字' },
    uniformNumberIsInvalidated: {
      id: 'auth.RegisterSection.uniformNumberIsInvalidated',
      defaultMessage: '統一編號無效',
    },
    companyType: { id: 'auth.RegisterSection.companyType', defaultMessage: '公司類型' },
    pleaseSelect: { id: 'auth.RegisterSection.pleaseSelect', defaultMessage: '請選擇' },
    officialWebsite: { id: 'auth.RegisterSection.officialWebsite', defaultMessage: '官方網站' },
    officialWebsiteMessage: { id: 'auth.RegisterSection.officialWebsiteMessage', defaultMessage: 'https://' },
    companyAddress: { id: 'auth.RegisterSection.companyAddress', defaultMessage: '公司地址' },
    companyCity: {
      id: 'auth.RegisterSection.companyCity',
      defaultMessage: '公司縣市',
    },
    companyDistrict: {
      id: 'auth.RegisterSection.companyDistrict',
      defaultMessage: '公司鄉鎮區',
    },
    companyAddressPlease: { id: 'auth.RegisterSection.companyAddressPlease', defaultMessage: '請輸入地址' },
    detailedAddress: { id: 'auth.RegisterSection.detailedAddress', defaultMessage: '詳細地址' },
    personInChargeOfTheCompany: { id: 'auth.RegisterSection.personInChargeOfTheCompany', defaultMessage: '公司負責人' },
    companyPhone: { id: 'auth.RegisterSection.companyPhone', defaultMessage: '公司電話' },
    companyAbstract: { id: 'auth.RegisterSection.companyAbstract', defaultMessage: '公司簡介' },
    companyIntro: {
      id: 'auth.RegisterSection.companyIntro',
      defaultMessage: '公司介紹',
    },
  }),
  LoginSection: defineMessages({
    loginAlertModalTitle: {
      id: 'auth.LoginSection.loginAlertModalTitle',
      defaultMessage: '帳號重複登入',
    },
    loginAlertModelDescription: {
      id: 'auth.LoginSection.loginAlertModelDescription',
      defaultMessage: '目前有其他裝置正在使用這組帳號，是否要將另一個裝置登出？',
    },
    forceLogout: {
      id: 'auth.LoginSection.forceLogout',
      defaultMessage: '強制登出',
    },
    cancelLogin: {
      id: 'auth.LoginSection.cancelLogin',
      defaultMessage: '取消',
    },
    loginSuccess: {
      id: 'auth.LoginSection.loginSuccess',
      defaultMessage: '登入成功',
    },
    deviceReachLimitTitle: {
      id: 'auth.LoginSection.deviceReachLimitTitle',
      defaultMessage: '裝置已達上限',
    },
    deviceReachLimitDescription: {
      id: 'auth.LoginSection.deviceReachLimitDescription',
      defaultMessage:
        'Your account has reached the device usage limit. Please receive a verification email and enter the verification code to log in.',
    },
    deviceReachLimitConfirm: {
      id: 'auth.LoginSection.deviceReachLimitConfirm',
      defaultMessage: 'Send',
    },
    yourEmail: {
      id: 'auth.LoginSection.yourEmail',
      defaultMessage: 'your email: {email}',
    },
  }),
  OverBindDeviceModal: defineMessages({
    deviceVerificationCode: {
      id: 'auth.OverBindDeiceModal.deviceVerificationCode',
      defaultMessage: 'Device verification code',
    },
    validationSuccessfulText: {
      id: 'auth.OverBindDeiceModal.validationSuccessful',
      defaultMessage: 'Validation successful. Please log in again',
    },
    validationCodeError: {
      id: 'auth.OverBindDeiceModal.validationCodeError',
      defaultMessage: 'Verification code error',
    },
    didNotReceiveVerificationCode: {
      id: 'auth.OverBindDeiceModal.didNotReceiveVerificationCode',
      defaultMessage: 'Did not receive the verification code?',
    },
    reSend: { id: 'auth.OverBindDeiceModal.reSend', defaultMessage: 'Resend' },
    validationFailed: { id: 'auth.OverBindDeiceModal.validationFailed', defaultMessage: 'Validation failed' },
    sentSuccessfully: { id: 'auth.OverBindDeiceModal.sentSuccessfully', defaultMessage: 'Sent successfully' },
    failedToSend: { id: 'auth.OverBindDeiceModal.failedToSend', defaultMessage: 'Failed to send' },
  }),
}

export default authMessages
