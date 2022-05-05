import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { DeepPick } from 'ts-deep-pick/lib'
import PageHelmet from '../../components/common/PageHelmet'
import { getBraftContent, notEmpty } from '../../helpers'
import { usePublicMember } from '../../hooks/member'
import { Activity } from '../../types/activity'

const schemaTypeMap = {
  online: 'OnlineEventAttendanceMode' as const,
  offline: 'OfflineEventAttendanceMode' as const,
  mixed: 'MixedEventAttendanceMode' as const,
}

// FIXME: it should change to another structured data
// https://developers.google.com/search/docs/advanced/structured-data/event
type ActivityPageHelmetProps = DeepPick<
  Activity,
  | 'id'
  | 'title'
  | 'description'
  | 'coverUrl'
  | 'tags'
  | 'tickets.[].startedAt'
  | 'tickets.[].endedAt'
  | 'tickets.[].price'
  | 'organizerId'
  | 'sessions.[].location'
  | 'sessions.[].onlineLink'
  | 'sessions.[].startedAt'
  | 'sessions.[].endedAt'
  | 'ticketSessions.[].session.id'
  | 'ticketSessions.[].session.title'
  | 'ticketSessions.[].session.type'
>
const ActivityPageHelmet: React.VFC<{ activity: ActivityPageHelmetProps }> = ({ activity }) => {
  const app = useApp()

  const { member } = usePublicMember(activity.organizerId)

  const activityType: 'online' | 'offline' | 'mixed' = activity.sessions.some(session => session.location !== null)
    ? 'offline'
    : activity.sessions.some(session => session.onlineLink !== null)
    ? 'online'
    : 'mixed'

  const activityLocation = activity.sessions.reduce<
    (
      | { '@type': string; url: string }
      | {
          '@type': string
          name: string
          address: {
            '@type': string
            name: string
          }
        }
    )[]
  >((acc, curr) => {
    const onlineLocation = curr.onlineLink
      ? {
          '@type': 'VirtualLocation',
          url: curr.onlineLink,
        }
      : null
    const offlineLocation = curr.location
      ? {
          '@type': 'Place',
          name: curr.location,
          address: {
            '@type': 'PostalAddress',
            name: curr.location,
          },
        }
      : null

    return [...acc, onlineLocation, offlineLocation].filter(notEmpty)
  }, [])

  const activityStartedAt = new Date(Math.min(...activity.sessions.map(session => session.startedAt.getTime())))
  const activityEndedAt = new Date(Math.max(...activity.sessions.map(session => session.endedAt.getTime())))
  return (
    <PageHelmet
      title={activity.title}
      description={getBraftContent(activity.description || app.settings['description'])}
      keywords={activity.tags}
      jsonLd={[
        {
          '@context': 'https://schema.org',
          '@type': 'Event' as any,
          name: activity.title || app.settings['title'],
          startDate: activityStartedAt?.toISOString(),
          endDate: activityEndedAt?.toISOString(),
          eventAttendanceMode: `https://schema.org/${schemaTypeMap[activityType]}`,
          eventStatus: 'https://schema.org/EventScheduled', // TODO: confirm by publishedAt and availableSeats
          location: activityLocation.length === 1 ? activityLocation[0] : (activityLocation as any),
          image: [activity.coverUrl || app.settings['open_graph.image']],
          description: getBraftContent(activity.description || app.settings['description']),
          offers: {
            '@type': 'AggregateOffer',
            offerCount: activity.tickets.length,
            lowPrice: Math.min(...activity.tickets.map(activityTicket => activityTicket.price)),
            highPrice: Math.max(...activity.tickets.map(activityTicket => activityTicket.price)),
            priceCurrency: app.settings['currency_id'] || process.env.SYS_CURRENCY,
          },
          performer: {
            '@type': 'Person',
            name: member?.name || '',
          } as any,
          organizer: {
            '@type': 'Organization',
            name: app.settings['name'] || document.title,
            url: `https://${window.location.host}`,
          },
        },
      ]}
      openGraph={[
        { property: 'fb:app_id', content: app.settings['auth.facebook_app_id'] },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: window.location.href },
        { property: 'og:title', content: activity.title || app.settings['title'] },
        { property: 'og:description', content: getBraftContent(activity.description || app.settings['description']) },
        { property: 'og:image', content: activity.coverUrl || app.settings['open_graph.image'] },
      ]}
    />
  )
}

export default ActivityPageHelmet
