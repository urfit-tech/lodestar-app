import { useMutation, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { ProductType } from 'lodestar-app-element/src/types/product'
import { sum } from 'ramda'
import { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import LocaleContext from '../contexts/LocaleContext'
import { GET_NOTIFICATIONS, NotificationProps } from '../contexts/NotificationContext'
import hasura from '../hasura'
import { handleError, uploadFile } from '../helpers/index'
import { CouponProps } from '../types/checkout'

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
          description: notification.description,
          type: notification.type,
          referenceUrl: notification.reference_url,
          extra: notification.extra,
          avatar: notification.avatar,
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
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_COUPON_COLLECTION,
    hasura.GET_COUPON_COLLECTIONVariables
  >(
    gql`
      query GET_COUPON_COLLECTION($memberId: String!) {
        coupon(where: { member_id: { _eq: $memberId } }) {
          id
          status {
            outdated
            used
          }
          coupon_code {
            code
            coupon_plan {
              id
              title
              amount
              type
              constraint
              started_at
              ended_at
              description
              scope
              coupon_plan_products {
                id
                product_id
              }
            }
          }
        }
      }
    `,
    { variables: { memberId } },
  )

  const coupons: CouponProps[] =
    loading || error || !data
      ? []
      : data.coupon.map(coupon => ({
          id: coupon.id,
          status: {
            used: coupon.status?.used || false,
            outdated: coupon.status?.outdated || false,
          },
          couponCode: {
            code: coupon.coupon_code.code,
            couponPlan: {
              id: coupon.coupon_code.coupon_plan.id,
              startedAt: coupon.coupon_code.coupon_plan.started_at
                ? new Date(coupon.coupon_code.coupon_plan.started_at)
                : null,
              endedAt: coupon.coupon_code.coupon_plan.ended_at
                ? new Date(coupon.coupon_code.coupon_plan.ended_at)
                : null,
              type:
                coupon.coupon_code.coupon_plan.type === 1
                  ? 'cash'
                  : coupon.coupon_code.coupon_plan.type === 2
                  ? 'percent'
                  : 'cash',
              constraint: coupon.coupon_code.coupon_plan.constraint,
              amount: coupon.coupon_code.coupon_plan.amount,
              title: coupon.coupon_code.coupon_plan.title,
              description: coupon.coupon_code.coupon_plan.description,
              count: 0,
              remaining: 0,
              scope: coupon.coupon_code.coupon_plan.scope,
              productIds: coupon.coupon_code.coupon_plan.coupon_plan_products.map(
                couponPlanProduct => couponPlanProduct.product_id,
              ),
            },
          },
        }))

  return {
    loadingCoupons: loading,
    errorCoupons: error,
    coupons,
    refetchCoupons: refetch,
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
    loadingProductIds: loading,
    errorProductIds: error,
    enrolledProductIds,
    refetchProgramIds: refetch,
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
    const { data } = await insertAttachment({
      variables: {
        attachments: files.map(() => ({
          type,
          target,
          app_id: appId,
        })),
      },
    })

    const attachmentIds: string[] = data?.insert_attachment?.returning.map((v: any) => v.id) || []

    try {
      for (let index = 0; files[index]; index++) {
        const attachmentId = attachmentIds[index]
        const file = files[index]
        await uploadFile(`attachments/${attachmentId}`, file, authToken)
        await insertAttachment({
          variables: {
            attachments: [
              {
                id: attachmentId,
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

export const useExpiredOwnedProducts = (memberId: string, productType: ProductType) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_EXPIRED_OWNED_PRODUCTS,
    hasura.GET_EXPIRED_OWNED_PRODUCTSVariables
  >(
    gql`
      query GET_EXPIRED_OWNED_PRODUCTS($memberId: String!, $productType: String!) {
        order_product(
          where: {
            product: { type: { _eq: $productType } }
            order_log: { status: { _eq: "SUCCESS" }, member_id: { _eq: $memberId } }
            ended_at: { _is_null: false, _lt: "now()" }
          }
        ) {
          id
          product {
            id
            target
          }
        }
      }
    `,
    {
      variables: { memberId, productType },
    },
  )
  const expiredOwnedProducts = data?.order_product.map(v => v.product.target) || []

  return {
    loadingExpiredOwnedProducts: loading,
    errorExpiredOwnedProducts: error,
    expiredOwnedProducts,
    refetchExpiredOwnedProducts: refetch,
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
