import { useQuery } from '@apollo/react-hooks'
import { Box, HStack, SkeletonText, useRadioGroup } from '@chakra-ui/react'
import { Typography } from 'antd'
import gql from 'graphql-tag'
import { CommonTitleMixin } from 'lodestar-app-element/src/components/common'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { flatten, sum, uniq, uniqBy } from 'ramda'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import hasura from '../../hasura'
import { commonMessages } from '../../helpers/translation'
import EmptyCover from '../../images/empty-cover.png'
import RadioCard from '../RadioCard'

const StyledCard = styled.div`
  overflow: hidden;
  background: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
`
const StyledCover = styled.div<{ src: string }>`
  padding-top: 56.25%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`
const StyledDescription = styled.div`
  padding: 1.25rem;
`
const StyledTitle = styled(Typography.Title)`
  && {
    margin-bottom: 1.25rem;
    ${CommonTitleMixin}
    height: 3rem;
  }
`

const ProgramPackageCollectionBlock: React.VFC<{ memberId: string; programPackagePlanIds: string[] }> = ({
  memberId,
  programPackagePlanIds,
}) => {
  const { formatMessage } = useIntl()
  const [isExpired, setIsExpired] = useState(false)
  const { loading, error, programPackages } = useEnrolledProgramPackage(memberId)
  const { settings } = useApp()

  const {
    loading: loadingProgramPackageByProgramPackagePlans,
    error: errorProgramPackageByProgramPackagePlans,
    data: programPackageByProgramPackagePlans,
  } = useQuery<
    hasura.GET_PROGRAM_PACKAGE_IDS_BY_PROGRAM_PACKAGE_PLAN_IDS,
    hasura.GET_PROGRAM_PACKAGE_IDS_BY_PROGRAM_PACKAGE_PLAN_IDSVariables
  >(GET_PROGRAM_PACKAGE_IDS_BY_PROGRAM_PACKAGE_PLAN_IDS, {
    variables: {
      programPackagePlanIds,
    },
  })
  const expiredProgramPackageIds = uniq(
    flatten([
      ...(programPackageByProgramPackagePlans?.program_package_plan.map(
        programPackagePlan => programPackagePlan.program_package_id,
      ) || []),
    ]),
  )
  const {
    loadingProgramPackages,
    errorProgramPackages,
    programPackages: expiredProgramPackages,
  } = useProgramPackages(expiredProgramPackageIds)

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

  if (loading || loadingProgramPackageByProgramPackagePlans || loadingProgramPackages) {
    return (
      <div className="container py-3">
        <Typography.Title level={4}>{formatMessage(commonMessages.ui.packages)}</Typography.Title>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </div>
    )
  }

  if (error || errorProgramPackageByProgramPackagePlans || errorProgramPackages) {
    return (
      <div className="container py-3">
        <Typography.Title level={4}>{formatMessage(commonMessages.ui.packages)}</Typography.Title>
        <div>{formatMessage(commonMessages.status.readingError)}</div>
      </div>
    )
  }

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between">
        <Typography.Title level={4} className="mb-4">
          {formatMessage(commonMessages.ui.packages)}
        </Typography.Title>
        {settings['feature.expiredProgramPackagePlan.enable'] === '1' && expiredProgramPackageIds.length > 0 && (
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

      {programPackages.length === 0 &&
        !isExpired &&
        settings['feature.expiredProgramPackagePlan.enable'] === '1' &&
        expiredProgramPackages.length > 0 && <div>{formatMessage(commonMessages.content.noProgramPackage)}</div>}
      {(programPackages.length > 0 || expiredProgramPackages.length > 0) && (
        <div className="row">
          {(isExpired ? expiredProgramPackages : programPackages).map(programPackage => (
            <Box
              key={programPackage.id}
              className="col-12 col-md-6 col-lg-4 mb-4"
              opacity={!isExpired ? '100%' : '50%'}
            >
              <Link to={`/program-packages/${programPackage.id}/contents?memberId=${memberId}`}>
                <StyledCard>
                  <StyledCover src={programPackage.coverUrl || EmptyCover} />
                  <StyledDescription>
                    <StyledTitle level={2} ellipsis={{ rows: 2 }}>
                      {programPackage.title}
                    </StyledTitle>
                  </StyledDescription>
                </StyledCard>
              </Link>
            </Box>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProgramPackageCollectionBlock

const GET_PROGRAM_PACKAGE_IDS_BY_PROGRAM_PACKAGE_PLAN_IDS = gql`
  query GET_PROGRAM_PACKAGE_IDS_BY_PROGRAM_PACKAGE_PLAN_IDS($programPackagePlanIds: [uuid!]) {
    program_package_plan(where: { id: { _in: $programPackagePlanIds } }) {
      id
      program_package_id
    }
  }
`
const useProgramPackages = (programPackageIds: string[]) => {
  const { loading, error, data } = useQuery<hasura.GET_PROGRAM_PACKAGES, hasura.GET_PROGRAM_PACKAGESVariables>(
    gql`
      query GET_PROGRAM_PACKAGES($programPackageIds: [uuid!]) {
        program_package(where: { id: { _in: $programPackageIds } }) {
          id
          cover_url
          title
        }
      }
    `,
    {
      variables: { programPackageIds },
    },
  )

  const programPackages: {
    id: string
    coverUrl: string | undefined
    title: string
  }[] =
    data?.program_package.map(v => ({
      id: v.id,
      coverUrl: v.cover_url || undefined,
      title: v.title,
    })) || []

  return {
    loadingProgramPackages: loading,
    errorProgramPackages: error,
    programPackages,
  }
}
const useEnrolledProgramPackage = (memberId: string) => {
  const { loading, error, data } = useQuery<
    hasura.GET_ENROLLED_PROGRAM_PACKAGES,
    hasura.GET_ENROLLED_PROGRAM_PACKAGESVariables
  >(
    gql`
      query GET_ENROLLED_PROGRAM_PACKAGES($memberId: String!) {
        program_package(
          where: { program_package_plans: { program_package_plan_enrollments: { member_id: { _eq: $memberId } } } }
          distinct_on: id
        ) {
          id
          cover_url
          title
          published_at
          program_package_programs(where: { program: { published_at: { _is_null: false } } }) {
            id
            program {
              id
              program_content_sections {
                id
                program_contents {
                  id
                  duration
                }
              }
            }
          }
        }
      }
    `,
    {
      variables: {
        memberId,
      },
    },
  )

  const programPackages =
    loading || !!error || !data
      ? []
      : uniqBy(programPackage => programPackage.id, data.program_package).map(programPackage => ({
          id: programPackage.id,
          coverUrl: programPackage.cover_url || undefined,
          title: programPackage.title,
          programCount: programPackage.program_package_programs.length,
          totalDuration: sum(
            programPackage.program_package_programs
              .map(programPackageProgram =>
                programPackageProgram.program.program_content_sections
                  .map(programContentSection =>
                    programContentSection.program_contents.map(programContent => programContent.duration),
                  )
                  .flat(),
              )
              .flat(),
          ),
        }))
  return {
    loading,
    error,
    programPackages,
  }
}
