import { useMutation, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import types from '../types'
import {
  AppointmentEnrollmentProps,
  AppointmentPeriodProps,
  AppointmentPlanProps,
  ReservationType,
} from '../types/appointment'

export const useAppointmentPlanCollection = (memberId: string, startedAt: Date) => {
  const { loading, error, data, refetch } = useQuery<
    types.GET_APPOINTMENT_PLAN_COLLECTION,
    types.GET_APPOINTMENT_PLAN_COLLECTIONVariables
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

  const appointmentPlans: (AppointmentPlanProps & {
    periods: AppointmentPeriodProps[]
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

export const useEnrolledAppointmentCollection = (memberId: string) => {
  const { loading, error, data, refetch } = useQuery<
    types.GET_ENROLLED_APPOINTMENT_PLAN,
    types.GET_ENROLLED_APPOINTMENT_PLANVariables
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

  const enrolledAppointments: AppointmentEnrollmentProps[] =
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
    types.UPDATE_APPOINTMENT_ISSUE,
    types.UPDATE_APPOINTMENT_ISSUEVariables
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
  const [cancelAppointment] = useMutation<types.CANCEL_APPOINTMENT, types.CANCEL_APPOINTMENTVariables>(gql`
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
