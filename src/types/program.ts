type ProgramPlanType = 'subscribeFromNow' | 'subscribeAll' | 'unknown'
export type ProgramRoleName = 'owner' | 'instructor' | 'assistant'

export type PeriodType = 'D' | 'W' | 'M' | 'Y'

export type CurrencyProps = {
  id: string
  label: string
  unit: string
  name: string
}

export type ProgramBriefProps = {
  id: string
  coverUrl: string | null
  title: string
  abstract: string | null
  publishedAt: Date | null
  isSubscription: boolean
  isPrivate: boolean
  listPrice: number | null
  salePrice: number | null
  soldAt: Date | null

  totalDuration?: number
}

export type ProgramProps = ProgramBriefProps & {
  description: string | null
  coverVideoUrl: string | null
  isIssuesOpen: boolean
  isSoldOut: boolean | null
  isCountdownTimerVisible?: boolean
}

export type ProgramRoleProps = {
  id: string
  name: ProgramRoleName
  memberId: string
}

export type ProgramPlanProps = {
  id: string
  type: ProgramPlanType
  title: string
  description: string | null
  gains: string | null

  currency: CurrencyProps
  listPrice: number
  salePrice: number | null
  soldAt: Date | null
  discountDownPrice: number
  periodAmount: number
  periodType: PeriodType
  startedAt: Date | null
  endedAt: Date | null
  isParticipantsVisible: boolean
  publishedAt: Date | null
  isCountdownTimerVisible?: boolean
}

export type ProgramContentSectionProps = {
  id: string
  title: string
  description: string | null
  materialsCount?: number
}

export type ProgramContentProps = {
  id: string
  title: string
  abstract: string | null
  metadata: any
  duration: number | null
  contentType: string | null
  publishedAt: Date | null

  listPrice: number | null
  salePrice: number | null
  soldAt: Date | null
  materials?: ProgramContentMaterialProps[]
}

export type ProgramContentBodyProps = {
  id: string
  type: string | null
  description: string | null
  data: any
}

export type ProgramContentMaterialProps = {
  id: string
  data: any
  createdAt: Date
}
