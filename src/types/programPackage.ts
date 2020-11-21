import { PeriodType } from '../types/program'

export type ProgramPackageProps = {
  id: string
  title: string
  coverUrl: string | null
  description: string | null
}

export type ProgramPackagePlanProps = {
  id: string
  title: string
  description: string | null
  isSubscription: boolean
  isParticipantsVisible: boolean
  periodAmount: number
  periodType: PeriodType
  listPrice: number
  salePrice: number | null
  soldAt: Date | null
  discountDownPrice: number | null
  enrollmentCount: number
}

export type ProgramPackageProgramProps = {
  id: string
  title: string
  coverUrl?: string | null
  categories: {
    id: string
    name: string
  }[]
}
