import { Divider, Tag } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { commonMessages } from '../../helpers/translation'
import { BraftContent } from '../common/StyledBraftEditor'

const StyledWrapper = styled.div`
  padding: 2rem;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.15);
`
const StyledProjectTitle = styled.div`
  color: var(--gray-darker);
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 0.2px;
`
const StyledTag = styled(Tag)`
  && {
    border-color: #cdcdcd;
    color: #9b9b9b;
    background: #f7f8f8;
  }
  &&.active {
    border-color: ${props => props.theme['@primary-color']};
    color: ${props => props.theme['@primary-color']};
    background: ${props => props.theme['@processing-color']};
  }
`
const StyledProjectPlanTitle = styled.div`
  color: var(--gray-darker);
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.8px;
`
const StyledDescription = styled.div`
  font-size: 14px;
`

const ProjectPlanCollectionBlock: React.FC<{
  projectPlans: ProjectPlanBlockProps[]
}> = ({ projectPlans }) => {
  return (
    <div className="container py-3">
      <div className="row">
        {projectPlans.map(projectPlan => (
          <div key={projectPlan.id} className="col-12 mb-4 col-sm-6 col-md-4">
            <Link to={`/projects/${projectPlan.project.id}`}>
              <ProjectPlanBlock {...projectPlan} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export type ProjectPlanBlockProps = {
  id: string
  title: string
  description: string | null
  project: {
    id: string
    title: string
    expiredAt: Date | null
  }
}
const ProjectPlanBlock: React.FC<ProjectPlanBlockProps> = ({ title, description, project }) => {
  const { formatMessage } = useIntl()
  const isExpired = project.expiredAt && project.expiredAt.getTime() < Date.now()

  return (
    <StyledWrapper>
      <StyledProjectTitle className="mb-4">{project.title}</StyledProjectTitle>
      <StyledTag className={isExpired ? '' : 'active'}>
        {isExpired ? formatMessage(commonMessages.status.projectFinished) : formatMessage(commonMessages.status.onSale)}
      </StyledTag>

      <Divider />

      <StyledProjectPlanTitle className="mb-3">{title}</StyledProjectPlanTitle>
      <StyledDescription>
        <BraftContent>{description}</BraftContent>
      </StyledDescription>
    </StyledWrapper>
  )
}

export default ProjectPlanCollectionBlock
