import { defineMessages } from 'react-intl'

const layoutMessages = {
  '*': defineMessages({}),
  GlobalSearchModal: defineMessages({
    atLeastTwoChar: {
      id: 'layout.GlobalSearchModal.atLeastTwoChar',
      defaultMessage: 'Please enter at least two characters',
    },
  }),
}

export default layoutMessages
