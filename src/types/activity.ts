export type ActivityProps = {
  id: string
  coverUrl: string | null
  title: string
  isParticipantsVisible: boolean
  publishedAt: Date
  startedAt: Date | null
  endedAt: Date | null
  organizerId: string
  supportLocales: string[] | null
}

type ActivitySessionProps = {
  id: string
  title: string
  description: string | null
  threshold: number | null
  startedAt: Date
  endedAt: Date
  location: string | null
  onlineLink: string | null
  activityId: string
}

export type ActivityTicketProps = {
  id: string
  title: string
  startedAt: Date
  endedAt: Date
  currencyId: string
  price: number
  count: number
  description: string | null
  isPublished: boolean
}

export type ActivityTicketSessionType = 'offline' | 'online'

export type ActivityTicketSessionProps = ActivitySessionProps & {
  type: ActivityTicketSessionType
}
