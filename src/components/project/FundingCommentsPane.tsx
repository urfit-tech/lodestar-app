import React from 'react'
import styled from 'styled-components'
import { FundingCommentProps, ProjectPlanProps } from '../../types/project'
import { AvatarImage } from '../common/Image'
import ProjectPlanCollection from './ProjectPlanCollection'

const StyledWrapper = styled.div`
  margin-bottom: 2.5rem;
  font-size: 14px;
`
const StyledTitle = styled.div`
  margin-bottom: 0.5rem;
  font-size: 16px;
  font-weight: bold;
`
const StyledDescription = styled.div`
  padding-left: 4rem;
  color: #585858;
  text-align: justify;
  line-height: 1.5;
  letter-spacing: 0.18px;
`

const FundingCommentsPane: React.VFC<{
  comments: FundingCommentProps[]
  projectPlans: ProjectPlanProps[]
}> = ({ comments, projectPlans }) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-lg-8 mb-5">
          {comments.map((comment, index) => (
            <StyledWrapper key={index}>
              <div className="d-flex align-items-center">
                <AvatarImage src={comment.avatar} size={48} background="white" />
                <span className="ml-3">{comment.name}</span>
              </div>
              <StyledDescription>
                {!!comment.title && <StyledTitle>{comment.title}</StyledTitle>}
                <p>{comment.description}</p>
              </StyledDescription>
            </StyledWrapper>
          ))}
        </div>
        <div className="col-12 col-lg-4 mb-5">
          <ProjectPlanCollection projectPlans={projectPlans} />
        </div>
      </div>
    </div>
  )
}

export default FundingCommentsPane
