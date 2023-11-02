import { Timeline, Typography } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { ProjectPlanProps } from '../../types/project'
import ProjectPlanCollection from './ProjectPlanCollection'

const StyledTimeline = styled(Timeline)`
  .ant-timeline-item-content {
    margin-left: 3rem;
  }

  img {
    margin-bottom: 1.25rem;
    width: 100%;
  }
`
const StyledTitle = styled(Typography.Title)`
  && {
    margin-bottom: 0.5rem;
    font-size: 20px;
  }
`
const StyledMeta = styled.div`
  margin-bottom: 1rem;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
`
const StyledParagraph = styled(Typography.Paragraph)`
  && {
    color: #585858;
    font-size: 14px;
    text-align: justify;
  }
`

const FundingUpdatesPane: React.VFC<{
  updates: {
    date: string
    cover?: string
    title: string
    description: string
  }[]
  projectPlans: ProjectPlanProps[]
  publishedAt: Date | null
}> = ({ updates, projectPlans, publishedAt }) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-lg-8 mb-5">
          <StyledTimeline>
            {updates.map((update, index) => (
              <Timeline.Item key={index}>
                <StyledTitle level={2}>{update.title}</StyledTitle>
                <StyledMeta>{update.date}</StyledMeta>
                {update.cover && <img src={update.cover} alt={update.title} />}
                <StyledParagraph>{update.description}</StyledParagraph>
              </Timeline.Item>
            ))}
          </StyledTimeline>
        </div>
        <div className="col-12 col-lg-4 mb-5">
          <ProjectPlanCollection projectPlans={projectPlans} publishedAt={publishedAt} />
        </div>
      </div>
    </div>
  )
}

export default FundingUpdatesPane
