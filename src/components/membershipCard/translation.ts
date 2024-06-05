import { defineMessages } from 'react-intl'

const membershipCardMessages = {
  MembershipCardDiscount: defineMessages({
    ActivityTicket: { id: 'membershipCard.MembershipCardDiscount.ActivityTicket', defaultMessage: 'Activity' },
    ProgramPlan: { id: 'membershipCard.MembershipCardDiscount.ProgramPlan', defaultMessage: 'Program' },
    ProgramPackagePlan: {
      id: 'membershipCard.MembershipCardDiscount.ProgramPackagePlan',
      defaultMessage: 'Program Package',
    },
    PodcastProgram: { id: 'membershipCard.MembershipCardDiscount.PodcastProgram', defaultMessage: 'Podcast' },
    cashDiscount: {
      id: 'membershipCard.MembershipCardDiscount.cashDiscount',
      defaultMessage: ' Cash discount {amount}',
    },
    percentageDiscount: {
      id: 'membershipCard.MembershipCardDiscount.percentageDiscount',
      defaultMessage: 'Percentage discount {amount}%',
    },
    generalDiscount: { id: 'membershipCard.MembershipCardDiscount.generalDiscount', defaultMessage: 'Discount' },
    type: { id: 'membershipCard.MembershipCardDiscount.type', defaultMessage: 'Type' },
    discountName: { id: 'membershipCard.MembershipCardDiscount.discountName', defaultMessage: 'Name' },
    discountType: { id: 'membershipCard.MembershipCardDiscount.discountType', defaultMessage: 'Discount Term' },
    equityType: { id: 'membershipCard.MembershipCardDiscount.equityType', defaultMessage: 'Equity' },
    usageDescription: {
      id: 'membershipCard.MembershipCardDiscount.usageDescription',
      defaultMessage: 'Usage Description',
    },
    discountTerms: { id: 'membershipCard.MembershipCardDiscount.discountTerms', defaultMessage: 'Discount Terms' },
  }),
}

export default membershipCardMessages
