import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { getMemberRightActivityTicketList } from './api/activityTicketServer'

type ActivityTicket = {
  id: string
  activity: {
    id: string
    title: string
    coverUrl: string
    categories: { id: string; name: string }[]
  }
}

type ActivitySession = {
  id: string
  startedAt: string
  endedAt: string
  location: string | null
  description: string | null
  threshold: string | null
  onlineLink: string | null
  title: string
  maxAmount: { online: number; offline: number }
  participants: { online: number; offline: number }
  isEnrolled: boolean
  type: 'both' | 'offline' | 'online'
}

type Invoice = {
  name: string
  email: string
  phone: string
  orderProductId: string
}

export type MemberRightActivityTicket = ActivityTicket & { sessions: ActivitySession[] } & Invoice

export type FetchMemberRightActivityTicketDTO = {
  memberId: string
  activityTicketId: string
  sessionId?: string
}

export const useActivityTicketModel = () => {
  const { authToken } = useAuth()

  const fetchMemberRightActivityTicketList = async (
    dto: FetchMemberRightActivityTicketDTO,
  ): Promise<MemberRightActivityTicket[]> => {
    if (!authToken) {
      return []
    }
    const { error, data } = await getMemberRightActivityTicketList(dto, authToken)
    if (error) {
      throw error
    }
    return data || []
  }

  return {
    fetchMemberRightActivityTicketList,
  }
}
