import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import moment from 'moment'
import { useContext } from 'react'
import PageHelmet from '../../components/common/PageHelmet'
import LocaleContext from '../../contexts/LocaleContext'
import { getBraftContent, getOgLocale } from '../../helpers'
import { useProductReviews, useReviewAggregate } from '../../hooks/review'
import { ProgramPackage } from '../../types/programPackage'

const ProgramPackagePageHelmet: React.VFC<{ programPackage: ProgramPackage }> = ({ programPackage }) => {
  const app = useApp()
  const { defaultLocale } = useContext(LocaleContext)
  const ogLocale = getOgLocale(defaultLocale)
  const allPlanPrice = programPackage.plans.map(plan =>
    plan.salePrice !== null && moment() <= moment(plan.soldAt) ? plan.salePrice : plan.listPrice,
  )

  const { resourceCollection } = useResourceCollection([`${app.id}:program_package:${programPackage.id}`])
  const { averageScore, reviewCount } = useReviewAggregate(`/program-packages/${programPackage.id}`)
  const { productReviews } = useProductReviews(`/program-packages/${programPackage.id}`)

  return (
    <PageHelmet
      title={programPackage.metaTag?.seo?.pageTitle || programPackage.title}
      description={programPackage.metaTag?.seo?.description || programPackage.description || ''}
      keywords={
        programPackage.metaTag?.seo?.keywords?.split(',') || programPackage.programs.map(program => program.title)
      }
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
            offerCount: allPlanPrice.length,
            lowPrice: Math.min(...allPlanPrice),
            highPrice: Math.max(...allPlanPrice),
            priceCurrency: app.settings['currency_id'] || process.env.REACT_APP_SYS_CURRENCY,
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
            programPackage.metaTag?.openGraph?.title ||
            programPackage.title ||
            app.settings['open_graph.title'] ||
            app.settings['title'],
        },
        {
          property: 'og:description',
          content: getBraftContent(
            programPackage.metaTag?.openGraph?.description ||
              programPackage.description ||
              app.settings['open_graph.description'] ||
              app.settings['description'] ||
              '{}',
          )?.slice(0, 150),
        },
        { property: 'og:locale', content: ogLocale },
        {
          property: 'og:image',
          content:
            programPackage.metaTag?.openGraph?.image ||
            programPackage.coverUrl ||
            app.settings['open_graph.image'] ||
            app.settings['logo'],
        },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: programPackage.metaTag?.openGraph?.imageAlt || '' },
      ]}
    />
  )
}

export default ProgramPackagePageHelmet
