import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { sum } from 'ramda'
import { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import LocaleContext from '../contexts/LocaleContext'
import { NotificationProps } from '../contexts/NotificationContext'
import hasura from '../hasura'
import { handleError, uploadFile } from '../helpers/index'
import { MemberContract } from '../types/contract'

export const GET_NOTIFICATIONS = gql`
  query GET_NOTIFICATIONS($limit: Int) {
    notification(order_by: { updated_at: desc }, limit: $limit) {
      id
      avatar
      description
      reference_url
      extra
      type
      read_at
      updated_at
    }
    notification_aggregate(where: { read_at: { _is_null: true } }, limit: 16) {
      aggregate {
        count
      }
    }
  }
`

export const useNotifications = (limit: number) => {
  const { id: appId } = useApp()
  const [fetch, { loading, error, data }] = useLazyQuery<hasura.GET_NOTIFICATIONS, hasura.GET_NOTIFICATIONSVariables>(
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
    refetchNotifications: fetch,
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
  const { authToken } = useAuth()
  const [memberContractData, setMemberContractData] = useState<MemberContract | null>(null)
  const { loading, refetch, data } = useQuery<hasura.GetMemberContract, hasura.GetMemberContractVariables>(
    gql`
      query GetMemberContract($memberContractId: uuid!) {
        member_contract_by_pk(id: $memberContractId) {
          id
          started_at
          ended_at
          values
          agreed_at
          agreed_ip
          revoked_at
          agreed_options
          member {
            id
            name
            email
            member_properties(where: { property: { name: { _eq: "本名" } } }) {
              value
            }
          }
          contract {
            id
            name
            description
            template
          }
        }
      }
    `,
    { variables: { memberContractId }, skip: !authToken },
  )

  useEffect(() => {
    if (!loading && data?.member_contract_by_pk) {
      setMemberContractData({
        id: memberContractId,
        startedAt: data.member_contract_by_pk.started_at || null,
        endedAt: data.member_contract_by_pk.ended_at || null,
        values: data.member_contract_by_pk.values,
        agreedAt: data.member_contract_by_pk.agreed_at || null,
        agreedIp: data.member_contract_by_pk.agreed_ip || null,
        agreedOptions: data.member_contract_by_pk.agreed_options || {},
        memberId: data.member_contract_by_pk.member.id,
        memberName:
          data.member_contract_by_pk.member.member_properties[0]?.value ||
          data.member_contract_by_pk.member.name ||
          null,
        memberEmail: data.member_contract_by_pk.member.email || null,
        revokedAt: data.member_contract_by_pk.revoked_at || null,
        contract: {
          id: data.member_contract_by_pk.contract.id,
          name: data.member_contract_by_pk.contract.name || '',
          description: data.member_contract_by_pk.contract.description || '',
          template: data.member_contract_by_pk.contract.template || '',
        },
      })
    }
  }, [loading, data])

  return {
    loading,
    refetch,
    memberContract: memberContractData,
    setMemberContractData,
  }
}

export const useMemberPropertyMemberType = (memberId: string) => {
  const { loading, data } = useQuery<hasura.GetMemberPropertyMemberType, hasura.GetMemberPropertyMemberTypeVariables>(
    gql`
      query GetMemberPropertyMemberType($memberId: String!) {
        member_property(where: { member_id: { _eq: $memberId }, property: { name: { _eq: "會員類型" } } }) {
          value
        }
      }
    `,
    { variables: { memberId } },
  )
  const memberType = data?.member_property[0]?.value || null

  return {
    loading,
    memberType,
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
