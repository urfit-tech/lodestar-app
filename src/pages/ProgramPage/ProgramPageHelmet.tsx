import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import moment from 'moment'
import PageHelmet from '../../components/common/PageHelmet'
import { Program } from '../../types/program'

const ProgramPageHelmet: React.VFC<{ program: Program }> = ({ program }) => {
  const app = useApp()
  const programPlans = program.plans.map(plan =>
    plan.salePrice !== null && moment() <= moment(plan.endedAt) ? plan.salePrice : plan.listPrice,
  )

  return (
    <PageHelmet
      title={program.title}
      description={program.abstract || app.settings['description']}
      keywords={program.tags}
      jsonLd={[
        {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: program.title || app.settings['title'],
          image: program.coverUrl || app.settings['open_graph.image'],
          description: program.abstract || app.settings['description'],
          // TODO: add program SKU
          // sku: program.sku,
          mpn: program.id,
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
            offerCount: programPlans.length,
            lowPrice: Math.min(...programPlans),
            highPrice: Math.max(...programPlans),
            priceCurrency: app.settings['currency_id'] || process.env.SYS_CURRENCY,
          },
        },
      ]}
      openGraph={[
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: window.location.href },
        { property: 'og:title', content: program.title || app.settings['open_graph.title'] },
        { property: 'og:description', content: program.abstract || app.settings['description'] },
        { property: 'og:image', content: program.coverUrl || app.settings['open_graph.image'] },
      ]}
    />
  )
}

export default ProgramPageHelmet
