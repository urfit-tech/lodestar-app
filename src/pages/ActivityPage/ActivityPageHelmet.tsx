import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { DeepPick } from 'ts-deep-pick/lib'
import PageHelmet from '../../components/common/PageHelmet'
import { getBraftContent } from '../../helpers'
import { Activity } from '../../types/activity'

// FIXME: it should change to another structured data
// https://developers.google.com/search/docs/advanced/structured-data/event
type ActivityPageHelmetProps = DeepPick<Activity, 'id' | 'title' | 'description' | 'coverUrl' | 'tags' | 'tickets'>
const ActivityPageHelmet: React.VFC<{ activity: ActivityPageHelmetProps }> = ({ activity }) => {
  const app = useApp()

  return (
    <PageHelmet
      title={activity.title}
      description={getBraftContent(activity.description || app.settings['description'])}
      keywords={activity.tags}
      jsonLd={[
        {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: activity.title || app.settings['title'],
          image: activity.coverUrl || app.settings['open_graph.image'],
          description: getBraftContent(activity.description || app.settings['description']),
          // TODO: add activity SKU
          // sku: activity.sku,
          mpn: activity.id,
          brand: {
            '@type': 'Brand',
            name: app.settings['title'],
          },
          // TODO: add review and rating
          // review: {
          //   '@type': 'Review',
          //   reviewRating: {
          //     '@type': 'Rating',
          //     ratingValue: '4',
          //     bestRating: '5',
          //   },
          //   author: {
          //     '@type': 'Person',
          //     name: 'Fred Benson',
          //   },
          // },
          // aggregateRating: {
          //   '@type': 'AggregateRating',
          //   ratingValue: '4.4',
          //   reviewCount: '89',
          // },
          offers: {
            '@type': 'AggregateOffer',
            offerCount: activity.tickets.length,
            lowPrice: Math.min(...activity.tickets.map(activityTicket => activityTicket.price)),
            highPrice: Math.max(...activity.tickets.map(activityTicket => activityTicket.price)),
            priceCurrency: app.settings['currency_id'] || process.env.SYS_CURRENCY,
          },
        },
      ]}
      openGraph={[
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
