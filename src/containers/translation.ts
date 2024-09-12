import { defineMessages } from 'react-intl'

const containersMessages = {
  program: defineMessages({
    newPurchaseDate: {
      id: 'container.EnrolledProgramCollectionBlock.newPurchaseDate',
      defaultMessage: '購買日期（新到舊）',
    },
    oldPurchaseDate: {
      id: 'container.EnrolledProgramCollectionBlock.oldPurchaseDate',
      defaultMessage: '購買日期（舊到新）',
    },
    newLastViewDate: {
      id: 'container.EnrolledProgramCollectionBlock.newLastViewDate',
      defaultMessage: '最後觀課日（新到舊）',
    },
    oldLastViewDate: {
      id: 'container.EnrolledProgramCollectionBlock.oldLastViewDate',
      defaultMessage: '最後觀課日（舊到新）',
    },
    lessCreatorStrokes: {
      id: 'container.EnrolledProgramCollectionBlock.lessCreatorStrokes',
      defaultMessage: '依講師排序（筆畫少到多）',
    },
    moreCreatorStrokes: {
      id: 'container.EnrolledProgramCollectionBlock.moreCreatorStrokes',
      defaultMessage: '依講師排序（筆畫多到少）',
    },
    allCourses: {
      id: 'container.EnrolledProgramCollectionBlock.allCourses',
      defaultMessage: '全部課程',
    },
    inProgress: {
      id: 'container.EnrolledProgramCollectionBlock.inProgress',
      defaultMessage: '進行中',
    },
    notStartYet: {
      id: 'container.EnrolledProgramCollectionBlock.notStartYet',
      defaultMessage: '尚未開始',
    },
    done: {
      id: 'container.EnrolledProgramCollectionBlock.done',
      defaultMessage: '已完課',
    },
    purchaseDate: {
      id: 'container.ProgramCard.purchaseDate',
      defaultMessage: '{date} 購買 ',
    },
    lastViewedDate: {
      id: 'container.ProgramCard.lastViewedDate',
      defaultMessage: ' / {date} 上次觀看',
    },
    notViewedYet: {
      id: 'container.ProgramCard.notViewedYet',
      defaultMessage: ' / 尚未觀看',
    },
  }),
}

export default containersMessages
