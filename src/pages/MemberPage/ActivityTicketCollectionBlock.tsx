import { HStack, Select, SkeletonText, useRadioGroup } from '@chakra-ui/react'
import { List } from 'antd'
import dayjs from 'dayjs'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useMemo, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import ActivitySessionCard from '../../components/activity/ActivitySessionCard'
import ActivityTicketItem from '../../components/activity/ActivityTicketItem'
import RadioCard from '../../components/RadioCard'
import { commonMessages } from '../../helpers/translation'
import { useActivityTicketsByIds } from '../../hooks/activity'
import { ActivitySessionTicketEnrollment } from '../../types/activity'

const messages = defineMessages({
  displayTicket: { id: 'activity.select.option.displayTicket', defaultMessage: 'Display Ticket' },
  displaySession: { id: 'activity.select.option.displaySession', defaultMessage: 'Display Session' },
})

type DisplayType = 'ticket' | 'session'

const ActivityTicketCollectionBlock: React.FC<{
  activityEnrollment: ActivitySessionTicketEnrollment[]
  isError: boolean
}> = ({ activityEnrollment, isError }) => {
  const { formatMessage } = useIntl()
  const [isExpired, setIsExpired] = useState(false)
  const [displayType, setDisplayType] = useState<DisplayType>('session')
  const { currentMemberId } = useAuth()

  const ticketIds = useMemo(() => {
    return Array.from(new Set(activityEnrollment.map(item => item.activityTicketId)))
  }, [activityEnrollment])

  const { tickets, loadingTickets } = useActivityTicketsByIds(ticketIds)

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

  if (loadingTickets) {
    return <SkeletonText mt="1" noOfLines={4} spacing="4" />
  }

  if (isError) {
    return (
      <div className="container py-3">
        <div>{formatMessage(commonMessages.status.loadingUnable)}</div>
      </div>
    )
  }

  const seenSessionIds = new Set()
  const sessions = tickets
    .filter(ticket => ticket.sessions.length > 0)
    .flatMap(ticket => ticket.sessions.map(session => ({ ...session, ticket })))
    .filter(session => {
      if (seenSessionIds.has(session.id)) {
        return false
      }
      seenSessionIds.add(session.id)

      return isExpired
        ? dayjs(session.endedAt).isBefore(dayjs())
        : session.endedAt !== null && !dayjs(session.endedAt).isBefore(dayjs())
    })
    .sort((a, b) =>
      isExpired
        ? dayjs(b.endedAt).valueOf() - dayjs(a.endedAt).valueOf()
        : dayjs(a.endedAt).valueOf() - dayjs(b.endedAt).valueOf(),
    )

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
          ? tickets.map(ticket => (
              <Link
                to={`/activity_ticket/${ticket.id}?memberId=${currentMemberId}`}
                key={ticket.id}
                style={{ pointerEvents: ticket.activity ? 'auto' : 'none' }}
              >
                <div className="mb-4">
                  <ActivityTicketItem
                    ticket={{
                      id: ticket.id,
                      activity: ticket.activity
                        ? {
                            title: ticket.activity.title,
                            coverUrl: ticket.activity.coverUrl,
                          }
                        : {
                            title: '',
                            coverUrl: '',
                          },
                      sessions: ticket.sessions.map(session => ({
                        id: session.id,
                        endedAt: session.endedAt,
                        startedAt: session.startedAt,
                        title: session.title,
                        location: session.location,
                        onlineLink: session.onlineLink,
                        activityTitle: session.title,
                        type: session.type,
                      })),
                    }}
                  />
                </div>
              </Link>
            ))
          : displayType === 'session'
          ? sessions.map(session => (
              <Link
                to={`/activity_ticket/${session.ticket.id}?memberId=${currentMemberId}${
                  session.id ? '&session=' + session.id : ''
                }`}
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
                      coverUrl: session.coverUrl || '',
                      startedAt: session.startedAt.toISOString(),
                      endedAt: session.endedAt.toISOString(),
                    }}
                  />
                </div>
              </Link>
            ))
          : null}
      </List>
    </div>
  )
}

export default ActivityTicketCollectionBlock
