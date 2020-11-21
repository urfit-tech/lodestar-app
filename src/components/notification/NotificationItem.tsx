import { useMutation } from '@apollo/react-hooks'
import { Icon, List } from 'antd'
import gql from 'graphql-tag'
import moment from 'moment'
import React from 'react'
import { useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { getNotificationIconType, rgba } from '../../helpers'
import types from '../../types'
import { AvatarImage } from '../common/Image'

const StyledListItem = styled(List.Item)<{ variant?: 'read' }>`
  && {
    padding: 0.75rem;
    cursor: pointer;

    ${props =>
      props.variant === 'read'
        ? ''
        : css`
            background: ${props => rgba(props.theme['@primary-color'], 0.1)};
          `}
  }
`

const NotificationItem: React.FC<{
  id: string
  description: string
  avatar: string | null
  updatedAt: Date
  extra: string | null
  referenceUrl: string | null
  type: string | null
  readAt: Date | null
  onRead?: () => void
}> = ({ id, description, avatar, updatedAt, extra, referenceUrl, type, readAt, onRead }) => {
  const history = useHistory()
  const [readNotification] = useMutation<types.READ_NOTIFICATION, types.READ_NOTIFICATIONVariables>(READ_NOTIFICATION)

  return (
    <StyledListItem
      className={referenceUrl ? 'cursor-pointer' : ''}
      variant={readAt ? 'read' : undefined}
      onClick={() => {
        readNotification({
          variables: { notificationId: id, readAt: new Date() },
        }).then(() => {
          if (referenceUrl) {
            if (referenceUrl.startsWith('http')) {
              const url = new URL(referenceUrl)
              history.push(url.pathname)
            } else {
              history.push(referenceUrl)
            }
          } else {
            onRead && onRead()
          }
        })
      }}
    >
      <List.Item.Meta
        className="align-item-start"
        avatar={<AvatarImage src={avatar || ''} />}
        title={description}
        description={
          <div style={{ color: '#9b9b9b' }}>
            <span className="mr-1">{type && <Icon type={getNotificationIconType(type)} />}</span>
            <span>{moment(updatedAt).fromNow()}</span>
            {extra && <span>・{extra}</span>}
          </div>
        }
      />
    </StyledListItem>
  )
}

const READ_NOTIFICATION = gql`
  mutation READ_NOTIFICATION($notificationId: uuid!, $readAt: timestamptz) {
    update_notification(where: { id: { _eq: $notificationId } }, _set: { read_at: $readAt }) {
      affected_rows
    }
  }
`

export default NotificationItem
