export type CouponFromLodestarAPI = {
  id: string
  memberId: string
  createdAt: string
  couponCode: CouponCode
  status: CouponStatus
}

export type CouponStatus = {
  outdated: boolean
  used: boolean
}

export type CouponCode = {
  id: string
  code: string
  deletedAt: string | null
  couponPlan: CouponPlan
  appId: string
}

export type CouponPlan = {
  id: string
  title: string
  description: string | null
  startedAt: string | null
  endedAt: string | null
  type: number // 1 - cash / 2 - percent
  constraint: string | null
  amount: number
  scope: string[] | null
  couponPlanProducts: CouponPlanProduct[]
}

export type CouponPlanProduct = {
  id: string
  couponPlanId: string
  productId: string
}
