import { useMutation, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import moment from 'moment'
import hasura from '../hasura'
import {
  AppointmentEnrollment,
  AppointmentPeriod,
  AppointmentPlan,
  ReservationType,
} from '../types/appointment'

export const useAppointmentPlanCollection = (memberId: string, startedAt: Date) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_APPOINTMENT_PLAN_COLLECTION,
    hasura.GET_APPOINTMENT_PLAN_COLLECTIONVariables
  >(
    gql`
      query GET_APPOINTMENT_PLAN_COLLECTION($memberId: String!, $startedAt: timestamptz) {
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
          currency {
            id
            label
            unit
            name
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
    { variables: { memberId, startedAt } },
  )

  const appointmentPlans: (AppointmentPlan & {
    periods: AppointmentPeriod[]
  })[] =
    loading || error || !data
      ? []
      : data.appointment_plan.map(appointmentPlan => ({
          id: appointmentPlan.id,
          title: appointmentPlan.title,
          description: appointmentPlan.description,
          duration: appointmentPlan.duration,
          price: appointmentPlan.price,
          phone: null,
          supportLocales: appointmentPlan.support_locales,
          currency: {
            id: appointmentPlan.currency.id,
            label: appointmentPlan.currency.label,
            unit: appointmentPlan.currency.unit,
            name: appointmentPlan.currency.name,
          },
          periods: appointmentPlan.appointment_periods.map(period => ({
            id: `${period.started_at}`,
            startedAt: new Date(period.started_at),
            endedAt: new Date(period.ended_at),
            booked: !!period.booked,
            available: !!period.available,
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

export const useAppointmentPlan = (appointmentPlanId: string, startedAt?: Date) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_APPOINTMENT_PLAN, hasura.GET_APPOINTMENT_PLANVariables>(
    gql`
      query GET_APPOINTMENT_PLAN($appointmentPlanId: uuid!, $startedAt: timestamptz!) {
        appointment_plan_by_pk(id: $appointmentPlanId) {
          id
          title
          description
          duration
          price
          support_locales
          currency {
            id
            label
            unit
            name
          }
          appointment_periods(
            where: { available: { _eq: true }, started_at: { _gt: $startedAt } }
            order_by: { started_at: asc }
          ) {
            started_at
            ended_at
            booked
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
    { variables: { appointmentPlanId, startedAt: startedAt || moment().endOf('minute').toDate() } },
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
    | null =
    loading || error || !data || !data.appointment_plan_by_pk
      ? null
      : {
          id: data.appointment_plan_by_pk.id,
          title: data.appointment_plan_by_pk.title,
          description: data.appointment_plan_by_pk.description,
          duration: data.appointment_plan_by_pk.duration,
          price: data.appointment_plan_by_pk.price,
          phone: null,
          supportLocales: data.appointment_plan_by_pk.support_locales,
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
            booked: !!period.booked,
          })),
          creator: {
            id: data.appointment_plan_by_pk.creator?.id || '',
            avatarUrl: data.appointment_plan_by_pk.creator?.picture_url || null,
            name: data.appointment_plan_by_pk.creator?.name || data.appointment_plan_by_pk.creator?.username || '',
            abstract: data.appointment_plan_by_pk.creator?.abstract || null,
          },
        }

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
          started_at
          ended_at
          canceled_at
          order_product_id
          issue
          member {
            id
            name
            picture_url
          }
          appointment_plan {
            id
            title
            creator {
              id
              picture_url
              name
              username
            }
          }
          order_product {
            id
            deliverables
            options
          }
        }
      }
    `,
    { variables: { memberId }, fetchPolicy: 'no-cache' },
  )

  const enrolledAppointments: AppointmentEnrollment[] =
    loading || error || !data
      ? []
      : data.appointment_enrollment.map(enrollment => ({
          title: enrollment.appointment_plan ? enrollment.appointment_plan.title : '',
          startedAt: new Date(enrollment.started_at),
          endedAt: new Date(enrollment.ended_at),
          canceledAt: enrollment.canceled_at ? new Date(enrollment.canceled_at) : null,
          creator: {
            avatarUrl: enrollment.appointment_plan?.creator?.picture_url || null,
            name: enrollment.appointment_plan?.creator?.name || enrollment.appointment_plan?.creator?.username || '',
          },
          member: {
            name: enrollment?.member?.name || '',
            email: '',
            phone: '',
          },
          appointmentUrl:
            (enrollment.order_product &&
              enrollment.order_product.deliverables &&
              enrollment.order_product.deliverables['join_url']) ||
            '',
          appointmentIssue: enrollment.issue,
          orderProduct: {
            id: enrollment.order_product_id,
            options: enrollment.order_product?.options,
          },
        }))

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
