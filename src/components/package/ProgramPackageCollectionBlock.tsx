import { gql, useQuery } from '@apollo/client'
import { Box, Center, Divider, Flex, HStack, SkeletonText, Text, useRadioGroup } from '@chakra-ui/react'
import { CommonTitleMixin, MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { Fragment, useState } from 'react'
import { FiGrid, FiList } from 'react-icons/fi'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { CustomRatioImage } from '../../components/common/Image'
import hasura from '../../hasura'
import { commonMessages, productMessages } from '../../helpers/translation'
import { useExpiredOwnedProducts } from '../../hooks/data'
import { useEnrolledProgramPackage } from '../../hooks/programPackage'
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

const StyledMeta = styled.div<{ view?: string }>`
  ${props =>
    props.view === 'List'
      ? `
      width:80%;
      display:flex;
      justify-content: space-between;
      align-items:center;
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
  const [view, setView] = useState('Grid')
  const { loadingExpiredOwnedProducts, expiredOwnedProducts: expiredOwnedProgramPackagePlanIds } =
    useExpiredOwnedProducts(memberId, 'ProgramPackagePlan')
  const { loading, error, data: programPackages } = useEnrolledProgramPackage(memberId)
  const {
    loadingProgramPackages,
    errorProgramPackages,
    programPackages: expiredProgramPackages,
  } = useProgramPackages(expiredOwnedProgramPackagePlanIds)

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

  if (loading || loadingExpiredOwnedProducts || loadingProgramPackages) {
    return (
      <div className="container py-3">
        <ProgramTab onProgramTabClick={onProgramTabClick} tab={programTab} />
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </div>
    )
  }

  if (error || errorProgramPackages) {
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
        {settings['feature.expired_program_package_plan.enable'] === '1' && expiredProgramPackages.length > 0 && (
          <HStack marginTop={{ base: '1rem', md: '0px' }} justifyContent={{ base: 'space-between', md: 'normal' }}>
            <Flex marginRight="20px" cursor="pointer">
              {
                <HStack spacing="5px" onClick={() => setView(view === 'Grid' ? 'List' : 'Grid')}>
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
      {programPackages.length === 0 &&
        !isExpired &&
        settings['feature.expired_program_package_plan.enable'] === '1' &&
        expiredProgramPackages.length > 0 && <div>{formatMessage(commonMessages.content.noProgramPackage)}</div>}

      <div className="row">
        {(isExpired ? expiredProgramPackages : programPackages).map(programPackage => (
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

const useProgramPackages = (programPackagePlanIds: string[]) => {
  const { loading, error, data } = useQuery<
    hasura.GET_PROGRAM_PACKAGE_BY_PROGRAM_PACKAGE_PLAN_IDS,
    hasura.GET_PROGRAM_PACKAGE_BY_PROGRAM_PACKAGE_PLAN_IDSVariables
  >(
    gql`
      query GET_PROGRAM_PACKAGE_BY_PROGRAM_PACKAGE_PLAN_IDS($programPackagePlanIds: [uuid!]) {
        program_package_plan(where: { id: { _in: $programPackagePlanIds } }, distinct_on: program_package_id) {
          id
          program_package {
            id
            cover_url
            title
          }
        }
      }
    `,
    {
      variables: { programPackagePlanIds },
    },
  )

  const programPackages: {
    id: string
    coverUrl: string | undefined
    title: string
  }[] =
    data?.program_package_plan
      .map(v => ({
        id: v.program_package?.id,
        coverUrl: v.program_package?.cover_url || undefined,
        title: v.program_package?.title,
      }))
      // TODO: if product is unpublished, optimize the user experience
      .filter(w => !!w.id) || []

  return {
    loadingProgramPackages: loading,
    errorProgramPackages: error,
    programPackages,
  }
}
