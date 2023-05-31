import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import moment from 'moment'
import { useContext } from 'react'
import PageHelmet from '../../components/common/PageHelmet'
import LocaleContext from '../../contexts/LocaleContext'
import { getBraftContent, getOgLocale } from '../../helpers'
import { useProductReviews, useReviewAggregate } from '../../hooks/review'
import { ProjectProps } from '../../types/project'

const ProjectPageHelmet: React.VFC<{ project: ProjectProps }> = ({ project }) => {
  const app = useApp()
  const projectPlans =
    project?.projectPlans?.map(plan =>
      plan.salePrice !== null && moment() <= moment(plan.soldAt) ? plan.salePrice : plan.listPrice,
    ) || []
  const { defaultLocale } = useContext(LocaleContext)
  const ogLocale = getOgLocale(defaultLocale)
  const { resourceCollection } = useResourceCollection([`${app.id}:project:${project.id}`])
  const { averageScore, reviewCount } = useReviewAggregate(`/projects/${project.id}`)
  const { productReviews } = useProductReviews(`/projects/${project.id}`)

  return (
    <PageHelmet
      title={project.metaTag?.seo?.pageTitle || project.title}
      description={project.metaTag?.seo?.description || project.abstract || app.settings['description']}
      keywords={project.metaTag?.seo?.keywords?.split(',') || []}
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
          review:
            productReviews.length > 0
              ? productReviews.map(review => ({
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
                }))
              : {
                  '@type': 'Review',
                  reviewRating: {
                    '@type': 'Rating',
                    ratingValue: '5',
                    bestRating: '5',
                  },
                  author: {
                    '@type': 'Person',
                    name: app.settings['title'],
                  },
                },
          // google search console says reviewCount must be a positive integer
          ...(Math.floor(reviewCount) > 0
            ? {
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: averageScore,
                  reviewCount: Math.floor(reviewCount),
                },
              }
            : {
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: 5,
                  reviewCount: 1,
                },
              }),
          ...(projectPlans.length > 0 && {
            offers: {
              '@type': 'AggregateOffer',
              offerCount: projectPlans.length,
              lowPrice: Math.min(...projectPlans),
              highPrice: Math.max(...projectPlans),
              priceCurrency: app.settings['currency_id'] || process.env.REACT_APP_SYS_CURRENCY,
            },
          }),
        },
      ]}
      openGraph={[
        { property: 'fb:app_id', content: app.settings['auth.facebook_app_id'] },
        { property: 'og:site_name', content: app.settings['name'] },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: window.location.href },
        {
          property: 'og:title',
          content:
            project.metaTag?.openGraph?.title ||
            project.title ||
            app.settings['open_graph.title'] ||
            app.settings['title'],
        },
        {
          property: 'og:description',
          content: getBraftContent(
            project?.metaTag?.openGraph?.description ||
              project?.description ||
              project.abstract ||
              app.settings['open_graph.description'] ||
              app.settings['description'] ||
              '{}',
          )?.slice(0, 150),
        },
        { property: 'og:locale', content: ogLocale },
        {
          property: 'og:image',
          content:
            project.metaTag?.openGraph?.image ||
            project.previewUrl ||
            app.settings['open_graph.image'] ||
            app.settings['logo'],
        },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: project.metaTag?.openGraph?.imageAlt },
      ]}
    />
  )
}

export default ProjectPageHelmet
