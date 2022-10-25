import { defineMessages } from 'react-intl'

const authMessages = {
  '*': defineMessages({
    login: { id: 'auth.*.login', defaultMessage: '登入' },
    isRequiredWarning: { id: 'auth.*.isRequiredWarning', defaultMessage: '請填入{name}' },
  }),
  RegisterSection: defineMessages({
    nameFieldWarning: {
      id: 'auth.RegisterSection.nameFieldWarning',
      defaultMessage: 'please enter your name.',
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
    term: { id: 'auth.RegisterSection.term', defaultMessage: '條款' },
    isMember: { id: 'auth.RegisterSection.isMember', defaultMessage: '已經是會員了嗎?' },
    registration: {
      id: 'auth.RegisterSection.registration',
      defaultMessage: '註冊表示您已閱讀並同意各項',
    },
    signUp: { id: 'auth.RegisterSection.signUp', defaultMessage: '立即註冊' },
    smsVerification: { id: 'auth.RegisterSection.smsVerification', defaultMessage: '驗證手機號碼' },
    fetchError: { id: 'auth.RegisterSection.fetchError', defaultMessage: '讀取失敗' },
    registerFailed: { id: 'auth.RegisterSection.registerFailed', defaultMessage: '註冊失敗，請聯繫網站管理者' },
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
  }),
}

export default authMessages
