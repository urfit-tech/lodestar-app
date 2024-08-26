import { defineMessages } from 'react-intl'

const commonMessages = {
  '*': defineMessages({
    successfullyUpdate: { id: 'common.*.successfullyUpdate', defaultMessage: '更新成功' },
    save: { id: 'common.*.save', defaultMessage: '儲存' },
    isRequiredWarning: { id: 'common.*.isRequiredWarning', defaultMessage: '請填入{name}' },
    nextStep: {
      id: 'common.*.nextStep',
      defaultMessage: '下一步',
    },
    fetchError: {
      id: 'common.*.fetchError',
      defaultMessage: '讀取失敗',
    },
  }),
  GlobalSearchInput: defineMessages({
    atLeastTwoChar: {
      id: 'common.GlobalSearchInput.atLeastTwoChar',
      defaultMessage: 'Please enter at least two characters',
    },
  }),
  AudioPlayer: defineMessages({
    playRate: { id: 'common.AudioPlayer.playRate', defaultMessage: 'Play rate' },
    listLoop: { id: 'common.AudioPlayer.listLoop', defaultMessage: 'List loop' },
    singleLoop: { id: 'common.AudioPlayer.singleLoop', defaultMessage: 'Single loop' },
    random: { id: 'common.AudioPlayer.random', defaultMessage: 'Random' },
  }),
  AzureMediaPlayer: defineMessages({
    enableJavaScript: {
      id: 'component.AzureMediaPlayer.enableJavaScript',
      defaultMessage:
        'To view this video please enable JavaScript, and consider upgrading to a web browser that supports HTML5 video',
    },
  }),
  SignupPropertyModal: defineMessages({
    signupInfo: {
      id: 'common.SignupPropertyModal.signupInfo',
      defaultMessage: '註冊資訊',
    },
  }),
  SignupPropertySection: defineMessages({
    name: {
      id: 'common.SignupPropertySection.name',
      defaultMessage: '姓名',
    },
    enterName: {
      id: 'common.SignupPropertySection.enterName',
      defaultMessage: '請填入姓名',
    },
    nameFieldWarning: {
      id: 'common.SignupPropertySection.nameFieldWarning',
      defaultMessage: 'please enter your name.',
    },
  }),
  InAppBrowserWarningModal: defineMessages({
    notSupportInAppBrowserTitle: {
      id: 'common.InAppBrowserWarningModal.notSupportInAppBrowserTitle',
      defaultMessage: 'Not support in app Browser',
    },
    notSupportInAppBrowserDescription: {
      id: 'common.InAppBrowserWarningModal.notSupportInAppBrowserDescription',
      defaultMessage: 'Please use another browser to browse this website.',
    },
    openPage: {
      id: 'common.InAppBrowserWarningModal.openPage',
      defaultMessage: 'Open page',
    },
    notSupportInAppBrowserLeadDescription: {
      id: 'common.InAppBrowserWarningModal.notSupportInAppBrowserLeadDescription',
      defaultMessage: 'Click "More Options" (three dots in the lower right corner) and click "Open in browser"',
    },
    warning: {
      id: 'common.InAppBrowserWarningModal.warning',
      defaultMessage:
        'To provide you with the best website experience and to avoid limited website functionality, it is recommended not to use the browser within an app, but rather to open the website through the default browser.',
    },
  }),
  BusinessSignupForm: defineMessages({
    firmOrWorkShop: {
      id: 'common.BusinessSignupForm.firmOrWorkShop',
      defaultMessage: '行號(工作室等)',
    },
    limitedCompany: {
      id: 'common.BusinessSignupForm.limitedCompany',
      defaultMessage: '有限公司',
    },
    companyLimited: {
      id: 'common.BusinessSignupForm.companyLimited',
      defaultMessage: '股份有限公司',
    },
    governmentAgency: {
      id: 'common.BusinessSignupForm.governmentAgency',
      defaultMessage: '政府機構',
    },
    nonprofitOrganization: {
      id: 'common.BusinessSignupForm.nonprofitOrganization',
      defaultMessage: '非營利組織',
    },
  }),
}

export default commonMessages
