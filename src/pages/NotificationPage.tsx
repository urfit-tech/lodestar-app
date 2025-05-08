import { Icon, List, Typography } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'
import AdminCard from '../components/common/AdminCard'
import DefaultLayout from '../components/layout/DefaultLayout'
import NotificationItem from '../components/notification/NotificationItem'
import { commonMessages, productMessages } from '../helpers/translation'
import { useNotifications } from '../hooks/data'

const NotificationPage: React.FC = () => {
  const { formatMessage } = useIntl()
  const { loadingNotifications, errorNotifications, notifications, refetchNotifications } = useNotifications(100)

  return (
    <DefaultLayout>
      <div className="py-5">
        <div className="container">
          <Typography.Title className="mb-4" level={3}>
            <Icon type="bell" className="mr-1" />
            <span>{formatMessage(commonMessages.title.notification)}</span>
          </Typography.Title>

          <AdminCard loading={loadingNotifications} style={{ color: '#9b9b9b' }}>
            {errorNotifications ? (
              formatMessage(commonMessages.status.loadingNotificationError)
            ) : notifications.length > 0 ? (
              <List itemLayout="horizontal">
                {notifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    id={notification.id}
                    description={notification.description}
                    avatar={notification.avatar}
                    updatedAt={notification.updatedAt}
                    extra={notification.extra}
                    referenceUrl={notification.referenceUrl}
                    type={notification.type}
                    readAt={notification.readAt}
                    onRead={() => refetchNotifications()}
                  />
                ))}
              </List>
            ) : (
              formatMessage(productMessages.program.message.noNotification)
            )}
          </AdminCard>
        </div>
      </div>
    </DefaultLayout>
  )
}

export default NotificationPage
