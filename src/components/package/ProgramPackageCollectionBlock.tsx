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
import dayjs from 'dayjs'
import { CommonTitleMixin, MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { Fragment, useState } from 'react'
import { BiSearch, BiSort } from 'react-icons/bi'
import { FiGrid, FiList } from 'react-icons/fi'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { CustomRatioImage } from '../../components/common/Image'
import hasura from '../../hasura'
import { commonMessages, productMessages } from '../../helpers/translation'
import { useExpiredOwnedProducts, useValidOwnedProducts } from '../../hooks/data'
import EmptyCover from '../../images/empty-cover.png'
import RadioCard from '../RadioCard'

const StyledCard = styled.div<{ view?: string }>`
  ${props =>
    props.view === 'List' &&
    `
    display:flex;
    align-items:center;
  `}
  overflow: hidden;
  background: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
`

const StyledDescription = styled.div<{ view?: string }>`
  ${MultiLineTruncationMixin}
  ${props =>
    props.view === 'List' &&
    `
    margin-top:4px;
  `}
  font-size: 12px;
  color: var(--gray-dark);
  letter-spacing: 0.4px;
`

const StyledMeta = styled.div<{ view?: string }>`
  ${props =>
    props.view === 'List'
      ? `
      width:80%;
      `
      : `padding: 1.25rem;`}
`

const StyledTitle = styled.div<{ view?: string }>`
  ${MultiLineTruncationMixin}
  ${CommonTitleMixin}
  ${props =>
    props.view === 'List'
      ? `
      margin-bottom:0px;
      display:block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      `
      : `
      margin-bottom: 1.25rem;
      height: 3rem;
      `}
`

const StyledSelect = styled(Select)`
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

const ProgramPackageCollectionBlock: React.VFC<{
  memberId: string
  onProgramTabClick: (tab: string) => void
  programTab: string
}> = ({ memberId, programTab, onProgramTabClick }) => {
  const { formatMessage } = useIntl()
  const { settings } = useApp()
  const [isExpired, setIsExpired] = useState(false)
  const localStorageView = localStorage.getItem('programPackageView')
  const [view, setView] = useState(localStorageView ? localStorageView : 'Grid')
  const [sort, setSort] = useState('newPurchaseDate')
  const [search, setSearch] = useState('')
  const { loadingExpiredOwnedProducts, expiredOwnedProducts: expiredOwnedProgramPackagePlans } =
    useExpiredOwnedProducts(memberId, 'ProgramPackagePlan')
  const { loadingValidOwnedProducts, validOwnedProducts: validOwnedProgramPackagePlans } = useValidOwnedProducts(
    memberId,
    'ProgramPackagePlan',
  )
  const ownedProgramPackagePlanIds = validOwnedProgramPackagePlans.map(v => v.programPackagePlanId)
  const expiredOwnedProgramPackagePlanIds = expiredOwnedProgramPackagePlans.map(v => v.programPackagePlanId)
  const { loadingExpiredProgramPackages, errorExpiredProgramPackages, expiredProgramPackages } =
    useExpiredProgramPackages(expiredOwnedProgramPackagePlanIds)
  const {
    loadingProgramPackages: loadingValidProgramPackages,
    errorProgramPackages: errorValidProgramPackages,
    programPackages: validOwnedProgramPackages,
  } = useProgramPackages(ownedProgramPackagePlanIds, memberId)
  const programIds = (isExpired ? expiredProgramPackages : validOwnedProgramPackages)
    .map(v => v.programs.map(v => v.programId))
    .flat()
  const { programContent } = useProgramContentIds(programIds, memberId)
  const programPackage = (isExpired ? expiredProgramPackages : validOwnedProgramPackages)
    .map(programPackage => {
      const newPrograms = programPackage.programs.map(p => {
        const content = programContent?.find(contentItem => contentItem.programId === p.programId)

        return {
          ...p,
          lastView: content ? content.lastView : undefined,
        }
      })

      const recentLastView = newPrograms.reduce((latest, program) => {
        if (!latest) return program.lastView
        if (!program.lastView) return latest
        return new Date(program.lastView) > new Date(latest) ? program.lastView : latest
      }, 0)

      const deliveredAt = (isExpired ? expiredOwnedProgramPackagePlans : validOwnedProgramPackagePlans).find(
        p => programPackage.planId === p.programPackagePlanId,
      )?.deliveredAt

      return {
        ...programPackage,
        programs: newPrograms,
        recentLastView,
        deliveredAt,
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
        return +new Date(b.recentLastView) - +new Date(a.recentLastView)
      }
      if (sort === 'oldLastViewDate') {
        return +new Date(a.recentLastView) - +new Date(b.recentLastView)
      }
      return 0
    })
    .filter(programPackage => {
      if (search !== '') {
        return programPackage.title.includes(search)
      }
      return true
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
    loadingValidOwnedProducts ||
    loadingExpiredOwnedProducts ||
    loadingValidProgramPackages ||
    loadingExpiredProgramPackages
  ) {
    return (
      <div className="container py-3">
        <ProgramTab onProgramTabClick={onProgramTabClick} tab={programTab} />
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </div>
    )
  }

  if (errorValidProgramPackages || errorExpiredProgramPackages) {
    return (
      <div className="container py-3">
        <ProgramTab onProgramTabClick={onProgramTabClick} tab={programTab} />
        <div>{formatMessage(commonMessages.status.readingError)}</div>
      </div>
    )
  }

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
        <HStack marginTop={{ base: '1rem', md: '0px' }} justifyContent={{ base: 'space-between', md: 'normal' }}>
          <Flex marginRight="20px" cursor="pointer">
            {
              <HStack
                spacing="5px"
                onClick={() => {
                  setView(view === 'Grid' ? 'List' : 'Grid')
                  localStorage.setItem('programPackageView', view === 'Grid' ? 'List' : 'Grid')
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
          {settings['feature.expired_program_package_plan.enable'] === '1' && expiredProgramPackages.length > 0 && (
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

      <HStack justifyContent={'space-between'} marginBottom="32px">
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
            </StyledSelect>
          </InputGroup>
        </HStack>
        <Box>
          <InputGroup>
            <Input
              placeholder="搜尋關鍵字"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
            />
            <InputRightElement>
              <BiSearch />
            </InputRightElement>
          </InputGroup>
        </Box>
      </HStack>

      {programPackage.length === 0 && <div>{formatMessage(commonMessages.content.noProgramPackage)}</div>}

      <div className="row">
        {programPackage.map(programPackage => (
          <Fragment key={programPackage.id}>
            {view === 'Grid' && (
              <Box className="col-12 col-md-6 col-lg-4 mb-4" opacity={isExpired ? '50%' : '100%'}>
                <Link
                  to={
                    isExpired
                      ? `/program-packages/${programPackage.id}`
                      : `/program-packages/${programPackage.id}/contents?memberId=${memberId}`
                  }
                >
                  <StyledCard>
                    <CustomRatioImage
                      width="100%"
                      ratio={9 / 16}
                      src={programPackage.coverUrl || EmptyCover}
                      shape="rounded"
                    />
                    <StyledMeta>
                      <StyledTitle>{programPackage.title}</StyledTitle>
                      {settings['program.datetime.enabled'] === '1' && (
                        <StyledDescription>
                          {`${dayjs(programPackage.deliveredAt).format('YYYY-MM-DD')} 購買`}
                          {programPackage.recentLastView
                            ? ` / ${dayjs(programPackage.recentLastView).format('YYYY-MM-DD')} 上次觀看`
                            : ` / 尚未觀看`}
                        </StyledDescription>
                      )}
                    </StyledMeta>
                  </StyledCard>
                </Link>
              </Box>
            )}
            {view === 'List' && (
              <Box display="flex" width="100%" marginBottom="12px" opacity={isExpired ? '50%' : '100%'}>
                <Box width="100%">
                  <Link
                    to={
                      isExpired
                        ? `/program-packages/${programPackage.id}`
                        : `/program-packages/${programPackage.id}/contents?memberId=${memberId}`
                    }
                  >
                    <StyledCard view={view}>
                      <CustomRatioImage
                        width="15%"
                        height="15%"
                        margin="12px"
                        ratio={9 / 16}
                        src={programPackage.coverUrl || EmptyCover}
                        shape="rounded"
                      />
                      <StyledMeta view={view}>
                        <StyledTitle view={view}>{programPackage.title}</StyledTitle>
                        {settings['program.datetime.enabled'] === '1' && (
                          <StyledDescription view={view}>
                            {`${dayjs(programPackage.deliveredAt).format('YYYY-MM-DD')} 購買`}
                            {programPackage.recentLastView
                              ? ` / ${dayjs(programPackage.recentLastView).format('YYYY-MM-DD')} 上次觀看`
                              : ` / 尚未觀看`}
                          </StyledDescription>
                        )}
                      </StyledMeta>
                    </StyledCard>
                  </Link>
                </Box>
              </Box>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default ProgramPackageCollectionBlock

const useProgramPackages = (programPackagePlanIds: string[], memberId: string) => {
  const { loading, error, data } = useQuery<
    hasura.GetProgramPackageByProgramPackagePlanIds,
    hasura.GetProgramPackageByProgramPackagePlanIdsVariables
  >(
    gql`
      query GetProgramPackageByProgramPackagePlanIds($programPackagePlanIds: [uuid!], $memberId: String!) {
        program_package_plan(
          where: {
            id: { _in: $programPackagePlanIds }
            program_package_plan_enrollments: { member_id: { _eq: $memberId } }
          }
          distinct_on: program_package_id
        ) {
          id
          is_tempo_delivery
          program_package {
            id
            cover_url
            title
            program_package_programs {
              program {
                id
                title
              }
              program_tempo_deliveries {
                id
              }
            }
          }
        }
      }
    `,
    {
      variables: { programPackagePlanIds, memberId },
    },
  )

  const programPackages =
    data?.program_package_plan
      .map(v => ({
        id: v.program_package?.id,
        coverUrl: v.program_package?.cover_url || undefined,
        title: v.program_package?.title,
        planId: v.id,
        programs: v.program_package.program_package_programs.map(v => ({
          programId: v.program.id,
          isDelivered: !!v.program_tempo_deliveries.length,
        })),
        isTempoDelivery: v.is_tempo_delivery,
      }))
      // TODO: if product is unpublished, optimize the user experience
      .filter(w => !!w.id) || []

  return {
    loadingProgramPackages: loading,
    errorProgramPackages: error,
    programPackages,
  }
}

const useExpiredProgramPackages = (programPackagePlanIds: string[]) => {
  const { loading, error, data } = useQuery<
    hasura.GetExpiredProgramPackageByProgramPackagePlanIds,
    hasura.GetExpiredProgramPackageByProgramPackagePlanIdsVariables
  >(
    gql`
      query GetExpiredProgramPackageByProgramPackagePlanIds($programPackagePlanIds: [uuid!]) {
        program_package_plan(where: { id: { _in: $programPackagePlanIds } }, distinct_on: program_package_id) {
          id
          is_tempo_delivery
          program_package {
            id
            cover_url
            title
            program_package_programs {
              program {
                id
                title
              }
            }
          }
        }
      }
    `,
    {
      variables: { programPackagePlanIds },
    },
  )

  const expiredProgramPackages =
    data?.program_package_plan
      .map(v => ({
        id: v.program_package?.id,
        coverUrl: v.program_package?.cover_url || undefined,
        title: v.program_package?.title,
        planId: v.id,
        programs: v.program_package.program_package_programs.map(v => ({
          programId: v.program.id,
        })),
        isTempoDelivery: v.is_tempo_delivery,
      }))
      // TODO: if product is unpublished, optimize the user experience
      .filter(w => !!w.id) || []

  return {
    loadingExpiredProgramPackages: loading,
    errorExpiredProgramPackages: error,
    expiredProgramPackages,
  }
}

export const useProgramContentIds = (programIds: string[], memberId: string) => {
  const { loading, error, data, refetch } = useQuery<hasura.GetProgramContent, hasura.GetProgramContentVariables>(
    gql`
      query GetProgramContent($programIds: [uuid!]!, $memberId: String!) {
        program(where: { id: { _in: $programIds } }) {
          id
          program_content_progress_enrollments(order_by: { updated_at: desc }, limit: 1) {
            updated_at
          }
        }
        program_content_log(
          where: {
            program_content: { program_content_section: { program_id: { _in: $programIds } } }
            member_id: { _eq: $memberId }
          }
          order_by: { created_at: desc }
          limit: 1
        ) {
          program_content {
            program_content_section {
              program_id
            }
          }
          created_at
        }
      }
    `,
    { variables: { programIds, memberId } },
  )

  const programContent = data?.program.map(p => {
    const progressProgressId = p.id
    const progressLastUpdatedAt = p.program_content_progress_enrollments[0]?.updated_at

    const contentLog = data?.program_content_log.find(
      logItem => logItem.program_content.program_content_section.program_id === progressProgressId,
    )
    const contentLogLastView = contentLog?.created_at

    const lastView =
      contentLogLastView && (!progressLastUpdatedAt || contentLogLastView > progressLastUpdatedAt)
        ? contentLogLastView
        : progressLastUpdatedAt

    return {
      programId: progressProgressId,
      lastView,
    }
  })

  return {
    loadingProgramContentIds: loading,
    errorProgramContentIds: error,
    programContent,
    refetchProgress: refetch,
  }
}

export const useProgramContentLastView = (programContentIds: string[], memberId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GetProgramContentLastView,
    hasura.GetProgramContentLastViewVariables
  >(
    gql`
      query GetProgramContentLastView($programContentIds: [uuid!]!, $memberId: String!) {
        program_content_log(
          where: { program_content_id: { _in: $programContentIds }, member_id: { _eq: $memberId } }
          order_by: { created_at: desc }
          limit: 1
        ) {
          program_content_id
          created_at
        }
        program_content_progress(
          where: { program_content_id: { _in: $programContentIds }, member_id: { _eq: $memberId } }
          order_by: { updated_at: desc }
          limit: 1
        ) {
          program_content_id
          updated_at
        }
      }
    `,
    { variables: { programContentIds, memberId } },
  )

  const programContentLastView = data?.program_content_log.map(contentLog =>
    data.program_content_progress.map(contentProgress => ({
      contentLogContentId: contentLog.program_content_id,
      contentLogCreatedAt: contentLog.created_at,
      contentProgressId: contentProgress.program_content_id,
      contentProgressUpdatedAt: contentProgress.updated_at,
    })),
  )

  return {
    loadingProgramContentLastView: loading,
    errorProgramContentLastView: error,
    programContentLastView,
    refetchProgramContentLastView: refetch,
  }
}
