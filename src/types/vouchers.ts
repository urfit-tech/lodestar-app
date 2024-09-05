export type VoucherProps = {
  id: string
  title: string
  description: string | null
  startedAt?: Date
  endedAt?: Date
  productQuantityLimit: number
  available: boolean
  extra?: React.ReactNode
  action?: React.ReactNode
  isTransferable?: boolean
  voucherCode: {
    id: string
    code: string
    deletedAt?: Date | null
  }
  status: {
    outdated?: boolean | null
    used?: boolean | null
  }
}

export type EnrolledVoucher = VoucherProps & {
  productIds: string[]
  voucherPlanId: string
  extra?: React.ReactNode
}

export type VoucherFromAPI = {
  id: string
  memberId: string
  createdAt: string
  voucherCode: VoucherCode
  status: VoucherStatus
}

export type VoucherStatus = {
  outdated: boolean
  used: boolean
}

export type VoucherCode = {
  id: string
  code: string
  count: number
  remaining: number
  deletedAt: string | null
  voucherPlan: VoucherPlan
}

export type VoucherPlan = {
  id: string
  appId: string
  title: string
  description: string | null
  startedAt: string | null
  endedAt: string | null
  productQuantityLimit: number
  isTransferable: boolean
  voucherPlanProducts: VoucherPlanProduct[]
}

export type VoucherPlanProduct = {
  id: string
  voucherPlanId: string
  productId: string
}
