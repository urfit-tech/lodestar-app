import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import moment from 'moment'
import PageHelmet from '../../components/common/PageHelmet'
import { useProductReviews, useReviewAggregate } from '../../hooks/review'
import { ProjectProps } from '../../types/project'

const ProjectPageHelmet: React.VFC<{ project: ProjectProps }> = ({ project }) => {
  const app = useApp()
  const projectPlans =
    project?.projectPlans?.map(plan =>
      plan.salePrice !== null && moment() <= moment(plan.soldAt) ? plan.salePrice : plan.listPrice,
    ) || []

  const { resourceCollection } = useResourceCollection([`${app.id}:project:${project.id}`])
  const { averageScore, reviewCount } = useReviewAggregate(`/projects/${project.id}`)
  const { productReviews } = useProductReviews(`/projects/${project.id}`)

  return (
    <PageHelmet
      title={project.title}
      description={project.abstract || app.settings['description']}
      keywords={[]}
      jsonLd={[
        {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: project.title || app.settings['title'],
          image: project.coverUrl || app.settings['open_graph.image'],
          description: project.abstract || app.settings['description'],
          sku: resourceCollection[0]?.sku,
          mpn: project.id,
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
          // google search console says reviewCount must be a positive integer
          ...(Math.floor(reviewCount) > 0 && {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: averageScore,
              reviewCount: Math.floor(reviewCount),
            },
          }),
          offers: {
            '@type': 'AggregateOffer',
            offerCount: projectPlans.length,
            lowPrice: Math.min(...projectPlans),
            highPrice: Math.max(...projectPlans),
            priceCurrency: app.settings['currency_id'] || process.env.REACT_APP_SYS_CURRENCY,
          },
        },
      ]}
      openGraph={[
        { property: 'fb:app_id', content: app.settings['auth.facebook_app_id'] },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: window.location.href },
        { property: 'og:title', content: project.title || app.settings['open_graph.title'] },
        { property: 'og:description', content: project.abstract || app.settings['description'] },
        { property: 'og:image', content: project.coverUrl || app.settings['open_graph.image'] },
      ]}
    />
  )
}

export default ProjectPageHelmet
