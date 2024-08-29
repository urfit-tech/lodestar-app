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
  OnSaleCallToActionSection: defineMessages({
    joinWithOthers: {
      id: 'project.onSaleCallToActionSection.joinWithOthers',
      defaultMessage: '與 {count} 人一起參與',
    },
  }),
  ProjectBannerSection: defineMessages({
    discountCountdown: {
      id: 'project.projectBannerSection.discountCountdown',
      defaultMessage: '優惠倒數',
    },
  }),
  ProjectCardSection: defineMessages({
    watchNow: {
      id: 'project.projectCardSection.watchNow',
      defaultMessage: '立即試看',
    },
  }),
  ProjectProgramSearchSection: defineMessages({
    program: {
      id: 'project.projectProgramSearchSection.program',
      defaultMessage: '課程',
    },
    programPackage: {
      id: 'project.projectProgramSearchSection.programPackage',
      defaultMessage: '組合',
    },
    appointment: {
      id: 'project.projectProgramSearchSection.appointment',
      defaultMessage: '諮詢',
    },
  }),
}

export default projectMessages
