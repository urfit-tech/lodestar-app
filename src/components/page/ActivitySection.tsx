import { Skeleton } from '@chakra-ui/react'
import React from 'react'
import styled from 'styled-components'
import { usePublishedActivityCollection } from '../../hooks/activity'
import { ReactComponent as AngleRightIcon } from '../../images/angle-right.svg'
import { SectionTitle, StyledLink } from '../../pages/AppPage'
import Activity from '../activity/Activity'

const StyledSection = styled.section`
  margin-bottom: 80px;
`

const ActivitySection: React.FC<{ options: any }> = ({ options }) => {
  const { loadingActivities, errorActivities, activities } = usePublishedActivityCollection()

  if (loadingActivities || errorActivities)
    return (
      <div className="container mb-5">
        <Skeleton height="20px" my="10px" />
        <Skeleton height="20px" my="10px" />
        <Skeleton height="20px" my="10px" />
      </div>
    )

  return (
    <StyledSection className="page-section">
      <SectionTitle>{options.title ? options.title : '實體課程'}</SectionTitle>

      <div className="container mb-5">
        <div className="row">
          {activities.slice(0, options.colAmount || 3).map(activity => (
            <div key={activity.id} className={`col-12 col-lg-${12 / options.colAmount || 4}`}>
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
