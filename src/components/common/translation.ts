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
}

export default commonMessages
