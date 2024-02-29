import { defineMessages } from 'react-intl'

const projectMessages = {
  '*': defineMessages({}),
  FundingProgressBlock: defineMessages({
    funding: { id: 'project.FundingProgressBlock.fundraising', defaultMessage: 'funding' },
    achieved: { id: 'project.FundingProgressBlock.achieved', defaultMessage: 'achieved' },
    totalParticipants: {
      id: 'project.FundingProgressBlock.totalParticipants',
      defaultMessage: '已有 {count} {count, plural, one {人} other {人}}參與',
    },
  }),
}

export default projectMessages
