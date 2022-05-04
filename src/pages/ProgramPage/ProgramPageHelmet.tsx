import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import moment from 'moment'
import PageHelmet from '../../components/common/PageHelmet'
import { useProductReviews, useReviewAggregate } from '../../hooks/review'
import { Program } from '../../types/program'

const ProgramPageHelmet: React.VFC<{ program: Program }> = ({ program }) => {
  const app = useApp()
  const programPlans = program.plans.map(plan =>
    plan.salePrice !== null && moment() <= moment(plan.endedAt) ? plan.salePrice : plan.listPrice,
  )

  const { resourceCollection } = useResourceCollection([`${app.id}:program:${program.id}`])
  const { averageScore, reviewCount } = useReviewAggregate(`/programs/${program.id}`)
  const { productReviews } = useProductReviews(`/programs/${program.id}`)

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
          sku: resourceCollection[0]?.sku,
          mpn: program.id,
          brand: {
            '@type': 'Brand',
            name: app.settings['title'],
          },
          review: productReviews.map(review => ({
            '@type': 'Review',
            reviewRating: {
              '@type': 'Rating',
              ratingValue: review?.score || 0,
              bestRating: '5',
            },
            author: {
              '@type': 'Person',
              name: review?.memberName || review?.memberId || '',
            },
          })),
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: averageScore,
            reviewCount: reviewCount,
          },
          offers: {
            '@type': 'AggregateOffer',
            offerCount: programPlans.length,
            lowPrice: Math.min(...programPlans),
            highPrice: Math.max(...programPlans),
            priceCurrency: app.settings['currency_id'] || process.env.SYS_CURRENCY,
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: program.title,
          description: program.abstract?.slice(0, 60),
          provider: {
            '@type': 'Organization',
            name: app.settings['name'],
            sameAs: `https://${window.location.host}`,
          },
        },
      ]}
      openGraph={[
        { property: 'fb:app_id', content: app.settings['auth.facebook_app_id'] },
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
