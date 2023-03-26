import { Button, Icon, Skeleton } from '@chakra-ui/react'
import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import { prop, sortBy, uniqBy, unnest } from 'ramda'
import React, { useContext } from 'react'
import { AiFillAppstore } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { DeepPick } from 'ts-deep-pick/lib'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'
import ActivityBlock from '../../components/activity/ActivityBlock'
import { BREAK_POINT } from '../../components/common/Responsive'
import { StyledBanner, StyledBannerTitle, StyledCollection } from '../../components/layout'
import DefaultLayout from '../../components/layout/DefaultLayout'
import LocaleContext from '../../contexts/LocaleContext'
import { commonMessages, productMessages } from '../../helpers/translation'
import { usePublishedActivityCollection } from '../../hooks/activity'
import { useNav } from '../../hooks/data'
import { Activity } from '../../types/activity'
import { Category } from '../../types/general'
import ActivityCollectionPageHelmet from './ActivityCollectionPageHelmet'

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
  const { settings } = useApp()
  const { loading, navs } = useNav()
  const { currentLocale } = useContext(LocaleContext)
  const pageTitle = navs.find(
    nav => nav.locale === currentLocale && nav.href === `${location.pathname}${active ? `?categories=${active}` : ''}`,
  )?.label
  const { formatMessage } = useIntl()
  const { loadingActivities, errorActivities, activities, title } = usePublishedActivityCollection({
    categoryId: active ? active : undefined,
  })

  const categories: Category[] = sortBy(prop('position'))(
    uniqBy(category => category.id, unnest(activities.map(activity => activity.categories))),
  )

  let collectionBanner: Banner | null
  try {
    collectionBanner = classification ? JSON.parse(settings['activity.collection.banner'])[classification] : null
  } catch {
    collectionBanner = null
  }

  const activityCollectionPageTitle =
    title ||
    pageTitle ||
    categories.find(category => category.id === active)?.name ||
    formatMessage(productMessages.activity.title.default)

  const filteredActivities = activities
    .filter(activity => classification === null || activity.categories.some(category => category.id === classification))
    .filter(activity => !activity.supportLocales || activity.supportLocales.find(locale => locale === currentLocale))

  return (
    <DefaultLayout white>
      <ActivityCollectionPageHelmet title={activityCollectionPageTitle} activities={filteredActivities} />
      {collectionBanner && <StyledCollectionBanner src={collectionBanner}></StyledCollectionBanner>}
      <StyledBanner>
        <div className="container">
          {!noTitle && (
            <StyledBannerTitle className="d-flex align-items-center">
              <Icon as={AiFillAppstore} className="mr-3" />
              <span>{loading ? <StyledSkeleton height="28px" /> : activityCollectionPageTitle}</span>
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
          <ActivityCollection activities={filteredActivities} />
        </div>
      </StyledCollection>
    </DefaultLayout>
  )
}

const ActivityCollection: React.FC<{
  activities: DeepPick<
    Activity,
    'id' | 'title' | 'coverUrl' | 'isParticipantsVisible' | 'participantCount' | 'totalSeats' | 'startedAt' | 'endedAt'
  >[]
}> = ({ activities }) => {
  const { id: appId } = useApp()
  const tracking = useTracking()
  const { resourceCollection } = useResourceCollection(
    activities.map(activity => `${appId}:activity:${activity.id}`),
    true,
  )

  return (
    <div className="row">
      <Tracking.Impression resources={resourceCollection} />

      {activities.map((activity, idx) => (
        <div key={activity.id} className="col-12 col-md-6 col-lg-4 mb-4">
          <ActivityBlock
            id={activity.id}
            title={activity.title}
            coverUrl={activity.coverUrl || undefined}
            isParticipantsVisible={activity.isParticipantsVisible}
            participantCount={activity.participantCount}
            totalSeats={activity.totalSeats}
            startedAt={activity.startedAt || undefined}
            endedAt={activity.endedAt || undefined}
            onClick={() => {
              const resource = resourceCollection[idx]
              resource && tracking.click(resource, { position: idx + 1 })
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default ActivityCollectionPage
