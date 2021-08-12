import { InvoiceProps, ShippingProps } from './checkout'

export type MerchandiseBasicProps = {
  id: string
  title: string
  soldAt: Date | null
  isPhysical?: boolean
  minPrice: number
  maxPrice: number
  tags: string[]
  categories: {
    id: string
    name: string
  }[]
  images: {
    id: string
    url: string
    isCover: boolean
  }[]
}

export type MerchandiseBriefProps = MerchandiseBasicProps & {
  specs: MerchandiseSpecBasicProps[]
}

export type MerchandiseProps = MerchandiseBasicProps & {
  abstract: string | null
  description: string | null
  startedAt: Date | null
  endedAt: Date | null
  isLimited: boolean
  isPhysical: boolean
  isCustomized: boolean
  isCountdownTimerVisible: boolean

  memberShop: MemberShopProps | null
  specs: MerchandiseSpecProps[]
}

export type MerchandiseSpecBasicProps = {
  id: string
  title: string
  listPrice: number
  salePrice: number | null
}

export type MerchandiseSpecProps = MerchandiseSpecBasicProps & {
  quota: number
  buyableQuantity?: number
}

export type ShippingMethodType =
  | 'seven-eleven'
  | 'family-mart'
  | 'hi-life'
  | 'ok-mart'
  | 'home-delivery'
  | 'send-by-post'
  | 'other'

export type ShippingMethodProps = {
  id: ShippingMethodType
  enabled: boolean
  fee: number
  days: number
}

export type MemberShopProps = {
  id: string
  title: string
  shippingMethods: ShippingMethodProps[]
  pictureUrl?: string | null
}

export type OrderContact = {
  id: string
  message: string
  createdAt: Date
  member: {
    id: string
    name: string
    pictureUrl: string | null
  }
}

export type OrderLogWithMerchandiseSpecProps = {
  id: string
  createdAt: Date
  updatedAt: Date | null
  deliveredAt: Date | null
  deliverMessage: string | null
  shipping: ShippingProps | null
  invoice: InvoiceProps
  orderProducts: {
    id: string
    merchandiseSpecId: string
    quantity: number
    filenames: string[]
  }[]
}
