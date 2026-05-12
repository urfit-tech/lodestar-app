import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { createLodestarServerClient } from 'lodestar-app-element/src/services/http'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { MemberRightActivityTicket } from '../types/activity'

export const useMemberRightActivityTicket = (
  activityTicketId: string,
  sessionId: string | null | undefined,
  memberId: string | undefined | null,
) => {
  const { currentMemberId, authToken } = useAuth()
  const lodestarServerClient = useMemo(() => createLodestarServerClient(), [])
  const [data, setData] = useState<MemberRightActivityTicket | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const convertToMemberRightActivityTicket = (rawData: any): MemberRightActivityTicket => {
    return {
      id: rawData.id,
      activity: {
        id: rawData?.activity?.id,
        title: rawData?.activity?.title,
        coverUrl: rawData?.activity?.coverUrl,
        categories: rawData?.activity?.categories,
        isParticipantsVisible: rawData?.activity?.isParticipantsVisible,
      },
      sessions: rawData.sessions.map((session: any) => ({
        id: session?.id,
        startedAt: session?.startedAt,
        endedAt: session?.endedAt,
        location: session?.location,
        description: session?.description,
        threshold: session?.threshold,
        onlineLink: session?.onlineLink,
        title: session?.title,
        maxAmount: session?.maxAmount,
        participants: session?.participants,
        isEnrolled: session?.isEnrolled,
        type: session?.type,
        attended: session?.attended,
      })),
      invoice: {
        name: rawData?.invoice?.name,
        email: rawData?.invoice?.email,
        phone: rawData?.invoice?.phone,
        orderProductId: rawData?.invoice?.orderProductId,
      },
    }
  }

  const getMemberActivityTicketEquity = useCallback(
    async (activityTicketId: string) => {
      if (currentMemberId && activityTicketId) {
        const route = `/equity/activity_ticket`

        setLoading(true)
        try {
          const data = await lodestarServerClient.get<any>(route, {
            params: {
              activityTicketId: activityTicketId,
              ...(memberId ? { memberId: memberId } : {}),
              ...(sessionId ? { sessionId: sessionId } : {}),
            },
            headers: { authorization: `Bearer ${authToken}` },
          })

          if (data) {
            const convertedData = convertToMemberRightActivityTicket(data)
            setData(convertedData)
          } else {
            console.error('No data returned or status code is not 200.')
            setData(null)
          }
        } catch (err) {
          console.log(err)
          setData(null)
        } finally {
          setLoading(false)
        }
      }
    },
    [authToken, currentMemberId, lodestarServerClient, memberId, sessionId],
  )

  useEffect(() => {
    getMemberActivityTicketEquity(activityTicketId)
  }, [activityTicketId, getMemberActivityTicketEquity, memberId])

  return {
    activityTicketData: data,
    activityTicketDataLoading: loading,
    refetchActivityTicketData: fetch,
  }
}
