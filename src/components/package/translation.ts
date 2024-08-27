import { defineMessages } from 'react-intl'

const packageMessages = {
  PackageCard: defineMessages({
    purchase: {
      id: 'package.PackageCard.purchase',
      defaultMessage: '購買',
    },
    lastView: {
      id: 'package.PackageCard.lastView',
      defaultMessage: '上次觀看',
    },
    notView: {
      id: 'package.PackageCard.notView',
      defaultMessage: '尚未觀看',
    },
  }),
  ProgramPackageCollectionBlock: defineMessages({
    newPurchaseDate: {
      id: 'package.ProgramPackageCollectionBlock.newPurchaseDate',
      defaultMessage: '購買日期（新到舊）',
    },
    oldPurchaseDate: {
      id: 'package.ProgramPackageCollectionBlock.oldPurchaseDate',
      defaultMessage: '購買日期（舊到新）',
    },
    newLastViewDate: {
      id: 'package.ProgramPackageCollectionBlock.newLastViewDate',
      defaultMessage: '最後觀課日（新到舊）',
    },
    oldLastViewDate: {
      id: 'package.ProgramPackageCollectionBlock.oldLastViewDate',
      defaultMessage: '最後觀課日（舊到新）',
    },
  }),
}

export default packageMessages
