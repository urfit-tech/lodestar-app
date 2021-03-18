import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
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

  if (!data.project_plan_enrollment_aggregate.aggregate) {
    return <span>{formatMessage(productMessages.project.paragraph.zeroPerson)}</span>
  }

  return (
    <span>
      {data.project_plan_enrollment_aggregate.aggregate.count || 0} {formatMessage(commonMessages.unit.people)}
    </span>
  )
}

const GET_PROJECT_PLAN_ENROLLMENT_COUNT = gql`
  query GET_PROJECT_PLAN_ENROLLMENT_COUNT($projectPlanId: uuid!) {
    project_plan_enrollment_aggregate(where: { project_plan_id: { _eq: $projectPlanId } }) {
      aggregate {
        count
      }
    }
  }
`

export default ProjectPlanEnrollmentCount
