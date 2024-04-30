import { Category, MetaTag } from './general'

export type ProgramPlanType = 'subscribeFromNow' | 'subscribeAll' | 'unknown'
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
  coverMobileUrl: string | null
  coverThumbnailUrl: string | null
  title: string
  abstract: string | null
  publishedAt: Date | null
  isPrivate: boolean
  totalDuration?: number
  isEnrolledCountVisible?: boolean
  editors?: string[]
}

export type EquityProgram = {
  id: string
  title: string
  coverUrl: string | null
  coverMobileUrl: string | null
  coverThumbnailUrl: string | null
  abstract: string | null
}

export type EquityPrograms = {
  id: string
  title: string
  coverUrl: string | null
  coverMobileUrl: string | null
  coverThumbnailUrl: string | null
  abstract: string | null
  roles: ProgramRole[]
  viewRate: number
  lastViewedAt: Date
  deliveredAt: Date
}[]

export type Program = ProgramBriefProps & {
  description: string | null
  coverVideoUrl: string | null
  metaTag: MetaTag
  isIssuesOpen: boolean
  isSoldOut: boolean | null
  isCountdownTimerVisible?: boolean
  isIntroductionSectionVisible?: boolean
  categories: Category[]
  tags: string[]
  roles: ProgramRole[]
  plans: (ProgramPlan & {
    isSubscription: boolean
    groupBuyingPeople: number
  })[]
  contentSections: (ProgramContentSection & {
    contents: (ProgramContent & { programId?: string; contentSectionTitle?: string })[]
  })[]
}

export type ProgramPreview = {
  id: string
  coverUrl: string | null
  coverMobileUrl: string | null
  coverThumbnailUrl: string | null
  title: string
  abstract: string | null
  roles: ProgramRole[]
}

export type ProgramRole = {
  id: string
  name: ProgramRoleName
  memberId: string
  memberName: string
  createdAt?: Date
}

export type ProgramPlan = {
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

export type ProgramContentSection = {
  id: string
  title: string
  description: string | null
  collapsed_status: boolean
  // materialsCount?: number
}

export type DisplayMode = keyof typeof DisplayModeEnum

export enum DisplayModeEnum {
  conceal = 'conceal',
  trial = 'trial',
  loginToTrial = 'loginToTrial',
  payToWatch = 'payToWatch',
}

type Videos = {
  id: string
  size: number
  options: { cloudflare?: object }
  data: { source?: string }
}[]

export type ProgramContent = {
  id: string
  title: string
  abstract: string | null
  metadata: any
  duration: number | null
  contentType: string | null
  publishedAt: Date | null
  displayMode: DisplayMode
  listPrice: number | null
  salePrice: number | null
  soldAt: Date | null
  videos: Videos
  audios: { data: object }[]
  contentBodyId: string
  ebook: ProgramContentEbook
  pinnedStatus: boolean
}

type MetaData = {
  private: boolean
  difficulty: number
  isCoverRequired: boolean
}

export type ProgramContentResponse = {
  appId: string
  id: string
  title: string
  abstract: string | null
  contentBodyId: string
  publishedAt: Date | null
  duration: number | null
  displayMode: DisplayMode
  contentType: string | null
  contentSectionTitle: string
  audios: { data: object }[]
  videos: Videos
  attachments: ProgramContentAttachmentProps[]
  programContentBody: ProgramContentBodyProps
  metadata: MetaData | null
  listPrice: number | null
  salePrice: number | null
  soldAt: Date | null
  pinnedStatus: boolean
  isEquity: boolean
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

export type ProgramContentMaterial = {
  id: string
  data: {
    name: string
    size: number
    type: string
    lastModified: number
    url?: string
  }
  createdAt: Date
  programContentId: string
}

export type ProgramContentAttachmentProps = {
  id: string
  data: any
  options: any
  createdAt: Date
}

export type ExerciseProps = {
  id: string
  isAvailableToGoBack: boolean
  isAvailableToRetry: boolean
  passingScore: number
  questions: QuestionProps[]
  startedAt?: Date
  endedAt?: Date
  timeLimitUnit?: string
  timeLimitAmount?: number
  isAvailableAnnounceScore?: boolean
  isAnswerer?: boolean
}

export type QuestionProps = {
  id: string
  points: number
  description: string | null
  answerDescription: string | null
  isMultipleAnswers: boolean
  layout?: 'column' | 'grid'
  font?: string
  choices: ChoiceProps[]
  gainedPoints: number
}

export type ChoiceProps = {
  id: string
  description: string | null
  isCorrect: boolean
  isSelected: boolean
}

export type ProgramContentLog = {
  createdAt: Date
}[]

export type ProgramEnrollment = Pick<
  Program,
  'id' | 'abstract' | 'coverMobileUrl' | 'coverUrl' | 'roles' | 'title' | 'coverThumbnailUrl'
> & {
  viewRate: number
  deliveredAt: Date | null
  lastViewedAt: Date | null
}

export type ProgramContentEbook = {
  id: string
  data: any
  programContentEbookTocs: ProgramContentEbookToc[]
}

export type ProgramContentEbookToc = {
  id: string
  label: string
  href: string
  position: number
  subitems?: ProgramContentEbookToc[]
}
