import { PeriodType } from '../types/program'
import { Category, MetaTag } from './general'

export type ProgramPackageProps = {
  id: string
  title: string
  coverUrl: string | null
  description: string | null
  metaTag?: MetaTag
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

export type ProgramPackageProgram = {
  id: string
  title: string
  coverUrl?: string | null
  categories: Category[]
}

export type ProgramPackage = ProgramPackageProps & {
  programs: ProgramPackageProgram[]
  plans: ProgramPackagePlanProps[]
}

export type ProgramPackageEnrollment = Pick<ProgramPackageProps, 'id' | 'coverUrl' | 'title'> & {
  viewRate: number
  deliveredAt: Date | null
  lastViewedAt: Date | null
}
