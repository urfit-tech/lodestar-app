import { Skeleton } from '@chakra-ui/react'
import React from 'react'
import styled from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import { usePublishedActivityCollection } from '../../hooks/activity'
import { ReactComponent as AngleRightIcon } from '../../images/angle-right.svg'
import { SectionTitle, StyledLink } from '../../pages/AppPage'
import Activity from '../activity/Activity'

const StyledSection = styled.section`
  margin-bottom: 80px;
`

const ActivitySection: React.FC<{ options: { title?: string; colAmount?: number } }> = ({ options }) => {
  const { enabledModules } = useApp()
  const { loadingActivities, errorActivities, activities } = usePublishedActivityCollection()

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
          {activities.slice(0, options.colAmount || 3).map(activity => (
            <div
              key={activity.id}
              className={`col-12 col-lg-${(options.colAmount && 12 / options.colAmount) || 4} mb-5`}
            >
              <Activity {...activity} />
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <StyledLink to="/activities">
          查看更多 <AngleRightIcon />
        </StyledLink>
      </div>
    </StyledSection>
  )
}

export default ActivitySection
