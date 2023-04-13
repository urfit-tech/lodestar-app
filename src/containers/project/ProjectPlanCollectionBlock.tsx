import { gql, useQuery } from '@apollo/client'
import React from 'react'
import ProjectPlanCollectionBlockComponent, {
  ProjectPlanBlockProps,
} from '../../components/project/ProjectPlanCollectionBlock'
import hasura from '../../hasura'
import { notEmpty } from '../../helpers'

const ProjectPlanCollectionBlock: React.VFC<{
  memberId: string
}> = ({ memberId }) => {
  const { loading, error, data } = useQuery<
    hasura.GET_ENROLLED_PROJECT_PLANS,
    hasura.GET_ENROLLED_PROJECT_PLANSVariables
  >(GET_ENROLLED_PROJECT_PLANS, { variables: { memberId } })

  const projectPlans: ProjectPlanBlockProps[] =
    loading || error || !data
      ? []
      : data.project_plan_enrollment
          .map(projectPlan =>
            projectPlan.project_plan
              ? {
                  id: projectPlan.project_plan.id,
                  title: projectPlan.project_plan.title,
                  description: projectPlan.project_plan.description || '',
                  project: {
                    id: projectPlan.project_plan.project.id,
                    title: projectPlan.project_plan.project.title,
                    expiredAt: new Date(projectPlan.project_plan.project.expired_at),
                  },
                }
              : null,
          )
          .filter(notEmpty)

  return <ProjectPlanCollectionBlockComponent projectPlans={projectPlans} />
}

const GET_ENROLLED_PROJECT_PLANS = gql`
  query GET_ENROLLED_PROJECT_PLANS($memberId: String!) {
    project_plan_enrollment(where: { member_id: { _eq: $memberId } }, distinct_on: project_plan_id) {
      project_plan {
        id
        title
        description
        project {
          id
          title
          expired_at
        }
      }
    }
  }
`

export default ProjectPlanCollectionBlock
