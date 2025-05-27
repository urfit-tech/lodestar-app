import { ApolloError } from '@apollo/client'
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

  setTimeout(() => refetchNotifications(), 5000)

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
