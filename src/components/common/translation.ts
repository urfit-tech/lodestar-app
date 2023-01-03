import { defineMessages } from 'react-intl'

const commonMessages = {
  '*': defineMessages({}),
  GlobalSearchInput: defineMessages({
    atLeastTwoChar: {
      id: 'common.GlobalSearchInput.atLeastTwoChar',
      defaultMessage: 'Please enter at least two characters',
    },
  }),
}

export default commonMessages
