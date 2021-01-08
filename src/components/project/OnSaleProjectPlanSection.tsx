import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { productMessages } from '../../helpers/translation'
import { ProjectPlanProps } from '../../types/project'
import { CommonTitleMixin } from '../common'
import { BREAK_POINT } from '../common/Responsive'
import ProjectPlanCard from './ProjectPlanCard'

const StyledSection = styled.section`
  background-color: var(--gray-lighter);
`
const StyledWrapper = styled.section`
  padding: 60px 20px;
  > h3 {
    text-align: center;
    font-size: 28px;
    font-weight: bold;
    letter-spacing: 0.23px;
    color: var(--gray-darker);
  }
  > p {
    ${CommonTitleMixin}
    margin: 0 auto;
    text-align: center;
    width: 100%;
    max-width: 320px;
    padding-bottom: 40px;
  }
  @media (min-width: ${BREAK_POINT}px) {
    padding: 120px 0;
    > h3 {
      font-size: 40px;
      letter-spacing: 1px;
      color: var(--gray-darker);
    }
    > p {
      width: 100%;
      padding-bottom: 64px;
    }
  }
`
const StyledContainer = styled.div`
  margin: 0 auto;
  max-width: 348px;

  > div {
    padding-bottom: 20px;
  }

  @media (min-width: ${BREAK_POINT}px) {
    width: 100%;
    max-width: 700px;
  }
`

const OnSaleProjectPlanSection: React.FC<{
  projectPlans: ProjectPlanProps[]
}> = ({ projectPlans }) => {
  const { formatMessage } = useIntl()

  return (
    <StyledSection id="project-plan-section">
      <StyledWrapper>
        <h3>{formatMessage(productMessages.project.title.intro)}</h3>
        <p>{formatMessage(productMessages.project.paragraph.intro)}</p>
        <StyledContainer className="row">
          {projectPlans.map(projectPlan => (
            <div key={projectPlan.id} className="col-lg-6 col-12">
              <ProjectPlanCard {...projectPlan} />
            </div>
          ))}
        </StyledContainer>
      </StyledWrapper>
    </StyledSection>
  )
}

export default OnSaleProjectPlanSection
