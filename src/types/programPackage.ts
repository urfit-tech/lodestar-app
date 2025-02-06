import { PeriodType } from '../types/program'
import { Category, MetaTag } from './general'

export type ProgramPackageProps = {
  id: string
  title: string
  coverUrl: string | null
  description: string | null
  metaTag?: MetaTag
  publishedAt: Date | null
  tags: string[]
}

export type ProgramPackagePlanProps = {
  id: string
  title: string
  description: string | null
  isSubscription: boolean
  isParticipantsVisible: boolean
  isCountdownTimerVisible: boolean
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
  coverThumbnailUrl?: string | null
  viewRate?: number
  categories: Category[]
}

export type ProgramPackage = ProgramPackageProps & {
  programs: ProgramPackageProgram[]
  plans: ProgramPackagePlanProps[]
}

export type ProgramPackageEnrollment = Pick<ProgramPackageProps, 'id' | 'coverUrl' | 'title' | 'tags'> & {
  viewRate: number
  deliveredAt: Date | null
  lastViewedAt: Date | null
}

export type EnrolledProgramPackages = {
  id: string
  coverUrl: string | undefined
  title: string
  enrolledPlans: { id: string; isTempoDelivery: boolean }[]
  programs: { id: string; isDelivered: boolean }[]
  totalDuration: number
}[]
