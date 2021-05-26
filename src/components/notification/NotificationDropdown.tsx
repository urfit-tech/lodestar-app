import { useMutation } from '@apollo/react-hooks'
import { Badge, Button, List, Popover } from 'antd'
import gql from 'graphql-tag'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import NotificationContext from '../../contexts/NotificationContext'
import hasura from '../../hasura'
import { commonMessages } from '../../helpers/translation'
import NotificationItem from './NotificationItem'

const Wrapper = styled.div`
  width: 100vw;
  max-width: 432px;
`
const StyledList = styled(List)`
  && {
    max-height: calc(70vh - 57px - 42px);
    overflow-y: auto;
    overflow-x: hidden;
  }
`
const StyledAction = styled.div`
  border-top: 1px solid #ececec;

  button {
    color: #9b9b9b;
  }
`
const StyledBadge = styled(Badge)`
  button {
    font-size: 20px;
  }

  .ant-badge-count {
    top: 8px;
    right: 4px;
    padding: 0 0.25rem;
  }
`
const StyledButton = styled(Button)`
  &&,
  &&:hover,
  &&:active,
  &&:focus {
    color: var(--gray-darker);
  }
`
const StyledReadAllButton = styled(Button)`
  color: var(--gray-dark);
`

const NotificationDropdown: React.VFC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { notifications, unreadCount, refetchNotifications } = useContext(NotificationContext)

  const [readAllNotification] = useMutation<hasura.READ_ALL_NOTIFICATIONS, hasura.READ_ALL_NOTIFICATIONSVariables>(
    READ_ALL_NOTIFICATION,
  )

  const content = (
    <Wrapper>
      <StyledList itemLayout="horizontal">
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
            onRead={() => refetchNotifications && refetchNotifications()}
          />
        ))}
      </StyledList>
      <StyledAction>
        <Button type="link" block onClick={() => history.push('/notifications')}>
          {formatMessage(commonMessages.button.notification)}
        </Button>
      </StyledAction>
    </Wrapper>
  )

  return (
    <Popover
      placement="bottomRight"
      trigger="click"
      title={
        <div className="d-flex align-items-center justify-content-between">
          <span>{formatMessage(commonMessages.content.notification)}</span>
          <StyledReadAllButton
            type="link"
            size="small"
            onClick={() =>
              readAllNotification({
                variables: { readAt: new Date() },
              }).then(() => refetchNotifications && refetchNotifications())
            }
          >
            {formatMessage(commonMessages.button.markAll)}
          </StyledReadAllButton>
        </div>
      }
      content={content}
    >
      <StyledBadge count={unreadCount && unreadCount > 15 ? '15+' : unreadCount} className="mr-2">
        <StyledButton type="link" icon="bell" />
      </StyledBadge>
    </Popover>
  )
}

const READ_ALL_NOTIFICATION = gql`
  mutation READ_ALL_NOTIFICATIONS($readAt: timestamptz) {
    update_notification(where: { read_at: { _is_null: true } }, _set: { read_at: $readAt }) {
      affected_rows
    }
  }
`

export default NotificationDropdown
