import { ApolloError } from '@apollo/client'
import gql from 'graphql-tag'
import React, { createContext } from 'react'
import { useNotifications } from '../hooks/data'

export type NotificationProps = {
  id: string
  description: string
  type: string | null
  referenceUrl: string | null
  extra: string | null
  avatar: string | null
  readAt: Date | null
  updatedAt: Date
}

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

const NotificationContext = createContext<{
  loadingNotifications: boolean
  errorNotifications?: ApolloError
  notifications: NotificationProps[]
  unreadCount?: number | null
  refetchNotifications?: () => Promise<any>
}>({
  loadingNotifications: true,
  notifications: [],
})

export const NotificationProvider: React.FC = ({ children }) => {
  const { loadingNotifications, errorNotifications, notifications, unreadCount, refetchNotifications } =
    useNotifications(15)

  return (
    <NotificationContext.Provider
      value={{
        loadingNotifications,
        errorNotifications,
        notifications,
        unreadCount,
        refetchNotifications: refetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
