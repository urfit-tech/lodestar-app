import { gql, useQuery } from '@apollo/client'
import React from 'react'
import { useIntl } from 'react-intl'
import hasura from '../../hasura'
import { commonMessages, productMessages } from '../../helpers/translation'

const ProjectPlanEnrollmentCount: React.FC<{ projectPlanId: string }> = ({ projectPlanId }) => {
  const { formatMessage } = useIntl()
  const { loading, error, data } = useQuery<
    hasura.GET_PROJECT_PLAN_ENROLLMENT_COUNT,
    hasura.GET_PROJECT_PLAN_ENROLLMENT_COUNTVariables
  >(GET_PROJECT_PLAN_ENROLLMENT_COUNT, { variables: { projectPlanId } })

  if (loading || error || !data) {
    return <span>{formatMessage(productMessages.project.paragraph.noPerson)}</span>
  }

  return (
    <span>
      {data.project_plan_by_pk?.project_plan_enrollment_count?.enrollment_count || 0}{' '}
      {formatMessage(commonMessages.unit.people)}
    </span>
  )
}

const GET_PROJECT_PLAN_ENROLLMENT_COUNT = gql`
  query GET_PROJECT_PLAN_ENROLLMENT_COUNT($projectPlanId: uuid!) {
    project_plan_by_pk(id: $projectPlanId) {
      id
      project_plan_enrollment_count {
        enrollment_count
      }
    }
  }
`

export default ProjectPlanEnrollmentCount
