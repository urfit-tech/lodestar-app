import { Category } from './general'

type BaseActivity = {
  id: string
  description: string | null
  coverUrl: string | null
  title: string
  tags: string[]
  categories: Category[]
  isParticipantsVisible: boolean
  publishedAt: Date | null
  organizerId: string
  supportLocales: string[] | null
  participantCount: number
  totalSeats: number
  startedAt: Date | null
  endedAt: Date | null
}

type BaseActivityTicket = {
  id: string
  title: string
  startedAt: Date
  endedAt: Date
  currencyId: string
  price: number
  count: number
  description: string | null
  isPublished: boolean
  participants: number
  enrollments: { orderId: string; orderProductId: string }[]
}

type BaseActivitySession = {
  id: string
  title: string
  type: 'offline' | 'online'
  description: string | null
  threshold: number | null
  startedAt: Date
  endedAt: Date
  location: string | null
  onlineLink: string | null
}

export type Activity = BaseActivity & {
  sessions: BaseActivitySession[]
  tickets: BaseActivityTicket[]
  ticketSessions: { ticket: BaseActivityTicket; session: BaseActivitySession }[]
}

export type ActivitySession = BaseActivitySession & {
  activity: BaseActivity
  tickets: BaseActivityTicket[]
}

export type ActivityTicket = BaseActivityTicket & {
  activity: BaseActivity
  sessions: BaseActivitySession[]
}

export type ActivityFromLodestarAPI = {
  id: string
  title: string
  organizerId: string
  description: string | null
  isParticipantsVisible: boolean
  coverUrl: string | null
  publishedAt: string | null
  supportLocales: Array<string> | null
  activityTags: ActivityTag[]
  activityCategories: ActivityCategory[]
  activityTickets: {
    id: string
    title: string
    startedAt: Date
    endedAt: Date
    currencyId: string
    price: number
    count: number
    description: string | null
    isPublished: boolean
    orderId: string | null
    orderProductId: string | null
    participants: number
    activitySessionTickets: ActivitySessionTicket[]
  }[]
}

export type ActivitySessionTicket = {
  id: string
  activitySessionType: 'offline' | 'online'
  activitySession: {
    id: string
    startedAt: string
    endedAt: string
    location: string | null
    description: string | null
    threshold: string | null
    onlineLink: string | null
    attended: boolean
    title: string
  }
}

export type ActivityTag = {
  id: string
  activityTagName: string
}

export type ActivityCategory = {
  id: string
  category: { name: string; id: string }
}

export type ActivitySessionTicketEnrollment = {
  activityTicketId: string
  orderId: string | null
  orderProductId: string | null
  activitySession: {
    id: string
    title: string
    endedAt: string
    startedAt: string
    location: string | null
    onlineLink: string | null
    activityTitle: string
    activityCoverUrl: string | null
  }[]
}
