import { ProductGiftPlan } from '../types/gift'

export type OrderProductProps = {
  productId: string
  name: string
  description: string
  price: number
  endedAt: Date | null
  startedAt: Date | null
  autoRenewed: boolean
  options?: {
    quantity?: number
    currencyId?: string
    currencyPrice?: number
    productGiftPlan?: ProductGiftPlan
  }
}

export type OrderDiscountProps = {
  name: string
  type: string | null
  target: string | null
  description: string | null
  price: number
  options: { [key: string]: any } | null
}

export type ShippingOptionProps = {
  id: string
  fee: number
  days: number
  enabled: boolean
}

export type ShippingOptionIdType = 'sevenEleven' | 'familyMart' | 'okMart' | 'sendByPost' | 'homeDelivery'

export type CheckProps = {
  orderProducts: OrderProductProps[]
  orderDiscounts: OrderDiscountProps[]
  shippingOption: ShippingOptionProps | null
}

export type CartProductProps = {
  productId: string
  shopId: string
  enrollments?: {
    memberId: string | null
    isPhysical: boolean | null
  }[]
  options?: { [key: string]: any }
}

export type CouponProps = {
  id: string
  status: {
    used: boolean
    outdated: boolean
  }
  couponCode: {
    code: string
    couponPlan: {
      id: string
      startedAt: Date | null
      endedAt: Date | null
      type: 'cash' | 'percent'
      constraint: number
      amount: number
      title: string
      description: string | null
      scope: string[] | null
      productIds?: string[]
    }
  }
}

export type ShippingProps = {
  name?: string
  phone?: string
  zipCode?: string
  city?: string
  district?: string
  address?: string
  isOutsideTaiwanIsland?: string
  shippingMethod?: string
  specification?: string
  storeId?: string
  storeName?: string
}

export type InvoiceProps = {
  name: string
  phone: string
  email: string
  phoneBarCode?: string
  citizenCode?: string
  uniformNumber?: string
  uniformTitle?: string
  donationCode?: string
  postCode?: string
  address?: string
  referrerEmail?: string
}

export type PaymentMethodType = 'credit' | 'vacc' | 'cvs' | 'instflag' | 'unionpay' | 'webatm' | 'barcode'
export type PaymentGatewayType = 'spgateway' | 'tappay' | 'parenting' | 'paypal' | 'commonhealth'
