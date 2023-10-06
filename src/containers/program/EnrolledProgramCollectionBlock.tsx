import { gql, useQuery } from '@apollo/client'
import { Box, Center, Divider, Flex, HStack, SkeletonText, Text, useRadioGroup } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { flatten, uniq } from 'ramda'
import React, { Fragment, useEffect, useState } from 'react'
import { FiGrid, FiList } from 'react-icons/fi'
import { useIntl } from 'react-intl'
import RadioCard from '../../components/RadioCard'
import hasura from '../../hasura'
import { commonMessages, productMessages } from '../../helpers/translation'
import { useExpiredOwnedProducts } from '../../hooks/data'
import ProgramCard from './ProgramCard'

const ProgramTab = ({ onProgramTabClick, tab }: { onProgramTabClick: (tab: string) => void; tab: string }) => {
  const { formatMessage } = useIntl()
  return (
    <>
      <Flex cursor="pointer">
        <HStack spacing="10px">
          <Text
            fontSize="2xl"
            as="b"
            onClick={() => onProgramTabClick('program')}
            color={tab === 'program' ? 'black' : '#cdcdcd'}
          >
            {formatMessage(productMessages.program.title.course)}
          </Text>
          <Center height="20px">
            <Divider orientation="vertical" />
          </Center>
          <Text
            fontSize="2xl"
            as="b"
            onClick={() => onProgramTabClick('programPackage')}
            color={tab === 'programPackage' ? 'black' : '#cdcdcd'}
          >
            {formatMessage(commonMessages.ui.packages)}
          </Text>
        </HStack>
      </Flex>
    </>
  )
}

const EnrolledProgramCollectionBlock: React.VFC<{
  memberId: string
  onProgramTabClick: (tab: string) => void
  programTab: string
}> = ({ memberId, onProgramTabClick, programTab }) => {
  const { formatMessage } = useIntl()
  const [isExpired, setIsExpired] = useState(false)
  const localStorageView = localStorage.getItem('programView')
  const [view, setView] = useState(localStorageView ? localStorageView : 'Grid')
  const { settings } = useApp()

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
        programPlanIds: expiredOwnedProducts,
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
  const { getRadioProps } = useRadioGroup({
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

  if (loadingOwnedPrograms || loadingExpiredOwnedProducts || loadingExpiredProgramByProgramPlans) {
    return (
      <div className="container py-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <ProgramTab onProgramTabClick={onProgramTabClick} tab={programTab} />
        </div>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
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
        <ProgramTab onProgramTabClick={onProgramTabClick} tab={programTab} />
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
    flatten([...(expiredProgramByProgramPlans?.program_plan.map(programPlan => programPlan.program_id) || [])]),
  )

  return (
    <div className="container py-3">
      <Box
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        alignContent="center"
        marginBottom="1rem"
      >
        <ProgramTab onProgramTabClick={onProgramTabClick} tab={programTab} />
        {expiredProgramIds.length !== 0 && settings['feature.expired_program_plan.enable'] === '1' && (
          <HStack marginTop={{ base: '1rem', md: '0px' }} justifyContent={{ base: 'space-between', md: 'normal' }}>
            <Flex marginRight="20px" cursor="pointer">
              {
                <HStack
                  spacing="5px"
                  onClick={() => {
                    setView(view === 'Grid' ? 'List' : 'Grid')
                    localStorage.setItem('programView', view === 'Grid' ? 'List' : 'Grid')
                  }}
                >
                  {view === 'Grid' && (
                    <>
                      <FiList />
                      <span>{formatMessage(commonMessages.term.list)}</span>
                    </>
                  )}
                  {view === 'List' && (
                    <>
                      <FiGrid />
                      <span>{formatMessage(commonMessages.term.grid)}</span>
                    </>
                  )}
                </HStack>
              }
            </Flex>
            <HStack spacing="12px">
              {options.map(value => {
                const radio = getRadioProps({ value })
                return (
                  <RadioCard key={value} {...radio} size="md">
                    {value}
                  </RadioCard>
                )
              })}
            </HStack>
          </HStack>
        )}
      </Box>
      {programIds.length === 0 && !isExpired && <div>{formatMessage(productMessages.program.content.noProgram)}</div>}{' '}
      {(programIds.length !== 0 || expiredProgramIds.length !== 0) && (
        <div className="row">
          {(isExpired ? expiredProgramIds : programIds).map(programId => (
            <Fragment key={programId}>
              {view === 'Grid' && (
                <div className="col-12 mb-4 col-md-6 col-lg-4">
                  <ProgramCard
                    memberId={memberId}
                    programId={programId}
                    withProgress={!isExpired}
                    isExpired={isExpired}
                    previousPage={`members_${memberId}`}
                    view={view}
                  />
                </div>
              )}
              {view === 'List' && (
                <Box display="flex" width="100%" marginBottom="12px">
                  <ProgramCard
                    memberId={memberId}
                    programId={programId}
                    withProgress={!isExpired}
                    isExpired={isExpired}
                    previousPage={`members_${memberId}`}
                    view={view}
                  />
                </Box>
              )}
            </Fragment>
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
