import { useMutation, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { sum } from 'ramda'
import hasura from '../hasura'
import {
  ActivityProps,
  ActivityTicketProps,
  ActivityTicketSessionProps,
  ActivityTicketSessionType,
} from '../types/activity'
import { Category } from '../types/general'

export const usePublishedActivityCollection = (options?: { categoryId?: string }) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_PUBLISHED_ACTIVITY_COLLECTION>(
    gql`
      query GET_PUBLISHED_ACTIVITY_COLLECTION {
        activity(where: { published_at: { _is_null: false } }, order_by: [{ position: asc }, { published_at: desc }]) {
          id
          cover_url
          title
          published_at
          is_participants_visible
          organizer_id
          support_locales
          activity_categories {
            id
            category {
              id
              name
            }
          }
          activity_enrollments_aggregate {
            aggregate {
              count
            }
          }
          activity_sessions_aggregate {
            aggregate {
              min {
                started_at
              }
              max {
                ended_at
              }
            }
          }
          activity_tickets_aggregate {
            aggregate {
              sum {
                count
              }
            }
          }
        }
      }
    `,
  )

  const activities: (ActivityProps & {
    categories: Category[]
    participantCount: number
    totalSeats: number
  })[] =
    loading || error || !data
      ? []
      : data.activity
          .filter(activity =>
            options?.categoryId
              ? activity.activity_categories.some(category => category.category.id === options.categoryId)
              : activity,
          )
          .filter(activity => activity.published_at && new Date(activity.published_at).getTime() < Date.now())
          .map(activity => ({
            id: activity.id,
            coverUrl: activity.cover_url,
            title: activity.title,
            description: '',
            isParticipantsVisible: activity.is_participants_visible,
            publishedAt: new Date(activity.published_at),
            startedAt:
              activity.activity_sessions_aggregate.aggregate?.min?.started_at &&
              new Date(activity.activity_sessions_aggregate.aggregate.min.started_at),
            endedAt:
              activity.activity_sessions_aggregate.aggregate?.max?.ended_at &&
              new Date(activity.activity_sessions_aggregate.aggregate.max.ended_at),
            organizerId: activity.organizer_id,
            supportLocales: activity.support_locales,

            categories: activity.activity_categories.map(activityCategory => ({
              id: activityCategory.category.id,
              name: activityCategory.category.name,
            })),

            participantCount: activity.activity_enrollments_aggregate.aggregate?.count || 0,
            totalSeats: activity.activity_tickets_aggregate.aggregate?.sum?.count || 0,
          }))

  return {
    loadingActivities: loading,
    errorActivities: error,
    refetchActivities: refetch,
    activities,
  }
}

export const useEnrolledActivityTickets = (memberId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_ENROLLED_ACTIVITY_TICKETS,
    hasura.GET_ENROLLED_ACTIVITY_TICKETSVariables
  >(
    gql`
      query GET_ENROLLED_ACTIVITY_TICKETS($memberId: String!) {
        activity_ticket_enrollment(where: { member_id: { _eq: $memberId } }) {
          order_log_id
          order_product_id
          activity_ticket_id
        }
      }
    `,
    { variables: { memberId }, fetchPolicy: 'no-cache' },
  )

  const enrolledActivityTickets: {
    orderLogId: string
    orderProductId: string
    activityTicketId: string
  }[] =
    loading || error || !data
      ? []
      : data.activity_ticket_enrollment.map(ticketEnrollment => ({
          orderLogId: ticketEnrollment.order_log_id || '',
          orderProductId: ticketEnrollment.order_product_id || '',
          activityTicketId: ticketEnrollment.activity_ticket_id,
        }))

  return {
    loadingTickets: loading,
    errorTickets: error,
    refetchTickets: refetch,
    enrolledActivityTickets,
  }
}

export const useActivity = ({ activityId, memberId }: { activityId: string; memberId: string }) => {
  const { loading, error, data } = useQuery<hasura.GET_ACTIVITY, hasura.GET_ACTIVITYVariables>(
    gql`
      query GET_ACTIVITY($activityId: uuid!, $memberId: String!) {
        activity_by_pk(id: $activityId) {
          id
          organizer_id
          cover_url
          title
          description
          published_at
          activity_categories {
            id
            category {
              id
              name
            }
          }
          activity_sessions(order_by: { started_at: asc }) {
            id
          }
          activity_tickets(where: { is_published: { _eq: true } }, order_by: { started_at: asc }) {
            id
            count
            description
            started_at
            is_published
            ended_at
            price
            title
            activity_session_tickets {
              id
              activity_session_type
              activity_session {
                id
                title
              }
            }
            activity_ticket_enrollments_aggregate {
              aggregate {
                count
              }
            }
            activity_ticket_enrollments(where: { member_id: { _eq: $memberId } }) {
              order_log_id
              order_product_id
            }
          }
        }
      }
    `,
    {
      variables: {
        activityId,
        memberId,
      },
    },
  )

  const activity: {
    id: string
    title: string
    description: string | null
    coverUrl: string | null
    publishedAt: Date | null
    organizerId: string
    tickets: {
      id: string
      title: string
      price: number
      count: number
      description: string | null
      isPublished: boolean
      startedAt: Date
      endedAt: Date
      participants: number
      sessions: Pick<ActivityTicketSessionProps, 'id' | 'type' | 'title'>[]
      enrollments: { orderId: string; orderProductId: string }[]
    }[]
    categories: Category[]
    sessionIds: string[]
  } | null = data?.activity_by_pk
    ? {
        id: activityId,
        title: data.activity_by_pk.title,
        description: data.activity_by_pk.description,
        coverUrl: data.activity_by_pk.cover_url,
        publishedAt: data.activity_by_pk.published_at ? new Date(data.activity_by_pk.published_at) : null,
        organizerId: data.activity_by_pk.organizer_id,
        tickets: data.activity_by_pk.activity_tickets.map(v => ({
          id: v.id,
          title: v.title,
          price: v.price,
          count: v.count,
          description: v.description,
          startedAt: new Date(v.started_at),
          endedAt: new Date(v.ended_at),
          isPublished: v.is_published,
          sessions: v.activity_session_tickets.map(v => ({
            id: v.activity_session.id,
            type: v.activity_session_type as ActivityTicketSessionType,
            title: v.activity_session.title,
          })),
          participants: v.activity_ticket_enrollments_aggregate.aggregate?.count || 0,
          enrollments: v.activity_ticket_enrollments.map(v => ({
            orderId: v.order_log_id || '',
            orderProductId: v.order_product_id,
          })),
        })),
        categories: data.activity_by_pk.activity_categories.map(v => ({
          id: v.category.id,
          name: v.category.name,
        })),
        sessionIds: data.activity_by_pk.activity_sessions.map(v => v.id),
      }
    : null

  return {
    loading,
    error,
    activity,
  }
}

export const useActivitySession = ({ sessionId, memberId }: { sessionId: string; memberId: string }) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_ACTIVITY_SESSION, hasura.GET_ACTIVITY_SESSIONVariables>(
    gql`
      query GET_ACTIVITY_SESSION($sessionId: uuid!, $memberId: String!) {
        activity_session_by_pk(id: $sessionId) {
          id
          title
          started_at
          ended_at
          location
          online_link
          description
          threshold
          activity {
            is_participants_visible
          }
          activity_session_tickets {
            session_type: activity_session_type
            activity_ticket {
              count
            }
          }
          activity_enrollments(where: { member_id: { _eq: $memberId } }) {
            member_id
          }
          activity_enrollments_aggregate {
            aggregate {
              count
            }
          }
          ticket_enrollment_count {
            activity_offline_session_ticket_count
            activity_online_session_ticket_count
          }
        }
      }
    `,
    {
      variables: {
        sessionId,
        memberId,
      },
    },
  )

  const session: {
    id: string
    title: string
    startedAt: Date
    endedAt: Date
    location: string | null
    onlineLink: string | null
    description: string | null
    threshold: number | null
    isParticipantsVisible: boolean
    isEnrolled: boolean
    enrollmentAmount: { online: number; offline: number }
    maxAmount: { online: number; offline: number }
  } | null =
    loading || error || !data || !data.activity_session_by_pk
      ? null
      : {
          id: data.activity_session_by_pk.id,
          title: data.activity_session_by_pk.title,
          startedAt: new Date(data.activity_session_by_pk.started_at),
          endedAt: new Date(data.activity_session_by_pk.ended_at),
          location: data.activity_session_by_pk.location,
          onlineLink: data.activity_session_by_pk.online_link,
          description: data.activity_session_by_pk.description,
          threshold: data.activity_session_by_pk.threshold,
          isParticipantsVisible: data.activity_session_by_pk.activity.is_participants_visible,
          isEnrolled: data.activity_session_by_pk.activity_enrollments.length > 0,
          enrollmentAmount: {
            offline: data.activity_session_by_pk.ticket_enrollment_count?.activity_offline_session_ticket_count || 0,
            online: data.activity_session_by_pk.ticket_enrollment_count?.activity_online_session_ticket_count || 0,
          },
          maxAmount: {
            offline: sum(
              data.activity_session_by_pk.activity_session_tickets
                .filter(sessionTicket => sessionTicket.session_type === 'offline')
                .map(sessionTicket => sessionTicket.activity_ticket?.count || 0),
            ),
            online: sum(
              data.activity_session_by_pk.activity_session_tickets
                .filter(sessionTicket => sessionTicket.session_type === 'online')
                .map(sessionTicket => sessionTicket.activity_ticket?.count || 0),
            ),
          },
        }

  return {
    loadingSession: loading,
    errorSession: error,
    session,
    refetchSession: refetch,
  }
}

export const useActivityTicket = (ticketId: string) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_TICKET, hasura.GET_TICKETVariables>(
    gql`
      query GET_TICKET($ticketId: uuid!) {
        activity_ticket_by_pk(id: $ticketId) {
          id
          title
          description
          is_published
          started_at
          ended_at
          count
          price

          activity_session_tickets(order_by: { activity_session: { started_at: asc } }) {
            id
            activity_session_type
            activity_session {
              id
              title
              description
              location
              online_link
              started_at
              ended_at
              threshold
            }
          }

          activity {
            id
            title
            is_participants_visible
            cover_url
            published_at
            activity_categories {
              id
              category {
                id
                name
              }
              position
            }
          }
        }
      }
    `,
    {
      variables: { ticketId },
    },
  )

  const ticket:
    | (ActivityTicketProps & {
        sessions: ActivityTicketSessionProps[]
        activity: Pick<ActivityProps, 'id' | 'title' | 'coverUrl'> & {
          categories: (Category & { position: number })[]
        }
      })
    | null =
    loading || error || !data || !data.activity_ticket_by_pk
      ? null
      : {
          id: data.activity_ticket_by_pk.id,
          startedAt: new Date(data.activity_ticket_by_pk.started_at),
          endedAt: new Date(data.activity_ticket_by_pk.ended_at),
          price: data.activity_ticket_by_pk.price,
          count: data.activity_ticket_by_pk.count,
          description: data.activity_ticket_by_pk.description,
          isPublished: data.activity_ticket_by_pk.is_published,
          title: data.activity_ticket_by_pk.title,
          sessions: data.activity_ticket_by_pk.activity_session_tickets.map(activitySessionTicket => ({
            id: activitySessionTicket.activity_session.id,
            type: activitySessionTicket.activity_session_type as ActivityTicketSessionType,
            title: activitySessionTicket.activity_session.title,
            description: activitySessionTicket.activity_session.description,
            threshold: activitySessionTicket.activity_session.threshold,
            startedAt: new Date(activitySessionTicket.activity_session.started_at),
            endedAt: new Date(activitySessionTicket.activity_session.ended_at),
            location: activitySessionTicket.activity_session.location,
            onlineLink: activitySessionTicket.activity_session.online_link,
            activityId: data.activity_ticket_by_pk?.activity.id || '',
          })),
          activity: {
            id: data.activity_ticket_by_pk.activity.id,
            title: data.activity_ticket_by_pk.activity.title,
            coverUrl: data.activity_ticket_by_pk.activity.cover_url,
            categories: data.activity_ticket_by_pk.activity.activity_categories.map(activityCategory => ({
              id: activityCategory.category.id,
              name: activityCategory.category.name,
              position: activityCategory.position,
            })),
          },
        }

  return {
    loadingTicket: loading,
    errorTicket: error,
    ticket,
    refetchTicket: refetch,
  }
}

export const useActivityAttendance = (memberId: string, activityTicketId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_ACTIVITY_ATTENDANCE,
    hasura.GET_ACTIVITY_ATTENDANCEVariables
  >(
    gql`
      query GET_ACTIVITY_ATTENDANCE($memberId: String!, $activityTicketId: uuid!) {
        activity_enrollment(where: { member_id: { _eq: $memberId }, activity_ticket_id: { _eq: $activityTicketId } }) {
          activity_session_id
          attended
        }
      }
    `,
    {
      variables: {
        memberId,
        activityTicketId,
      },
    },
  )

  const attendance: { [sessionId: string]: boolean } = {}

  data &&
    data.activity_enrollment.forEach(enrollment => {
      enrollment.attended && (attendance[enrollment.activity_session_id as string] = enrollment.attended)
    })

  return {
    loadingAttendance: loading,
    errorAttendance: error,
    attendance,
    refetchAttendance: refetch,
  }
}

export const useAttendSession = () => {
  const [attendActivitySession] = useMutation<hasura.ATTEND_ACTIVITY_SESSION, hasura.ATTEND_ACTIVITY_SESSIONVariables>(
    gql`
      mutation ATTEND_ACTIVITY_SESSION($orderProductId: uuid!, $activitySessionId: uuid!) {
        insert_activity_attendance(
          objects: { order_product_id: $orderProductId, activity_session_id: $activitySessionId }
        ) {
          affected_rows
        }
      }
    `,
  )

  const [leaveActivitySession] = useMutation(gql`
    mutation LEAVE_ACTIVITY_SESSION($orderProductId: uuid!, $activitySessionId: uuid!) {
      delete_activity_attendance(
        where: { order_product_id: { _eq: $orderProductId }, activity_session_id: { _eq: $activitySessionId } }
      ) {
        affected_rows
      }
    }
  `)

  return {
    attendActivitySession,
    leaveActivitySession,
  }
}
