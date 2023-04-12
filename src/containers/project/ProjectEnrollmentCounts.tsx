import { useQuery } from '@apollo/client'
import { Spinner } from '@chakra-ui/spinner'
import gql from 'graphql-tag'
import React from 'react'
import { useIntl } from 'react-intl'
import hasura from '../../hasura'
import { commonMessages, productMessages } from '../../helpers/translation'

const ProjectEnrollmentCounts: React.VFC<{
  projectId: string
  numberOnly?: boolean
}> = ({ projectId, numberOnly }) => {
  const { formatMessage } = useIntl()
  const { loading, error, data } = useQuery<
    hasura.GET_PROJECT_ENROLLMENT_COUNT,
    hasura.GET_PROJECT_ENROLLMENT_COUNTVariables
  >(GET_PROJECT_ENROLLMENT_COUNT, {
    variables: {
      projectId,
    },
  })

  if (loading) {
    return <Spinner />
  }

  if (error || !data) {
    return <span>{formatMessage(commonMessages.status.readingError)}</span>
  }

  const count =
    (data.project_plan_enrollment_aggregate.aggregate &&
      data.project_plan_enrollment_aggregate.aggregate.count &&
      data.project_plan_enrollment_aggregate.aggregate.count) ||
    0

  if (numberOnly) {
    return <>{count}</>
  }

  return <>{`${formatMessage(productMessages.project.paragraph.numberOfParticipants)} ${count}`}</>
}

const GET_PROJECT_ENROLLMENT_COUNT = gql`
  query GET_PROJECT_ENROLLMENT_COUNT($projectId: uuid!) {
    project_plan_enrollment_aggregate(where: { project_plan: { project_id: { _eq: $projectId } } }) {
      aggregate {
        count
      }
    }
  }
`

export default ProjectEnrollmentCounts
