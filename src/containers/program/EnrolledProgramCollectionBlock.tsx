import { useQuery } from '@apollo/react-hooks'
import { HStack, useRadioGroup } from '@chakra-ui/react'
import { Skeleton, Typography } from 'antd'
import gql from 'graphql-tag'
import { flatten, uniq } from 'ramda'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import RadioCard from '../../components/RadioCard'
import hasura from '../../hasura'
import { commonMessages, productMessages, programMessages } from '../../helpers/translation'
import ProgramCard from './ProgramCard'

const EnrolledProgramCollectionBlock: React.VFC<{ memberId: string }> = ({ memberId }) => {
  const { formatMessage } = useIntl()
  const [isExpired, setIsExpired] = useState(false)

  const {
    loading: loadingOwnedPrograms,
    error: errorOwnedPrograms,
    data: ownedPrograms,
    refetch: refetchOwnedPrograms,
  } = useQuery<hasura.GET_OWNED_PROGRAMS, hasura.GET_OWNED_PROGRAMSVariables>(GET_OWNED_PROGRAMS, {
    variables: { memberId },
  })

  const {
    loading: loadingExpiredOwnedPrograms,
    error: errorExpiredOwnedPrograms,
    data: expiredOwnedPrograms,
    refetch: refetchExpiredOwnedPrograms,
  } = useQuery<hasura.GET_OWNED_EXPIRED_PROGRAMS, hasura.GET_OWNED_EXPIRED_PROGRAMSVariables>(
    GET_OWNED_EXPIRED_PROGRAMS,
    {
      variables: { memberId },
    },
  )
  const {
    loading: loadingExpiredProgramByProgramPlans,
    error: errorExpiredProgramByProgramPlans,
    data: expiredProgramByProgramPlans,
    refetch: refetchExpiredProgramByProgramPlans,
  } = useQuery<hasura.GET_PROGRAM_IDS_BY_PROGRAM_PLAN_IDS, hasura.GET_PROGRAM_IDS_BY_PROGRAM_PLAN_IDSVariables>(
    GET_PROGRAM_IDS_BY_PROGRAM_PLAN_IDS,
    {
      variables: {
        programPlanIds: expiredOwnedPrograms?.order_product
          .filter(product => product.product_id.split('_')[0] === 'ProgramPlan')
          .map(orderProduct => orderProduct.product_id.split('_')[1]),
      },
    },
  )

  useEffect(() => {
    refetchOwnedPrograms && refetchOwnedPrograms()
    refetchExpiredOwnedPrograms && refetchExpiredOwnedPrograms()
    refetchExpiredProgramByProgramPlans && refetchExpiredProgramByProgramPlans()
  })

  const options = [
    formatMessage(programMessages.label.availableForLimitTime),
    formatMessage(programMessages.label.isExpired),
  ]

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'isExpired',
    defaultValue: formatMessage(programMessages.label.availableForLimitTime),
    onChange: v => {
      if (v === formatMessage(programMessages.label.isExpired)) {
        setIsExpired(true)
      } else {
        setIsExpired(false)
      }
    },
  })
  const group = getRootProps()

  if (loadingOwnedPrograms || loadingExpiredOwnedPrograms || loadingExpiredProgramByProgramPlans) {
    return (
      <div className="container py-3">
        <Typography.Title level={4}>{formatMessage(productMessages.program.title.course)}</Typography.Title>
        <Skeleton active avatar />
      </div>
    )
  }

  if (
    errorOwnedPrograms ||
    errorExpiredOwnedPrograms ||
    errorExpiredProgramByProgramPlans ||
    !ownedPrograms ||
    !expiredOwnedPrograms
  ) {
    return (
      <div className="container py-3">
        <Typography.Title level={4}>{formatMessage(productMessages.program.title.course)}</Typography.Title>
        <div>{formatMessage(commonMessages.status.loadingUnable)}</div>
      </div>
    )
  }

  const programIds = uniq(
    flatten([
      ...ownedPrograms.program_enrollment.map(programEnrollment => programEnrollment.program_id),
      ...ownedPrograms.program_plan_enrollment.map(programPlanEnrollment =>
        programPlanEnrollment.program_plan ? programPlanEnrollment.program_plan.program_id : null,
      ),
    ]),
  )

  const expiredProgramIds = uniq(
    flatten([
      ...expiredOwnedPrograms?.order_product
        ?.filter(product => product.product_id.split('_')[0] === 'Program')
        .map(product => product.product_id.split('_')[1]),
      ...(expiredProgramByProgramPlans?.program_plan.map(programPlan => programPlan.program_id) || []),
    ]),
  )

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between">
        <Typography.Title level={4}>{formatMessage(productMessages.program.title.course)}</Typography.Title>
        {expiredProgramIds.length !== 0 && (
          <HStack {...group}>
            {options.map(value => {
              const radio = getRadioProps({ value })
              return (
                <RadioCard key={value} {...radio} size="md">
                  {value}
                </RadioCard>
              )
            })}
          </HStack>
        )}
      </div>

      {programIds.length === 0 ? (
        <div>{formatMessage(productMessages.program.content.noProgram)}</div>
      ) : (
        <div className="row">
          {(!isExpired ? programIds : expiredProgramIds).map(programId => (
            <div key={programId} className="col-12 mb-4 col-md-6 col-lg-4">
              <ProgramCard memberId={memberId} programId={programId} withProgress={!isExpired} withMask={!isExpired} />
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

const GET_OWNED_EXPIRED_PROGRAMS = gql`
  query GET_OWNED_EXPIRED_PROGRAMS($memberId: String!) {
    order_product(
      where: { order_log: { member_id: { _eq: $memberId } }, ended_at: { _is_null: false, _lt: "now()" } }
    ) {
      id
      product_id
    }
  }
`
const GET_PROGRAM_IDS_BY_PROGRAM_PLAN_IDS = gql`
  query GET_PROGRAM_IDS_BY_PROGRAM_PLAN_IDS($programPlanIds: [uuid!]) {
    program_plan(where: { id: { _in: $programPlanIds } }) {
      id
      program_id
    }
  }
`

export default EnrolledProgramCollectionBlock
