type QuestionOption = {
  id: string
  value: string
  isAnswer: boolean | null
  isSelected?: boolean
}

export type Question = {
  id: string
  type: string
  subject: string
  layout: string
  font: string
  explanation: string | null
  questionOptions?: QuestionOption[]
  gainedPoints: number
  startedAt: Date | null
  endedAt: Date | null
}

type QuestionGroup = {
  id: string
  title: string
  amount: number
  questions?: Question[]
}

export type ExamTimeUnit = 'd' | 'h' | 'm'

export type Exam = {
  id: string
  point: number
  passingScore: number
  examinableUnit: ExamTimeUnit | null
  examinableAmount: number | null
  examinableStartedAt: Date | null
  examinableEndedAt: Date | null
  timeLimitUnit: ExamTimeUnit | null
  timeLimitAmount: number | null
  isAvailableToRetry: boolean
  isAvailableToGoBack: boolean
  isAvailableAnnounceScore: boolean
  questionGroups: QuestionGroup[]
}

export type ExercisePublic = {
  exerciseId: string
  programContentId: string
  memberId?: string
  startedAt: Date | null
  endedAt: Date | null
  questionId?: string | null
  questionPoints: number
  gainedPoints: number
  isCorrect: boolean
  questionStartedAt: Date | null
  questionEndedAt: Date | null
  duration: number
  choiceIds: string[]
}

export type Exercise = {
  id: string
  answer: any
  memberId: string
  startedAt: Date | null
  endedAt: Date | null
} | null
