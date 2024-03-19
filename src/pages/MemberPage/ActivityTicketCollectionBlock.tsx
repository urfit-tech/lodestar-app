import { HStack, Select, useRadioGroup } from '@chakra-ui/react'
import { List } from 'antd'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import ActivitySessionCard from '../../components/activity/ActivitySessionCard'
import ActivityTicketItem from '../../components/activity/ActivityTicketItem'
import RadioCard from '../../components/RadioCard'
import { commonMessages } from '../../helpers/translation'
import { ActivitySessionTicketEnrollment } from '../../types/activity'

const messages = defineMessages({
  displayTicket: { id: 'activity.select.option.displayTicket', defaultMessage: '顯示票券' },
  displaySession: { id: 'activity.select.option.displaySession', defaultMessage: '顯示場次' },
})

type DisplayType = 'ticket' | 'session'

const ActivityTicketCollectionBlock: React.VFC<{
  activityEnrollment: ActivitySessionTicketEnrollment[]
  isError: boolean
}> = ({ activityEnrollment, isError }) => {
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

  if (isError) {
    return (
      <div className="container py-3">
        <div>{formatMessage(commonMessages.status.loadingUnable)}</div>
      </div>
    )
  }

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between mb-3">
        <Select bg="white" w={180} value={displayType} onChange={e => setDisplayType(e.target.value as DisplayType)}>
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
          ? activityEnrollment.map(ticket => (
            <Link to={`/orders/${ticket.orderId}/products/${ticket.orderProductId}`} key={ticket.orderProductId}>
              <div className="mb-4">
                <ActivityTicketItem ticketId={ticket.activityTicketId} />
              </div>
            </Link>
          ))
          : displayType === 'session' ? activityEnrollment
            .flatMap(ticket => ticket.activitySession.map(session => ({ ...session, ticket })))
            .filter(session => dayjs(session.endedAt).isBefore(dayjs()) === isExpired)
            .sort((a, b) =>
              isExpired
                ? dayjs(b.endedAt).valueOf() - dayjs(a.endedAt).valueOf()
                : dayjs(a.endedAt).valueOf() - dayjs(b.endedAt).valueOf(),
            )
            .map(session => {
              return (
                <Link
                  to={`/orders/${session.ticket.orderId}/products/${session.ticket.orderProductId}?sessionId=${session.id}`}
                  key={session.id}
                >
                  <div className="mb-4">
                    <ActivitySessionCard
                      session={{
                        id: session.id,
                        location: session.location || '',
                        onlineLink: session.onlineLink || '',
                        activityTitle: session.activityTitle,
                        title: session.title,
                        coverUrl: session.activityCoverUrl,
                        startedAt: session.startedAt,
                        endedAt: session.endedAt,
                      }}
                    />
                  </div>
                </Link>
              )
            }) : null}
      </List>
    </div>
  )
}

export default ActivityTicketCollectionBlock
