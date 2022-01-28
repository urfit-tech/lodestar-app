import { HStack, Select, SkeletonText, useRadioGroup } from '@chakra-ui/react'
import { List } from 'antd'
import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import ActivitySessionCard from '../../components/activity/ActivitySessionCard'
import ActivityTicketItem from '../../components/activity/ActivityTicketItem'
import RadioCard from '../../components/RadioCard'
import { commonMessages } from '../../helpers/translation'
import { useEnrolledActivityTickets } from '../../hooks/activity'

const messages = defineMessages({
  displayTicket: { id: 'activity.select.option.displayTicket', defaultMessage: '顯示票券' },
  displaySession: { id: 'activity.select.option.displaySession', defaultMessage: '顯示場次' },
})

type DisplayType = 'ticket' | 'session'

const ActivityTicketCollectionBlock: React.VFC<{ memberId: string }> = ({ memberId }) => {
  const { loadingTickets, errorTickets, enrolledActivityTickets, enrolledActivitySessions } =
    useEnrolledActivityTickets(memberId)
  const { formatMessage } = useIntl()
  const [isExpired, setIsExpired] = useState(false)
  const [displayType, setDisplayType] = useState<DisplayType>('session')

  const options = [formatMessage(commonMessages.status.participable), formatMessage(commonMessages.status.expired)]

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'isExpired',
    defaultValue: formatMessage(commonMessages.status.participable),
    onChange: v => {
      if (v === formatMessage(commonMessages.status.expired)) {
        setIsExpired(true)
      } else {
        setIsExpired(false)
      }
    },
  })

  const group = getRootProps()

  return (
    <div className="container py-3">
      {loadingTickets ? (
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      ) : errorTickets ? (
        formatMessage(commonMessages.status.loadingError)
      ) : (
        <>
          <div className="d-flex justify-content-between mb-3">
            <Select
              bg="white"
              w={180}
              value={displayType}
              onChange={e => setDisplayType(e.target.value as DisplayType)}
            >
              <option value="ticket">{formatMessage(messages.displayTicket)}</option>
              <option value="session">{formatMessage(messages.displaySession)}</option>
            </Select>
            {displayType === 'session' && (
              <HStack {...group}>
                {options.map(value => {
                  const radio = getRadioProps({ value })
                  return (
                    <RadioCard key={value} {...radio} size="md">
                      {value}
                    </RadioCard>
                  )
                })}
              </HStack>
            )}
          </div>
          <List>
            {displayType === 'ticket'
              ? enrolledActivityTickets.map(ticket => (
                  <Link
                    to={`/orders/${ticket.orderLogId}/products/${ticket.orderProductId}`}
                    key={ticket.orderProductId}
                  >
                    <div className="mb-4">
                      <ActivityTicketItem ticketId={ticket.activityTicketId} />
                    </div>
                  </Link>
                ))
              : enrolledActivitySessions
                  .filter(session => session.isExpired === isExpired)
                  .sort((a, b) =>
                    isExpired ? b.endedAt.getTime() - a.endedAt.getTime() : a.endedAt.getTime() - b.endedAt.getTime(),
                  )
                  .map(session => (
                    <Link to={`/orders/${session.orderLogId}/products/${session.orderProductId}`} key={session.id}>
                      <div className="mb-4">
                        <ActivitySessionCard sessionId={session.id} />
                      </div>
                    </Link>
                  ))}
          </List>
        </>
      )}
    </div>
  )
}

export default ActivityTicketCollectionBlock
