import { useQuery } from '@apollo/react-hooks'
import { Skeleton, Typography } from 'antd'
import gql from 'graphql-tag'
import { flatten, uniq } from 'ramda'
import React, { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { commonMessages, productMessages } from '../../helpers/translation'
import types from '../../types'
import ProgramCard from './ProgramCard'

const EnrolledProgramCollectionBlock: React.FC<{ memberId: string }> = ({ memberId }) => {
  const { formatMessage } = useIntl()
  const { loading, error, data, refetch } = useQuery<types.GET_OWNED_PROGRAMS, types.GET_OWNED_PROGRAMSVariables>(
    GET_OWNED_PROGRAMS,
    { variables: { memberId } },
  )

  useEffect(() => {
    refetch && refetch()
  })

  if (loading) {
    return (
      <div className="container py-3">
        <Typography.Title level={4}>{formatMessage(productMessages.program.title.course)}</Typography.Title>
        <Skeleton active avatar />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="container py-3">
        <Typography.Title level={4}>{formatMessage(productMessages.program.title.course)}</Typography.Title>
        <div>{formatMessage(commonMessages.status.loadingUnable)}</div>
      </div>
    )
  }

  const programIds = uniq(
    flatten([
      ...data.program_enrollment.map(programEnrollment => programEnrollment.program_id),
      ...data.program_plan_enrollment.map(programPlanEnrollment =>
        programPlanEnrollment.program_plan ? programPlanEnrollment.program_plan.program_id : null,
      ),
    ]),
  )

  return (
    <div className="container py-3">
      <Typography.Title level={4}>{formatMessage(productMessages.program.title.course)}</Typography.Title>

      {programIds.length === 0 ? (
        <div>{formatMessage(productMessages.program.content.noProgram)}</div>
      ) : (
        <div className="row">
          {programIds.map(programId => (
            <div key={programId} className="col-12 mb-4 col-md-6 col-lg-4">
              <ProgramCard memberId={memberId} programId={programId} withProgress={true} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const GET_OWNED_PROGRAMS = gql`
  query GET_OWNED_PROGRAMS($memberId: String!) {
    program_enrollment(where: { member_id: { _eq: $memberId } }) {
      program_id
    }
    program_plan_enrollment(where: { member_id: { _eq: $memberId } }) {
      program_plan {
        program_id
      }
    }
  }
`

export default EnrolledProgramCollectionBlock
