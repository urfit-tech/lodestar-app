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
  isPrivate: boolean
  totalDuration?: number
}

export type Program = ProgramBriefProps & {
  description: string | null
  coverVideoUrl: string | null
  isIssuesOpen: boolean
  isSoldOut: boolean | null
  isCountdownTimerVisible?: boolean
  isIntroductionSectionVisible?: boolean
}

export type ProgramRole = {
  id: string
  name: ProgramRoleName
  memberId: string
  memberName: string
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
  materialsCount?: number
}

export type ProgramContent = {
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
  videos?: { id: string; size: number; options: any }[]
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
}

export type QuestionProps = {
  id: string
  points: number
  description: string | null
  answerDescription: string | null
  isMultipleAnswers: boolean
  choices: ChoiceProps[]
  gainedPoints: number
}

export type ChoiceProps = {
  id: string
  description: string | null
  isCorrect: boolean
  isSelected: boolean
}
