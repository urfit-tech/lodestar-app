import { gql, useQuery } from '@apollo/client'
import {
  Box,
  Center,
  Divider,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  SkeletonText,
  Text,
  useRadioGroup,
} from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { flatten, uniq } from 'ramda'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { BiSearch, BiSort } from 'react-icons/bi'
import { FiGrid, FiList } from 'react-icons/fi'
import { HiFilter } from 'react-icons/hi'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import RadioCard from '../../components/RadioCard'
import hasura from '../../hasura'
import { commonMessages, productMessages } from '../../helpers/translation'
import { useExpiredOwnedProducts } from '../../hooks/data'
import ProgramCard from './ProgramCard'

const StyledSelect = styled(Select)`
  width: fit-content !important;
  padding-left: 35px !important;
`

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
  const [sort, setSort] = useState('newPurchaseDate')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const { settings } = useApp()
  const { loadingOwnedPrograms, ownedPrograms, errorOwnedPrograms, refetchOwnerPrograms } = useOwnedProgram(memberId)
  const programIds = ownedPrograms?.map(v => v.programId) || []
  const { loadingLastView, errorLastView, programLastView } = useProgramLastViewAndCreatorName(programIds, memberId)
  const { loadingProgress, errorProgress, programContentProgress } = useProgramContentProgress(programIds, memberId)

  const {
    loadingExpiredOwnedProducts,
    errorExpiredOwnedProducts,
    expiredOwnedProducts: expiredOwnedProgramPlans,
    refetchExpiredOwnedProducts,
  } = useExpiredOwnedProducts(memberId, 'ProgramPlan')

  const expiredOwnedProgramPackagePlanIds = expiredOwnedProgramPlans.map(v => v.programPackagePlanId)

  const {
    expiredProgramByProgramPlans,
    errorExpiredProgramByProgramPlans,
    refetchExpiredProgramByProgramPlans,
    loadingExpiredProgramByProgramPlans,
  } = useProgram(expiredOwnedProgramPackagePlanIds)

  const expiredProgramIds = expiredProgramByProgramPlans.map(programPlan => programPlan.programId)

  const {
    loadingLastView: loadingExpiredProgramLastView,
    errorLastView: errorExpiredProgramLastView,
    programLastView: expiredProgramLastView,
  } = useProgramLastViewAndCreatorName(expiredProgramIds, memberId)

  useEffect(() => {
    refetchOwnerPrograms && refetchOwnerPrograms()
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

  if (
    loadingOwnedPrograms ||
    loadingExpiredOwnedProducts ||
    loadingExpiredProgramByProgramPlans ||
    loadingExpiredProgramLastView ||
    loadingLastView ||
    loadingProgress
  ) {
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
    errorExpiredProgramLastView ||
    errorLastView ||
    errorProgress ||
    !ownedPrograms ||
    !expiredOwnedProgramPlans
  ) {
    return (
      <div className="container py-3">
        <ProgramTab onProgramTabClick={onProgramTabClick} tab={programTab} />
        <div>{formatMessage(commonMessages.status.loadingUnable)}</div>
      </div>
    )
  }

  const programs = ownedPrograms
    .map(p => {
      const programId = p.programId
      const matchLastView = programLastView?.find(l => l.programId === p.programId)
      const programProgress = programContentProgress?.reduce(
        (
          progressResult: {
            [key: string]: { programId: string; title: string; programProgress: number; count: number }
          },
          progress,
        ) => {
          const progressProgramId = progress.programId
          if (progress.programId === p.programId) {
            if (!progressResult[progressProgramId]) {
              progressResult[progressProgramId] = {
                programId: progress.programId,
                title: progress.programTitle,
                programProgress: progress.progress,
                count: 1,
              }
            } else {
              progressResult[progressProgramId] = {
                programId: progress.programId,
                title: progress.programTitle,
                programProgress: progressResult[progressProgramId].programProgress + progress.progress,
                count: progressResult[progressProgramId].count + 1,
              }
            }
          }
          return progressResult
        },
        {},
      )

      return {
        ...p,
        lastView: matchLastView?.lastView,
        programProgress:
          programProgress && programProgress[programId]
            ? {
                programId: programProgress[programId].programId,
                title: programProgress[programId].title,
                progress: programProgress[programId].programProgress,
                contentBodyLength: programProgress[programId].count,
              }
            : {},
        creatorName: p.creatorName || '',
      }
    })
    .sort((a, b) => {
      if (sort === 'newPurchaseDate') {
        return +new Date(b.deliveredAt) - +new Date(a.deliveredAt)
      }
      if (sort === 'oldPurchaseDate') {
        return +new Date(a.deliveredAt) - +new Date(b.deliveredAt)
      }
      if (sort === 'newLastViewDate') {
        return +new Date(b.lastView) - +new Date(a.lastView)
      }
      if (sort === 'oldLastViewDate') {
        return +new Date(a.lastView) - +new Date(b.lastView)
      }
      if (sort === 'lessCreatorStrokes') {
        return a.creatorName.localeCompare(b.creatorName, 'zh-Hant')
      }
      if (sort === 'moreCreatorStrokes') {
        return b.creatorName.localeCompare(a.creatorName, 'zh-Hant')
      }
      return 0
    })
    .filter(program => {
      const progress = program.programProgress?.progress || 0
      const contentBodyLength = program.programProgress?.contentBodyLength || 0
      const viewRate = Math.floor((progress / contentBodyLength) * 100)
      if (search !== '') {
        if (program.programTitle.includes(search) || program.creatorName.includes(search)) {
          return filter === 'inProgress'
            ? viewRate > 0 && viewRate < 100
            : filter === 'Done'
            ? viewRate === 100
            : filter === 'notStartYet'
            ? viewRate === 0
            : true
        } else {
          return false
        }
      } else {
        if (filter === 'inProgress') {
          return viewRate > 0 && viewRate < 100
        }
        if (filter === 'Done') {
          return viewRate === 100
        }
        if (filter === 'notStartYet') {
          return viewRate === 0
        }
        return true
      }
    })

  const expiredPrograms = expiredProgramByProgramPlans
    .map(program => {
      const programId = program.programId
      const matchProgramPlan = expiredOwnedProgramPlans.find(
        programPlan => programPlan.programPackagePlanId === program.planId,
      )
      const matchLastView = expiredProgramLastView?.find(l => l.programId === program.programId)
      const latestDeliveredAt: { [key: string]: Date } = {}

      if (matchProgramPlan) {
        const deliveredAt = matchProgramPlan.deliveredAt
        if (!latestDeliveredAt[programId] || (deliveredAt && deliveredAt > latestDeliveredAt[programId])) {
          latestDeliveredAt[programId] = deliveredAt
        }
      }

      return {
        programId,
        programTitle: program.programTitle || '',
        creatorName: program.creatorName || '',
        lastView: matchLastView?.lastView,
        deliveredAt: latestDeliveredAt[programId] || undefined,
      }
    })
    .sort((a, b) => {
      if (sort === 'newPurchaseDate') {
        return +new Date(b.deliveredAt) - +new Date(a.deliveredAt)
      }
      if (sort === 'oldPurchaseDate') {
        return +new Date(a.deliveredAt) - +new Date(b.deliveredAt)
      }
      if (sort === 'newLastViewDate') {
        return +new Date(b.lastView) - +new Date(a.lastView)
      }
      if (sort === 'oldLastViewDate') {
        return +new Date(a.lastView) - +new Date(b.lastView)
      }
      if (sort === 'lessCreatorStrokes') {
        return a.creatorName.localeCompare(b.creatorName, 'zh-Hant')
      }
      if (sort === 'moreCreatorStrokes') {
        return b.creatorName.localeCompare(a.creatorName, 'zh-Hant')
      }
      return 0
    })
    .filter(program => {
      if (search !== '') {
        return program.programTitle.includes(search) || program.creatorName.includes(search)
      } else {
        return true
      }
    })

  return (
    <div className="container py-3">
      {ownedPrograms.length === 0 && expiredPrograms.length === 0 && (
        <div>{formatMessage(productMessages.program.content.noProgram)}</div>
      )}

      {(ownedPrograms.length !== 0 || expiredPrograms.length !== 0) && (
        <>
          <Box
            display="flex"
            flexDirection={{ base: 'column', md: 'row' }}
            justifyContent="space-between"
            alignContent="center"
            marginBottom="1rem"
          >
            <ProgramTab onProgramTabClick={onProgramTabClick} tab={programTab} />

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
              {expiredPrograms.length !== 0 && settings['feature.expired_program_plan.enable'] === '1' && (
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
              )}
            </HStack>
          </Box>

          <HStack justifyContent={'space-between'}>
            <HStack spacing="12px">
              <InputGroup>
                <InputLeftElement>
                  <BiSort />
                </InputLeftElement>
                <StyledSelect
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setSort(event.target.value)}
                  defaultValue={sort}
                >
                  <option value="newPurchaseDate">購買日期（新到舊）</option>
                  <option value="oldPurchaseDate">購買日期（舊到新）</option>
                  <option value="newLastViewDate">最後觀課日（新到舊）</option>
                  <option value="oldLastViewDate">最後觀課日（舊到新）</option>
                  <option value="lessCreatorStrokes">依講師排序（筆畫少到多）</option>
                  <option value="moreCreatorStrokes">依講者排序（筆畫多到少）</option>
                </StyledSelect>
              </InputGroup>
              {!isExpired && (
                <InputGroup>
                  <InputLeftElement>
                    <HiFilter />
                  </InputLeftElement>
                  <StyledSelect
                    default={filter}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setFilter(event.target.value)}
                  >
                    <option value="all">全部課程</option>
                    <option value="inProgress">進行中</option>
                    <option value="notStartYet">尚未開始</option>
                    <option value="Done">已完課</option>
                  </StyledSelect>
                </InputGroup>
              )}
            </HStack>
            <Box>
              <InputGroup>
                <Input
                  placeholder="搜尋關鍵字"
                  value={search}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSearch(event.target.value.trim().toLowerCase())
                  }
                />
                <InputRightElement>
                  <BiSearch />
                </InputRightElement>
              </InputGroup>
            </Box>
          </HStack>
          <div className="row">
            {(isExpired ? expiredPrograms : programs).map(program => (
              <Fragment key={program.programId}>
                {view === 'Grid' && (
                  <div className="col-12 mb-4 col-md-6 col-lg-4">
                    <ProgramCard
                      memberId={memberId}
                      programId={program.programId}
                      withProgress={!isExpired}
                      isExpired={isExpired}
                      previousPage={`members_${memberId}`}
                      programDeliveredAt={program.deliveredAt}
                      view={view}
                      programDatetimeEnabled={settings['program.datetime.enabled'] === '1'}
                    />
                  </div>
                )}
                {view === 'List' && (
                  <Box display="flex" width="100%" marginBottom="12px">
                    <ProgramCard
                      memberId={memberId}
                      programId={program.programId}
                      withProgress={!isExpired}
                      isExpired={isExpired}
                      previousPage={`members_${memberId}`}
                      programDeliveredAt={program.deliveredAt}
                      view={view}
                      programDatetimeEnabled={settings['program.datetime.enabled'] === '1'}
                    />
                  </Box>
                )}
              </Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export const useOwnedProgram = (memberId: string) => {
  const { loading, data, error, refetch } = useQuery<hasura.GetOwnedPrograms, hasura.GetOwnedProgramsVariables>(
    gql`
      query GetOwnedPrograms($memberId: String!) {
        program_enrollment(where: { member_id: { _eq: $memberId } }) {
          program_id
          product_delivered_at
          program {
            title
            program_roles(where: { name: { _eq: "instructor" } }, order_by: [{ created_at: asc }, { id: desc }]) {
              member {
                name
              }
            }
          }
        }
        program_plan_enrollment(where: { member_id: { _eq: $memberId } }) {
          program_plan {
            program_id
            program {
              title
              program_roles(
                where: { name: { _eq: "instructor" } }
                order_by: [{ created_at: asc }, { id: desc }]
                limit: 1
              ) {
                member {
                  name
                }
              }
            }
          }
          product_delivered_at
        }
      }
    `,
    { variables: { memberId } },
  )

  const programIds = data
    ? uniq(
        flatten([
          ...data.program_enrollment.map(programEnrollment => programEnrollment.program_id),
          ...data.program_plan_enrollment.map(programPlanEnrollment =>
            programPlanEnrollment.program_plan ? programPlanEnrollment.program_plan.program_id : null,
          ),
        ]),
      )
    : []

  const ownedPrograms:
    | {
        programId: string
        programTitle: string
        creatorName: string
        deliveredAt: Date
      }[]
    | null =
    loading || error || !data
      ? null
      : programIds.map(programId => {
          const programEnrollment = data.program_enrollment.find(enrollment => enrollment.program_id === programId)
          const matchProgramPlanEnrollment = data.program_plan_enrollment.find(
            programPlan => programPlan.program_plan?.program_id === programId,
          )

          const programTitle = matchProgramPlanEnrollment
            ? matchProgramPlanEnrollment.program_plan?.program.title || ''
            : programEnrollment?.program?.title || ''

          const creatorName = matchProgramPlanEnrollment
            ? matchProgramPlanEnrollment.program_plan?.program.program_roles.map(r => r.member?.name)[0] || ''
            : programEnrollment?.program?.program_roles.map(r => r.member?.name)[0] || ''

          const deliveredAt = matchProgramPlanEnrollment
            ? matchProgramPlanEnrollment.product_delivered_at
            : programEnrollment?.product_delivered_at

          return {
            programId,
            programTitle,
            creatorName,
            deliveredAt,
          }
        })

  return {
    refetchOwnerPrograms: refetch,
    loadingOwnedPrograms: loading,
    errorOwnedPrograms: error,
    ownedPrograms,
    programIds,
  }
}

export const useProgram = (programPlanIds: string[]) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GetProgramIdsByProgramPlanIds,
    hasura.GetProgramIdsByProgramPlanIdsVariables
  >(
    gql`
      query GetProgramIdsByProgramPlanIds($programPlanIds: [uuid!]) {
        program_plan(where: { id: { _in: $programPlanIds } }, distinct_on: program_id) {
          id
          program {
            id
            title
            program_roles(
              where: { name: { _eq: "instructor" } }
              order_by: [{ created_at: asc }, { id: desc }]
              limit: 1
            ) {
              member {
                name
              }
            }
          }
        }
      }
    `,
    {
      variables: { programPlanIds },
    },
  )

  const expiredProgramByProgramPlans =
    loading || error || !data
      ? []
      : data.program_plan.map(programPlan => ({
          planId: programPlan.id,
          programId: programPlan.program.id,
          programTitle: programPlan.program.title,
          creatorName: programPlan.program.program_roles.map(r => r.member?.name)[0] || '',
        }))

  return {
    loadingExpiredProgramByProgramPlans: loading,
    errorExpiredProgramByProgramPlans: error,
    expiredProgramByProgramPlans,
    refetchExpiredProgramByProgramPlans: refetch,
  }
}

const useProgramLastViewAndCreatorName = (programIds: string[], memberId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GetProgramContentLastViewAndCreatorNameByProgramIds,
    hasura.GetProgramContentLastViewAndCreatorNameByProgramIdsVariables
  >(
    gql`
      query GetProgramContentLastViewAndCreatorNameByProgramIds($programIds: [uuid!]!, $memberId: String!) {
        program(
          where: {
            id: { _in: $programIds }
            program_content_progress_enrollments: {
              program_content: { published_at: { _is_null: false } }
              member_id: { _eq: $memberId }
            }
          }
        ) {
          id
          title
          program_content_progress_enrollments(order_by: { updated_at: desc }, limit: 1) {
            updated_at
          }
          program_roles(
            where: { name: { _eq: "instructor" } }
            order_by: [{ created_at: asc }, { id: desc }]
            limit: 1
          ) {
            member {
              name
            }
          }
        }
      }
    `,
    { variables: { programIds, memberId } },
  )

  const programLastView =
    loading || error || !data
      ? undefined
      : data.program
          .map(p =>
            p.program_content_progress_enrollments.map(progress => ({
              programId: p.id,
              title: p.title,
              creatorName: p.program_roles.map(r => r.member?.name)[0] || '',
              lastView: progress.updated_at,
            })),
          )
          .flat()

  return {
    loadingLastView: loading,
    errorLastView: error,
    programLastView,
    refetchLastView: refetch,
  }
}

const useProgramContentProgress = (programIds: string[], memberId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GetProgramContentProgressByProgramIds,
    hasura.GetProgramContentProgressByProgramIdsVariables
  >(
    gql`
      query GetProgramContentProgressByProgramIds($programIds: [uuid!]!, $memberId: String!) {
        program_content_body(
          where: {
            program_contents: {
              program_content_section: {
                program: { published_at: { _is_null: false } }
                program_id: { _in: $programIds }
              }
            }
          }
        ) {
          type
          program_contents(where: { published_at: { _is_null: false } }, order_by: { published_at: desc }) {
            program_content_section {
              program {
                id
                title
              }
            }
            program_content_progress(where: { member_id: { _eq: $memberId } }) {
              id
              progress
              updated_at
            }
          }
        }
      }
    `,
    { variables: { programIds, memberId } },
  )

  const programContentProgress = useMemo(
    () =>
      loading || error || !data
        ? undefined
        : flatten(
            data.program_content_body.map(contentBody =>
              contentBody.program_contents.map(content => {
                return {
                  programId: content.program_content_section.program.id,
                  programTitle: content.program_content_section.program.title,
                  progress: content.program_content_progress[0]?.progress || 0,
                  updatedAt: content.program_content_progress[0]?.updated_at || undefined,
                }
              }),
            ),
          ),
    [data, error, loading],
  )

  return {
    loadingProgress: loading,
    errorProgress: error,
    programContentProgress,
    refetchProgress: refetch,
  }
}

export default EnrolledProgramCollectionBlock
