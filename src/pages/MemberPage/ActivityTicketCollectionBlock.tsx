import { List, Skeleton } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import ActivityTicketItem from '../../components/activity/ActivityTicketItem'
import { commonMessages } from '../../helpers/translation'
import { useEnrolledActivityTickets } from '../../hooks/activity'

const ActivityTicketCollectionBlock: React.VFC<{ memberId: string }> = ({ memberId }) => {
  const { loadingTickets, errorTickets, enrolledActivityTickets } = useEnrolledActivityTickets(memberId)
  const { formatMessage } = useIntl()

  return (
    <div className="container py-3">
      {loadingTickets ? (
        <Skeleton active />
      ) : errorTickets ? (
        formatMessage(commonMessages.status.loadingError)
      ) : (
        <List>
          {enrolledActivityTickets.map(ticket => (
            <Link to={`/orders/${ticket.orderLogId}/products/${ticket.orderProductId}`} key={ticket.orderProductId}>
              <div className="mb-4">
                <ActivityTicketItem ticketId={ticket.activityTicketId} />
              </div>
            </Link>
          ))}
        </List>
      )}
    </div>
  )
}

export default ActivityTicketCollectionBlock
