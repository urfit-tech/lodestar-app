import { gql, useMutation, useQuery } from '@apollo/client'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import moment from 'moment'
import hasura from '../hasura'
import { AppointmentPeriod, AppointmentPlan, ReservationType } from '../types/appointment'

export const useAppointmentPlanCollection = (memberId: string, startedAt: Date, currentMemberId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_APPOINTMENT_PLAN_COLLECTION,
    hasura.GET_APPOINTMENT_PLAN_COLLECTIONVariables
  >(
    gql`
      query GET_APPOINTMENT_PLAN_COLLECTION($memberId: String!, $currentMemberId: String, $startedAt: timestamptz) {
        appointment_plan(where: { creator_id: { _eq: $memberId }, published_at: { _is_null: false } }) {
          id
          title
          description
          duration
          price
          support_locales
          is_private
          reservation_amount
          reservation_type
          capacity
          reschedule_amount
          reschedule_type
          default_meet_gateway
          meet_generation_method
          currency {
            id
            label
            unit
            name
          }
          appointment_enrollments(where: { member_id: { _eq: $currentMemberId } }) {
            member_id
            appointment_plan_id
            started_at
            canceled_at
          }
          appointment_periods(where: { started_at: { _gt: $startedAt } }, order_by: { started_at: asc }) {
            started_at
            ended_at
            booked
            available
          }
        }
      }
    `,
    { variables: { memberId, startedAt, currentMemberId } },
  )

  const appointmentPlans: (AppointmentPlan & {
    periods: AppointmentPeriod[]
  })[] =
    loading || error || !data
      ? []
      : data.appointment_plan.map(appointmentPlan => ({
          id: appointmentPlan.id,
          title: appointmentPlan.title,
          description: appointmentPlan.description || '',
          duration: appointmentPlan.duration,
          price: appointmentPlan.price,
          phone: null,
          supportLocales: appointmentPlan.support_locales,
          capacity: appointmentPlan.capacity,
          defaultMeetGateway: appointmentPlan.default_meet_gateway,
          meetGenerationMethod: appointmentPlan.meet_generation_method,
          currency: {
            id: appointmentPlan.currency.id,
            label: appointmentPlan.currency.label,
            unit: appointmentPlan.currency.unit,
            name: appointmentPlan.currency.name,
          },
          rescheduleAmount: appointmentPlan.reschedule_amount,
          rescheduleType: appointmentPlan.reschedule_type as ReservationType,
          periods: appointmentPlan.appointment_periods.map(period => ({
            id: `${period.started_at}`,
            startedAt: new Date(period.started_at),
            endedAt: new Date(period.ended_at),
            booked: period.booked,
            available: !!period.available,
            isBookedReachLimit: appointmentPlan.capacity !== -1 && period.booked >= appointmentPlan.capacity,
            currentMemberBooked: appointmentPlan.appointment_enrollments.some(
              enrollment =>
                enrollment.member_id === currentMemberId &&
                enrollment.appointment_plan_id === appointmentPlan.id &&
                enrollment.started_at === period.started_at &&
                !enrollment.canceled_at,
            ),
          })),
          isPrivate: appointmentPlan.is_private,
          reservationAmount: appointmentPlan.reservation_amount,
          reservationType: (appointmentPlan.reservation_type as ReservationType) || 'hour',
        }))

  return {
    loadingAppointmentPlans: loading,
    errorAppointmentPlans: error,
    appointmentPlans,
    refetchAppointmentPlans: refetch,
  }
}

export const useAppointmentPlan = (appointmentPlanId: string, currentMemberId?: string, startedAt?: Date) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_APPOINTMENT_PLAN, hasura.GET_APPOINTMENT_PLANVariables>(
    gql`
      query GET_APPOINTMENT_PLAN($appointmentPlanId: uuid!, $currentMemberId: String!, $startedAt: timestamptz!) {
        appointment_plan_by_pk(id: $appointmentPlanId) {
          id
          title
          description
          duration
          price
          capacity
          reservation_amount
          reservation_type
          reschedule_amount
          reschedule_type
          support_locales
          default_meet_gateway
          meet_generation_method
          currency {
            id
            label
            unit
            name
          }
          appointment_enrollments(where: { member_id: { _eq: $currentMemberId } }) {
            member_id
            appointment_plan_id
            started_at
            canceled_at
          }
          appointment_periods(
            where: { available: { _eq: true }, started_at: { _gt: $startedAt } }
            order_by: { started_at: asc }
          ) {
            started_at
            ended_at
            booked
            available
          }
          creator {
            id
            abstract
            picture_url
            name
            username
          }
        }
      }
    `,
    {
      variables: {
        appointmentPlanId,
        currentMemberId: currentMemberId || '',
        startedAt: startedAt || moment().endOf('minute').toDate(),
      },
    },
  )

  const appointmentPlan:
    | (AppointmentPlan & {
        periods: AppointmentPeriod[]
        creator: {
          id: string
          avatarUrl: string | null
          name: string
          abstract: string | null
        }
      })
    | null = data?.appointment_plan_by_pk
    ? {
        id: data.appointment_plan_by_pk.id,
        title: data.appointment_plan_by_pk.title,
        description: data.appointment_plan_by_pk.description || '',
        duration: data.appointment_plan_by_pk.duration,
        price: data.appointment_plan_by_pk.price,
        phone: null,
        supportLocales: data.appointment_plan_by_pk.support_locales,
        capacity: data.appointment_plan_by_pk.capacity,
        reservationAmount: data.appointment_plan_by_pk.reservation_amount,
        reservationType: (data.appointment_plan_by_pk.reservation_type as ReservationType) || null,
        rescheduleAmount: data.appointment_plan_by_pk?.reschedule_amount,
        rescheduleType: (data.appointment_plan_by_pk.reschedule_type as ReservationType) || null,
        defaultMeetGateway: data.appointment_plan_by_pk.default_meet_gateway,
        meetGenerationMethod: data.appointment_plan_by_pk.meet_generation_method,
        currency: {
          id: data.appointment_plan_by_pk.currency.id,
          label: data.appointment_plan_by_pk.currency.label,
          unit: data.appointment_plan_by_pk.currency.unit,
          name: data.appointment_plan_by_pk.currency.name,
        },
        periods: data.appointment_plan_by_pk.appointment_periods.map(period => ({
          id: `${period.started_at}`,
          startedAt: new Date(period.started_at),
          endedAt: new Date(period.ended_at),
          booked: period.booked,
          available: !!period.available,
          isBookedReachLimit: data.appointment_plan_by_pk?.capacity
            ? data.appointment_plan_by_pk?.capacity !== -1 && period.booked >= data.appointment_plan_by_pk?.capacity
            : false,
          currentMemberBooked: data.appointment_plan_by_pk?.appointment_enrollments.some(
            enrollment =>
              enrollment.member_id === currentMemberId &&
              enrollment.appointment_plan_id === data.appointment_plan_by_pk?.id &&
              enrollment.started_at === period.started_at &&
              !enrollment.canceled_at,
          ),
        })),
        creator: {
          id: data.appointment_plan_by_pk.creator?.id || '',
          avatarUrl: data.appointment_plan_by_pk.creator?.picture_url || null,
          name: data.appointment_plan_by_pk.creator?.name || data.appointment_plan_by_pk.creator?.username || '',
          abstract: data.appointment_plan_by_pk.creator?.abstract || null,
        },
      }
    : null

  return {
    loadingAppointmentPlan: loading,
    errorAppointmentPlan: error,
    appointmentPlan,
    refetchAppointmentPlan: refetch,
  }
}
export const useEnrolledAppointmentCollection = (memberId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_ENROLLED_APPOINTMENT_PLAN,
    hasura.GET_ENROLLED_APPOINTMENT_PLANVariables
  >(
    gql`
      query GET_ENROLLED_APPOINTMENT_PLAN($memberId: String) {
        appointment_enrollment(where: { member_id: { _eq: $memberId } }, order_by: { started_at: desc }) {
          order_product_id
          appointment_plan_id
        }
      }
    `,
    { variables: { memberId }, fetchPolicy: 'no-cache' },
  )

  const enrolledAppointments: {
    orderProductId: string
    appointmentPlanId: string
  }[] =
    data?.appointment_enrollment.map(v => ({
      orderProductId: v.order_product_id,
      appointmentPlanId: v.appointment_plan_id,
    })) || []

  return {
    loadingEnrolledAppointments: loading,
    errorEnrolledAppointments: error,
    enrolledAppointments,
    refetchEnrolledAppointments: refetch,
  }
}

export const useUpdateAppointmentIssue = (orderProductId: string, options: any) => {
  const [updateAppointmentIssue] = useMutation<
    hasura.UPDATE_APPOINTMENT_ISSUE,
    hasura.UPDATE_APPOINTMENT_ISSUEVariables
  >(gql`
    mutation UPDATE_APPOINTMENT_ISSUE($orderProductId: uuid!, $data: jsonb) {
      update_order_product(where: { id: { _eq: $orderProductId } }, _set: { options: $data }) {
        affected_rows
      }
    }
  `)

  return (appointmentIssue: string) =>
    updateAppointmentIssue({
      variables: {
        orderProductId,
        data: {
          ...options,
          appointmentIssue,
        },
      },
    })
}

export const useCancelAppointment = (orderProductId: string, options: any) => {
  const [cancelAppointment] = useMutation<hasura.CANCEL_APPOINTMENT, hasura.CANCEL_APPOINTMENTVariables>(gql`
    mutation CANCEL_APPOINTMENT($orderProductId: uuid!, $data: jsonb) {
      update_order_product(where: { id: { _eq: $orderProductId } }, _set: { options: $data }) {
        affected_rows
      }
    }
  `)

  return (reason: string) =>
    cancelAppointment({
      variables: {
        orderProductId,
        data: {
          ...options,
          appointmentCanceledAt: new Date(),
          appointmentCanceledReason: reason,
        },
      },
    })
}

export const useMeetByAppointmentPlanIdAndPeriod = (appointmentPlanId: string, startedAt: Date, endedAt: Date) => {
  const { id: appId } = useApp()
  const { loading, data, error } = useQuery<
    hasura.GetMeetByAppointmentPlanIdAndPeriod,
    hasura.GetMeetByAppointmentPlanIdAndPeriodVariables
  >(
    gql`
      query GetMeetByAppointmentPlanIdAndPeriod(
        $target: uuid!
        $startedAt: timestamptz!
        $endedAt: timestamptz!
        $appId: String!
      ) {
        meet(
          where: {
            target: { _eq: $target }
            started_at: { _eq: $startedAt }
            ended_at: { _eq: $endedAt }
            app_id: { _eq: $appId }
            deleted_at: { _is_null: true }
            meet_members: { deleted_at: { _is_null: true } }
          }
        ) {
          id
          host_member_id
          meet_members {
            id
            member_id
          }
        }
      }
    `,
    {
      variables: {
        target: appointmentPlanId,
        startedAt: startedAt.toISOString(),
        endedAt: endedAt.toISOString(),
        appId,
      },
    },
  )
  const meet = data?.meet?.[0]
    ? {
        id: data.meet[0].id,
        hostMemberId: data.meet[0].host_member_id,
        meetMembers: data.meet[0].meet_members.map(v => ({
          id: v.id,
          memberId: v.member_id,
        })),
      }
    : null

  return {
    loading,
    meet,
    error,
  }
}
