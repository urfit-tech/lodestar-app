import { Skeleton } from '@chakra-ui/react'
import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import React from 'react'
import styled from 'styled-components'
import { usePublishedActivityCollection } from '../../hooks/activity'
import { ReactComponent as AngleRightIcon } from '../../images/angle-right.svg'
import { SectionTitle, StyledLink, StyledSection } from '../../pages/AppPage'
import ActivityBlock from '../activity/ActivityBlock'

const StyledAngleRightIcon = styled(AngleRightIcon)`
  display: inline-block;
`

const ActivitySection: React.VFC<{ options: { title?: string; colAmount?: number } }> = ({ options }) => {
  const { enabledModules, id: appId } = useApp()
  const { loadingActivities, errorActivities, activities } = usePublishedActivityCollection()
  const tracking = useTracking()
  const { resourceCollection } = useResourceCollection(
    activities.slice(0, options?.colAmount || 3).map(activity => `${appId}:activity:${activity.id}`),
    true,
  )

  if (loadingActivities)
    return (
      <div className="container mb-5">
        <Skeleton height="20px" my="10px" />
        <Skeleton height="20px" my="10px" />
        <Skeleton height="20px" my="10px" />
      </div>
    )

  if (activities.length === 0 || errorActivities || !enabledModules.activity) return null

  return (
    <StyledSection className="page-section">
      <Tracking.Impression resources={resourceCollection} />
      <SectionTitle>{options?.title || '實體課程'}</SectionTitle>

      <div className="container mb-5">
        <div className="row">
          {activities.slice(0, options?.colAmount || 3).map((activity, idx) => (
            <div
              key={activity.id}
              className={`col-12 col-lg-${(options?.colAmount && 12 / options?.colAmount) || 4} mb-5`}
            >
              <ActivityBlock
                id={activity.id}
                title={activity.title}
                coverUrl={activity.coverUrl || undefined}
                isParticipantsVisible={activity.isParticipantsVisible}
                onClick={() => {
                  const resource = resourceCollection[idx]
                  resource && tracking.click(resource, { position: idx + 1 })
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <StyledLink to="/activities">
          查看更多 <StyledAngleRightIcon />
        </StyledLink>
      </div>
    </StyledSection>
  )
}

export default ActivitySection
