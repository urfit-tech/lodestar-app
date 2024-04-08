import axios from 'axios'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useCallback, useEffect, useState } from 'react'
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
  attended: boolean
}

type Invoice = {
  name: string
  email: string
  phone: string
  orderProductId: string
}

export type MemberRightActivityTicket = ActivityTicket & { sessions: ActivitySession[] } & { invoice: Invoice }

export const useMemberRightActivityTicket = (activityTicketId: string) => {
  const { currentMemberId, authToken } = useAuth()
  const [data, setData] = useState<MemberRightActivityTicket | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const fetch = useCallback(
    async (activityTicketId: string) => {
      if (currentMemberId && activityTicketId) {
        const route = `/activity/member_right`

        setLoading(true)
        try {
          const { data } = await axios.get(`${process.env.REACT_APP_LODESTAR_SERVER_ENDPOINT}${route}`, {
            params: { memberId: currentMemberId, activityTicketId: activityTicketId },
            headers: { authorization: `Bearer ${authToken}` },
          })

          setData(data)
        } catch (err) {
          console.log(err)
        } finally {
          setLoading(false)
        }
      }
    },
    [currentMemberId, activityTicketId],
  )

  useEffect(() => {
    fetch(activityTicketId)
  }, [fetch])

  return {
    activityTicketData: data,
    activityTicketDataLoading: loading,
    refetchActivityTicketData: fetch,
  }
}
