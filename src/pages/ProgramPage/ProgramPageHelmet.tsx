import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import moment from 'moment'
import PageHelmet from '../../components/common/PageHelmet'
import { getBraftContent } from '../../helpers'
import { useProductReviews, useReviewAggregate } from '../../hooks/review'
import { Program } from '../../types/program'

const ProgramPageHelmet: React.VFC<{ program: Program } & Pick<React.ComponentProps<typeof PageHelmet>, 'onLoaded'>> =
  ({ program, onLoaded }) => {
    const app = useApp()
    const programPlans = program.plans.map(plan =>
      plan.salePrice !== null && moment() <= moment(plan.endedAt) ? plan.salePrice : plan.listPrice,
    )

    const { resourceCollection } = useResourceCollection([`${app.id}:program:${program.id}`])
    const { averageScore, reviewCount } = useReviewAggregate(`/programs/${program.id}`)
    const { productReviews } = useProductReviews(`/programs/${program.id}`)

    return (
      <PageHelmet
        title={program.metaTags.seo?.pageTitle || program.title}
        description={
          program.metaTags.seo?.description.slice(0, 150) ||
          getBraftContent(program.description || app.settings['description'] || '{}').slice(0, 150)
        }
        keywords={program.metaTags.seo?.keywords?.split(',') || program.tags}
        onLoaded={onLoaded}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: program.title || app.settings['title'],
            image: program.coverUrl || app.settings['open_graph.image'],
            description: getBraftContent(program.description || app.settings['description'] || '{}').slice(0, 150),
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
              offerCount: programPlans.length,
              lowPrice: Math.min(...programPlans),
              highPrice: Math.max(...programPlans),
              priceCurrency: app.settings['currency_id'] || process.env.REACT_APP_SYS_CURRENCY,
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: program.title,
            description: getBraftContent(program.description || app.settings['description'] || '{}').slice(0, 150),
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
          {
            property: 'og:title',
            content: program.metaTags.openGraph?.title || program.title || app.settings['open_graph.title'],
          },
          {
            property: 'og:description',
            content:
              program.metaTags.openGraph?.description ||
              getBraftContent(program.description || app.settings['description'] || '{}').slice(0, 150),
          },
          {
            property: 'og:image',
            content: program.metaTags.openGraph?.image || program.coverUrl || app.settings['open_graph.image'],
          },
          { property: 'og:image:alt', content: program.metaTags.openGraph?.imageAlt },
        ]}
      />
    )
  }

export default ProgramPageHelmet
