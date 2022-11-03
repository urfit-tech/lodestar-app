import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import moment from 'moment'
import { useContext } from 'react'
import PageHelmet from '../../components/common/PageHelmet'
import LocaleContext from '../../contexts/LocaleContext'
import { getBraftContent, getOgLocale } from '../../helpers'
import { useProductReviews, useReviewAggregate } from '../../hooks/review'
import { Program } from '../../types/program'

const ProgramPageHelmet: React.VFC<{ program: Program } & Pick<React.ComponentProps<typeof PageHelmet>, 'onLoaded'>> =
  ({ program, onLoaded }) => {
    const app = useApp()
    const { defaultLocale } = useContext(LocaleContext)
    const ogLocale = getOgLocale(defaultLocale)
    const programPlans = program.plans.map(plan =>
      plan.salePrice !== null && moment() <= moment(plan.endedAt) ? plan.salePrice : plan.listPrice,
    )

    const { resourceCollection } = useResourceCollection([`${app.id}:program:${program.id}`])
    const { averageScore, reviewCount } = useReviewAggregate(`/programs/${program.id}`)
    const { productReviews } = useProductReviews(`/programs/${program.id}`)

    return (
      <PageHelmet
        title={program.metaTag?.seo?.pageTitle || program.title}
        description={program.metaTag?.seo?.description || program.description || ''}
        keywords={program.metaTag?.seo?.keywords?.split(',') || program.tags}
        onLoaded={onLoaded}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: program.title || app.settings['title'],
            image: program.coverUrl || app.settings['open_graph.image'],
            description: getBraftContent(program.description || app.settings['description'] || '{}')?.slice(0, 150),
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
            description: getBraftContent(program.description || app.settings['description'] || '{}')?.slice(0, 150),
            provider: {
              '@type': 'Organization',
              name: app.settings['name'],
              sameAs: `https://${window.location.host}`,
            },
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
              program.metaTag?.openGraph?.title ||
              program.title ||
              app.settings['open_graph.title'] ||
              app.settings['title'],
          },
          {
            property: 'og:description',
            content: getBraftContent(
              program.metaTag?.openGraph?.description ||
                program.description ||
                app.settings['open_graph.description'] ||
                app.settings['description'] ||
                '{}',
            )?.slice(0, 150),
          },
          { property: 'og:locale', content: ogLocale },
          {
            property: 'og:image',
            content:
              program.metaTag?.openGraph?.image ||
              program.coverUrl ||
              app.settings['open_graph.image'] ||
              app.settings['logo'],
          },
          { property: 'og:image:width', content: '1200' },
          { property: 'og:image:height', content: '630' },
          { property: 'og:image:alt', content: program.metaTag?.openGraph?.imageAlt },
        ]}
      />
    )
  }

export default ProgramPageHelmet
