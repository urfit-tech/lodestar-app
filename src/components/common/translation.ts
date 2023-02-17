import { defineMessages } from 'react-intl'

const commonMessages = {
  '*': defineMessages({
    isRequiredWarning: { id: 'common.*.isRequiredWarning', defaultMessage: '請填入{name}' },
    nextStep: {
      id: 'common.*.nextStep',
      defaultMessage: '下一步',
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
}

export default commonMessages
