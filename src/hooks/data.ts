import { gql, useMutation, useQuery } from '@apollo/client'
import axios from 'axios'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { sum } from 'ramda'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import LocaleContext from '../contexts/LocaleContext'
import { GET_NOTIFICATIONS, NotificationProps } from '../contexts/NotificationContext'
import hasura from '../hasura'
import { handleError, uploadFile } from '../helpers/index'
import { CouponProps } from '../types/checkout'
import { CouponFromLodestarAPI } from '../types/coupon'

export const useNotifications = (limit: number) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_NOTIFICATIONS, hasura.GET_NOTIFICATIONSVariables>(
    GET_NOTIFICATIONS,
    { variables: { limit } },
  )

  const notifications: NotificationProps[] =
    loading || error || !data
      ? []
      : data.notification.map(notification => ({
          id: notification.id,
          description: notification.description || '',
          type: notification.type || null,
          referenceUrl: notification.reference_url || null,
          extra: notification.extra || null,
          avatar: notification.avatar || null,
          readAt: notification.read_at ? new Date(notification.read_at) : null,
          updatedAt: new Date(notification.updated_at),
        }))

  return {
    loadingNotifications: loading,
    errorNotifications: error,
    notifications,
    unreadCount: data?.notification_aggregate.aggregate?.count,
    refetchNotifications: refetch,
  }
}

export const useCouponCollection = (memberId: string) => {
  const { authToken } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>()
  const [data, setData] = useState<CouponProps[]>([])

  const fetch = useCallback(async () => {
    if (authToken) {
      const route = '/coupons'
      try {
        setLoading(true)
        const { data } = await axios.get(`${process.env.REACT_APP_LODESTAR_SERVER_ENDPOINT}${route}`, {
          params: { memberId, includeDeleted: false },
          headers: { authorization: `Bearer ${authToken}` },
        })
        setData(
          data.map((coupon: CouponFromLodestarAPI) => ({
            id: coupon.id,
            status: coupon.status,
            couponCode: {
              code: coupon.couponCode.code,
              couponPlan: {
                id: coupon.couponCode.couponPlan.id,
                startedAt: coupon.couponCode.couponPlan.startedAt
                  ? new Date(coupon.couponCode.couponPlan.startedAt)
                  : null,
                endedAt: coupon.couponCode.couponPlan.endedAt ? new Date(coupon.couponCode.couponPlan.endedAt) : null,
                type: coupon.couponCode.couponPlan.type === 1 ? 'cash' : 'percent',
                constraint: coupon.couponCode.couponPlan.constraint,
                amount: coupon.couponCode.couponPlan.amount,
                title: coupon.couponCode.couponPlan.title,
                description: coupon.couponCode.couponPlan.description || '',
                scope: coupon.couponCode.couponPlan.scope,
                productIds: coupon.couponCode.couponPlan.couponPlanProducts.map(
                  couponPlanProduct => couponPlanProduct.productId,
                ),
              },
            },
          })) || [],
        )
      } catch (err) {
        console.log(err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }
  }, [authToken])

  useEffect(() => {
    fetch()
  }, [fetch])

  return {
    loading,
    error,
    data,
    fetch,
  }
}

export const useEnrolledProductIds = (memberId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_ENROLLED_PRODUCTS,
    hasura.GET_ENROLLED_PRODUCTSVariables
  >(
    gql`
      query GET_ENROLLED_PRODUCTS($memberId: String!) {
        product_enrollment(where: { member_id: { _eq: $memberId } }) {
          product_id
        }
      }
    `,
    { variables: { memberId } },
  )

  const enrolledProductIds: string[] =
    loading || error || !data
      ? []
      : data.product_enrollment.map(productEnrollment => productEnrollment.product_id || '').filter(v => v)

  return {
    loading,
    error,
    enrolledProductIds,
    refetch,
  }
}

export const useNav = () => {
  const location = useLocation()
  const { loading, navs } = useApp()
  const { currentLocale } = useContext(LocaleContext)

  return {
    loading,
    navs: navs.filter(nav => nav.locale === currentLocale),
    pageTitle: navs.find(nav => nav.locale === currentLocale && nav.href === location.pathname + location.search)
      ?.label,
  }
}

export const useMemberContract = (memberContractId: string) => {
  const { data, ...result } = useQuery<hasura.GET_MEMBER_CONTRACT, hasura.GET_MEMBER_CONTRACTVariables>(
    gql`
      query GET_MEMBER_CONTRACT($memberContractId: uuid!) {
        member_contract_by_pk(id: $memberContractId) {
          started_at
          ended_at
          values
          agreed_at
          agreed_ip
          revoked_at
          agreed_options
          member {
            name
            email
            member_properties(where: { property: { name: { _eq: "本名" } } }) {
              value
            }
          }
          contract {
            name
            description
            template
          }
        }
      }
    `,
    { variables: { memberContractId } },
  )

  return {
    ...result,
    memberContract: data?.member_contract_by_pk
      ? {
          startedAt: data.member_contract_by_pk.started_at || null,
          endedAt: data.member_contract_by_pk.ended_at || null,
          values: data.member_contract_by_pk.values,
          agreedAt: data.member_contract_by_pk.agreed_at || null,
          agreedIp: data.member_contract_by_pk.agreed_ip || null,
          agreedOptions: data.member_contract_by_pk.agreed_options || {},
          memberName:
            data.member_contract_by_pk.member.member_properties[0]?.value ||
            data.member_contract_by_pk.member.name ||
            null,
          memberEmail: data.member_contract_by_pk.member.email || null,
          revokedAt: data.member_contract_by_pk.revoked_at || null,
          contract: {
            name: data.member_contract_by_pk.contract.name || '',
            description: data.member_contract_by_pk.contract.description || '',
            template: data.member_contract_by_pk.contract.template || '',
          },
        }
      : null,
  }
}

export const useUploadAttachments = () => {
  const { authToken } = useAuth()
  const { id: appId } = useApp()
  const [insertAttachment] = useMutation<hasura.INSERT_ATTACHMENT, hasura.INSERT_ATTACHMENTVariables>(gql`
    mutation INSERT_ATTACHMENT($attachments: [attachment_insert_input!]!) {
      insert_attachment(objects: $attachments, on_conflict: { constraint: attachment_pkey, update_columns: [data] }) {
        returning {
          id
        }
      }
    }
  `)

  return async (type: string, target: string, files: File[]) => {
    const attachmentIds: string[] = []
    try {
      for (let index = 0; files[index]; index++) {
        const attachmentId = uuid()
        attachmentIds.push(attachmentId)
        const file = files[index]
        await uploadFile(`attachments/${attachmentId}`, file, authToken)
        await insertAttachment({
          variables: {
            attachments: [
              {
                id: attachmentId,
                type,
                target,
                data: {
                  lastModified: file.lastModified,
                  name: file.name,
                  type: file.type,
                  size: file.size,
                },
                app_id: appId,
              },
            ],
          },
        })
      }

      return attachmentIds
    } catch (error) {
      handleError(error)
    }
  }
}

export const useCoinStatus = (memberId: string) => {
  const { data } = useQuery<hasura.GET_COIN_STATUS>(
    gql`
      query GET_COIN_STATUS($memberId: String!) {
        coin_status(where: { member_id: { _eq: $memberId } }) {
          remaining
        }
      }
    `,
    {
      variables: { memberId },
    },
  )
  return {
    ownedCoins: sum(data?.coin_status.map(v => v.remaining || 0) || []),
  }
}

export const useOrderId = (paymentNo: string) => {
  const { data } = useQuery<hasura.GET_ORDER_ID, hasura.GET_ORDER_IDVariables>(
    gql`
      query GET_ORDER_ID($paymentNo: String!) {
        payment_log(where: { no: { _eq: $paymentNo } }) {
          order_id
        }
      }
    `,
    { variables: { paymentNo } },
  )
  return { orderId: data?.payment_log[0]?.order_id || null }
}
