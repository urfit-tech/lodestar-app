export interface CoursePackageSummary {
  id: string
  name: string
  language: string
  totalLessons: number
  completedLessons: number
  expiryDate: string
  paymentStatus: 'Paid' | 'Unpaid' | 'Pending'
}

export enum CalendarEventStatus {
  Published = '已發布',
  Scheduled = '已預排',
}

export enum CourseType {
  Private = 'Private',
  Group = 'Group',
  Term = 'Term',
}

export interface CalendarEvent {
  id: string
  title: string
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
  startTime: string
  endTime: string
  date: string
  teacher: string
  location: string
  isExternal: boolean
  status: CalendarEventStatus
  courseType: CourseType
  students?: string[]
  needOnlineRoom?: boolean
  hostMemberId?: string
  materialLink?: string
  materialName?: string
  classGroupId?: string
  language?: string
  orderIds?: string[]
  studentIds?: string[]
  teacherId?: string
  material?: string
  scheduleType?: string
  startedAt?: string
}

export interface TeachingCourseSummary {
  id: string
  name: string
  language: string
  students: string[]
  completedLessons: number
  totalScheduledLessons: number
  primaryMaterial: string
}

export type ViewAs = 'student' | 'teacher'

export type CalendarViewType = 'day' | 'week' | 'month' | 'list'
