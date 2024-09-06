import { PeriodType } from './program'

export type ProductType =
  | 'ProgramPlan'
  | 'ProgramContent'
  | 'ProgramPackagePlan'
  | 'ProjectPlan'
  | 'Card'
  | 'ActivityTicket'
  | 'Merchandise'
  | 'MerchandiseSpec'
  | 'PodcastProgram'
  | 'PodcastPlan'
  | 'AppointmentPlan'
  | 'Token'

export type Product =
  | {
      targetId: string
      productType: 'ProgramPlan'
      title: string
      coverUrl: string
      coverType: string
      coverThumbnailUrl: string
      listPrice: number
      isOnSale: boolean
      salePrice: number
      discountDownPrice: number
      periodAmount: number
      periodType: PeriodType
      groupBuyingPeople: number
      isSubscription: boolean
    }
  | {
      targetId: string
      productType: 'ProgramPackagePlan'
      title: string
      coverUrl: string
      listPrice: number
      isOnSale: boolean
      salePrice: number
      discountDownPrice: number
      periodAmount: number
      periodType: PeriodType
      isSubscription: boolean
    }
  | {
      targetId: string
      productType: 'ActivityTicket'
      title: string
      listPrice: number
      coverUrl: string
      isSubscription: boolean
    }
  | {
      targetId: string
      productType: 'Card'
      title: string
      listPrice: number
      isSubscription: boolean
    }
  | {
      targetId: string
      productType: 'ProjectPlan'
      title: string
      coverUrl: string
      listPrice: number
      isOnSale: boolean
      salePrice: number
      discountDownPrice: number
      periodAmount: number
      periodType: PeriodType
      isLimited: boolean
      isPhysical: boolean
      isSubscription: boolean
    }
  | {
      targetId: string
      productType: 'PodcastProgram'
      title: string
      coverUrl: string
      listPrice: number
      isOnSale: boolean
      salePrice: number
      isSubscription: boolean
    }
  | {
      targetId: string
      productType: 'PodcastPlan'
      title: string
      coverUrl: string
      isSubscription: boolean
    }
  | {
      targetId: string
      productType: 'AppointmentPlan'
      title: string
      coverUrl: string
      startedAt: Date
      endedAt: Date
      isSubscription: boolean
    }
  | {
      targetId: string
      productType: 'MerchandiseSpec'
      title: string
      listPrice: number
      isOnSale: boolean
      salePrice: number
      currencyId: string
      coverUrl: string
      isPhysical: boolean
      isCustomized: boolean
      isSubscription: boolean
    }
