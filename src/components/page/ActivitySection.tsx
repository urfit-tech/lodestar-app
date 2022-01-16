import { Skeleton } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { usePublishedActivityCollection } from '../../hooks/activity'
import { ReactComponent as AngleRightIcon } from '../../images/angle-right.svg'
import { SectionTitle, StyledLink, StyledSection } from '../../pages/AppPage'
import Activity from '../activity/Activity'

const StyledAngleRightIcon = styled(AngleRightIcon)`
  display: inline-block;
`

const ActivitySection: React.VFC<{ options: { title?: string; colAmount?: number } }> = ({ options }) => {
  const tracking = useTracking()
  const { enabledModules, settings, currencyId: appCurrencyId, id: appId } = useApp()
  const { loadingActivities, errorActivities, activities } = usePublishedActivityCollection()

  useEffect(() => {
    !loadingActivities && tracking.impress(activities.map(activity => ({ type: 'activity', id: activity.id })))
  }, [activities, loadingActivities, tracking])

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
      <SectionTitle>{options?.title || '實體課程'}</SectionTitle>

      <div className="container mb-5">
        <div className="row">
          {activities.slice(0, options?.colAmount || 3).map(activity => (
            <div
              key={activity.id}
              className={`col-12 col-lg-${(options?.colAmount && 12 / options?.colAmount) || 4} mb-5`}
            >
              <Activity {...activity} />
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
