import axios from 'axios'
import { FetchMemberRightActivityTicketDTO, MemberRightActivityTicket } from '../activityTicketModel'

export const getMemberRightActivityTicketList = async (
  dto: FetchMemberRightActivityTicketDTO,
  authToken: string,
): Promise<{ error: Error | null; result: boolean; data?: MemberRightActivityTicket[] }> => {
  try {
    const queryParams = new URLSearchParams(dto).toString()
    const route = '/activity/ticket/member_right'

    const response = await axios.get(`${process.env.REACT_APP_LODESTAR_SERVER_ENDPOINT}${route}?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    const memberRightActivityTicketData = response.data

    if (memberRightActivityTicketData && memberRightActivityTicketData.length > 0) {
      const memberRightActivityTicketList: MemberRightActivityTicket[] = memberRightActivityTicketData.map(
        (item: any) => ({
          id: item.id,
          activity: {
            id: item.activity.id,
            title: item.activity.title,
            coverUrl: item.activity.coverUrl,
            categories: item.activity.categories,
          },
          sessions: item.sessions.map((session: any) => ({
            id: session.id,
            startedAt: session.startedAt,
            endedAt: session.endedAt,
            location: session.location,
            description: session.description,
            threshold: session.threshold,
            onlineLink: session.onlineLink,
            title: session.title,
            maxAmount: session.maxAmount,
            participants: session.participants,
            isEnrolled: session.isEnrolled,
            type: session.type,
          })),
          name: item.name,
          email: item.email,
          phone: item.phone,
          orderProductId: item.orderProductId,
        }),
      )

      return { error: null, result: true, data: memberRightActivityTicketList }
    } else {
      return { error: new Error('No member right activity ticket found'), result: false }
    }
  } catch (error) {
    const errorInstance = error instanceof Error ? error : new Error(String(error))
    return { error: errorInstance, result: false }
  }
}
