import { useQuery } from '@apollo/react-hooks'
import { HStack, useRadioGroup } from '@chakra-ui/react'
import { Skeleton, Typography } from 'antd'
import gql from 'graphql-tag'
import { flatten, uniq } from 'ramda'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import RadioCard from '../../components/RadioCard'
import hasura from '../../hasura'
import { commonMessages, productMessages } from '../../helpers/translation'
import { useExpiredOwnedProducts } from '../../hooks/data'
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

  const { loadingExpiredOwnedProducts, errorExpiredOwnedProducts, expiredOwnedProducts, refetchExpiredOwnedProducts } =
    useExpiredOwnedProducts(memberId, 'ProgramPlan')

  const {
    loading: loadingExpiredProgramByProgramPlans,
    error: errorExpiredProgramByProgramPlans,
    data: expiredProgramByProgramPlans,
    refetch: refetchExpiredProgramByProgramPlans,
  } = useQuery<hasura.GET_PROGRAM_IDS_BY_PROGRAM_PLAN_IDS, hasura.GET_PROGRAM_IDS_BY_PROGRAM_PLAN_IDSVariables>(
    GET_PROGRAM_IDS_BY_PROGRAM_PLAN_IDS,
    {
      variables: {
        programPlanIds: expiredOwnedProducts?.map(productId => productId.split('_')[1] || []),
      },
    },
  )

  useEffect(() => {
    refetchOwnedPrograms && refetchOwnedPrograms()
    refetchExpiredOwnedProducts && refetchExpiredOwnedProducts()
    refetchExpiredProgramByProgramPlans && refetchExpiredProgramByProgramPlans()
  })

  const options = [
    formatMessage(commonMessages.label.availableForLimitTime),
    formatMessage(commonMessages.label.isExpired),
  ]
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'isExpired',
    defaultValue: formatMessage(commonMessages.label.availableForLimitTime),
    onChange: v => {
      if (v === formatMessage(commonMessages.label.isExpired)) {
        setIsExpired(true)
      } else {
        setIsExpired(false)
      }
    },
  })
  const group = getRootProps()

  if (loadingOwnedPrograms || loadingExpiredOwnedProducts || loadingExpiredProgramByProgramPlans) {
    return (
      <div className="container py-3">
        <Typography.Title level={4}>{formatMessage(productMessages.program.title.course)}</Typography.Title>
        <Skeleton active avatar />
      </div>
    )
  }

  if (
    errorOwnedPrograms ||
    errorExpiredOwnedProducts ||
    errorExpiredProgramByProgramPlans ||
    !ownedPrograms ||
    !expiredOwnedProducts
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
      ...expiredOwnedProducts
        ?.filter(productId => productId.split('_')[0] === 'Program')
        .map(productId => productId.split('_')[1]),
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
      {programIds.length === 0 && !isExpired && <div>{formatMessage(productMessages.program.content.noProgram)}</div>}{' '}
      {(programIds.length !== 0 || expiredProgramIds.length !== 0) && (
        <div className="row">
          {(isExpired ? expiredProgramIds : programIds).map(programId => (
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
const GET_PROGRAM_IDS_BY_PROGRAM_PLAN_IDS = gql`
  query GET_PROGRAM_IDS_BY_PROGRAM_PLAN_IDS($programPlanIds: [uuid!]) {
    program_plan(where: { id: { _in: $programPlanIds } }) {
      id
      program_id
    }
  }
`

export default EnrolledProgramCollectionBlock
