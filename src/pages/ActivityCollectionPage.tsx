import { Button, Icon, Skeleton } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { uniqBy, unnest } from 'ramda'
import React, { useContext, useEffect } from 'react'
import { AiFillAppstore } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'
import Activity from '../components/activity/Activity'
import { BREAK_POINT } from '../components/common/Responsive'
import { StyledBanner, StyledBannerTitle, StyledCollection } from '../components/layout'
import DefaultLayout from '../components/layout/DefaultLayout'
import LanguageContext from '../contexts/LanguageContext'
import { commonMessages, productMessages } from '../helpers/translation'
import { usePublishedActivityCollection } from '../hooks/activity'
import { useNav } from '../hooks/data'
import { Category } from '../types/general'

type Banner = { desktop: string; mobile: string }

const StyledButton = styled(Button)`
  && {
    height: 2.75rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    border-radius: 2rem;
  }
`

const StyledCollectionBanner = styled.div<{ src: Banner }>`
  width: 100%;
  padding-top: 280px;
  background-position: center;
  background-size: cover;
  background-image: url(${props => props.src.mobile});
  @media (min-width: ${BREAK_POINT}px) {
    background-image: url(${props => props.src.desktop});
  }
`

const StyledSkeleton = styled(Skeleton)`
  width: 96px;
  height: 28px;
`

const ActivityCollectionPage = () => {
  const [active = null] = useQueryParam('categories', StringParam)
  const [classification = null, setClassification] = useQueryParam('classification', StringParam)
  const [noSelector] = useQueryParam('noSelector', BooleanParam)
  const [noTitle] = useQueryParam('noTitle', BooleanParam)
  const location = useLocation()
  const { settings, currencyId: appCurrencyId, id: appId } = useApp()
  const { loading, navs } = useNav()
  const { currentLanguage } = useContext(LanguageContext)
  const pageTitle = navs.find(
    nav =>
      nav.locale === currentLanguage && nav.href === `${location.pathname}${active ? `?categories=${active}` : ''}`,
  )?.label
  const { formatMessage } = useIntl()
  const { loadingActivities, errorActivities, activities } = usePublishedActivityCollection({
    categoryId: active ? active : undefined,
  })

  const categories: Category[] = uniqBy(
    category => category.id,
    unnest(activities.map(activity => activity.categories)),
  )

  let collectionBanner: Banner | null
  try {
    collectionBanner = classification ? JSON.parse(settings['activity.collection.banner'])[classification] : null
  } catch {
    collectionBanner = null
  }
  useEffect(() => {
    if (activities && settings['tracking.gtm_id']) {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({ ecommerce: null })
      ;(window as any).dataLayer.push({
        ecommerce: {
          currencyCode: appCurrencyId,
          impressions: activities
            .filter(
              activity =>
                classification === null || activity.categories.some(category => category.id === classification),
            )
            .filter(
              activity =>
                !activity.supportLocales || activity.supportLocales.find(locale => locale === currentLanguage),
            )
            .map((activity, index) => ({
              name: activity.title,
              id: activity.id,
              brand: settings['title'] || appId,
              category: activity.categories.map(category => category.name).join('|'),
              variant: activity.organizerId,
              list: 'Activity',
              position: index + 1,
            })),
        },
      })
    }
  }, [activities, currentLanguage, classification])

  return (
    <DefaultLayout white>
      {collectionBanner && <StyledCollectionBanner src={collectionBanner}></StyledCollectionBanner>}
      <StyledBanner>
        <div className="container">
          {!noTitle && (
            <StyledBannerTitle className="d-flex align-items-center">
              <Icon as={AiFillAppstore} className="mr-3" />
              <span>
                {loading ? (
                  <StyledSkeleton height="28px" />
                ) : (
                  pageTitle ||
                  categories.find(category => category.id === active)?.name ||
                  formatMessage(productMessages.activity.title.default)
                )}
              </span>
            </StyledBannerTitle>
          )}

          {!noSelector && (
            <>
              <StyledButton
                colorScheme="primary"
                variant={classification === null ? 'solid' : 'outline'}
                className="mb-2"
                onClick={() => setClassification(null)}
              >
                {formatMessage(commonMessages.button.allCategory)}
              </StyledButton>
              {categories
                .filter(category => category.id !== active)
                .map(category => (
                  <StyledButton
                    key={category.id}
                    colorScheme="primary"
                    variant={classification === category.id ? 'solid' : 'outline'}
                    className="ml-2 mb-2"
                    onClick={() => setClassification(category.id)}
                  >
                    {category.name}
                  </StyledButton>
                ))}
            </>
          )}
        </div>
      </StyledBanner>

      <StyledCollection>
        <div className="container">
          {loadingActivities && <Skeleton />}
          {errorActivities && <div>{formatMessage(commonMessages.status.readingError)}</div>}

          <div className="row">
            {activities
              .filter(
                activity =>
                  classification === null || activity.categories.some(category => category.id === classification),
              )
              .filter(
                activity =>
                  !activity.supportLocales || activity.supportLocales.find(locale => locale === currentLanguage),
              )
              .map(activity => (
                <div key={activity.id} className="col-12 col-md-6 col-lg-4 mb-4">
                  <Activity {...activity} />
                </div>
              ))}
          </div>
        </div>
      </StyledCollection>
    </DefaultLayout>
  )
}

export default ActivityCollectionPage
