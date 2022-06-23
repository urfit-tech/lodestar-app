import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import moment from 'moment'
import PageHelmet from '../../components/common/PageHelmet'
import { getBraftContent } from '../../helpers'
import { useProductReviews, useReviewAggregate } from '../../hooks/review'
import { ProgramPackage } from '../../types/programPackage'

const ProgramPackagePageHelmet: React.VFC<{ programPackage: ProgramPackage }> = ({ programPackage }) => {
  const app = useApp()
  const allPlanPrice = programPackage.plans.map(plan =>
    plan.salePrice !== null && moment() <= moment(plan.soldAt) ? plan.salePrice : plan.listPrice,
  )

  const { resourceCollection } = useResourceCollection([`${app.id}:program_package:${programPackage.id}`])
  const { averageScore, reviewCount } = useReviewAggregate(`/program-packages/${programPackage.id}`)
  const { productReviews } = useProductReviews(`/program-packages/${programPackage.id}`)

  return (
    <PageHelmet
      title={programPackage.title}
      description={programPackage.description || app.settings['description']}
      keywords={programPackage.programs.map(program => program.title)}
      jsonLd={[
        {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: programPackage.title || app.settings['title'],
          image: programPackage.coverUrl || app.settings['open_graph.image'],
          description: getBraftContent(programPackage.description || app.settings['description'] || '{}'),
          sku: resourceCollection[0]?.sku,
          mpn: programPackage.id,
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
            offerCount: allPlanPrice.length,
            lowPrice: Math.min(...allPlanPrice),
            highPrice: Math.max(...allPlanPrice),
            priceCurrency: app.settings['currency_id'] || process.env.SYS_CURRENCY,
          },
        },
      ]}
      openGraph={[
        { property: 'fb:app_id', content: app.settings['auth.facebook_app_id'] },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: window.location.href },
        { property: 'og:title', content: programPackage.title || app.settings['open_graph.title'] },
        {
          property: 'og:description',
          content: getBraftContent(programPackage.description || app.settings['description'] || '{}').slice(0, 150),
        },
        { property: 'og:image', content: programPackage.coverUrl || app.settings['open_graph.image'] },
      ]}
    />
  )
}

export default ProgramPackagePageHelmet
