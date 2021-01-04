import { CategoryProps } from './general'

type ProjectSectionProps = {
  id: string
  type: string
  options: any
}

export type FundingCommentProps = {
  name: string
  title?: string
  avatar: string
  description: string
}

export type ProjectPlanBasicProps = {
  id: string
  coverUrl: string | null
  title: string
  description: string | null

  isSubscription: boolean
  periodAmount: number | null
  periodType: string | null // Y / M / W / D
  listPrice: number
  salePrice: number | null
  soldAt: Date | null
  discountDownPrice: number

  createdAt: Date
}
export type ProjectPlanProps = ProjectPlanBasicProps & {
  projectTitle: string

  isParticipantsVisible: boolean
  isPhysical: boolean
  isLimited: boolean
  isEnrolled?: boolean
  isExpired?: boolean

  buyableQuantity: number | null
  projectPlanEnrollmentCount: number
}

export type ProjectBasicProps = {
  id: string
  type: string
  title: string
  coverType: string
  coverUrl: string | null
  previewUrl: string | null
  abstract: string | null
  description: string | null
  targetAmount: number
  targetUnit: 'funds' | 'participants'
  expiredAt: Date | null

  isParticipantsVisible: boolean
  isCountdownTimerVisible: boolean
  totalSales: number
  enrollmentCount: number
  categories: CategoryProps[]
}
export type ProjectIntroProps = ProjectBasicProps & {
  projectPlans?: ProjectPlanBasicProps[]
}

export type ProjectProps = ProjectBasicProps & {
  template: string | null
  introduction: string | null
  updates: any
  comments: any
  contents: any

  createdAt: Date
  publishedAt: Date | null

  projectSections: ProjectSectionProps[]
  projectPlans?: ProjectPlanProps[]
}
