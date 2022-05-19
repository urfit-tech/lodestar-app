import { useQuery } from '@apollo/react-hooks'
import { Box, HStack, SkeletonText, useRadioGroup } from '@chakra-ui/react'
import { Typography } from 'antd'
import gql from 'graphql-tag'
import { CommonTitleMixin } from 'lodestar-app-element/src/components/common'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import hasura from '../../hasura'
import { commonMessages } from '../../helpers/translation'
import { useEnrolledProgramPackage } from '../../hooks/programPackage'
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

const ProgramPackageCollectionBlock: React.VFC<{ memberId: string; expiredOwnedProgramPackagePlanIds: string[] }> = ({
  memberId,
  expiredOwnedProgramPackagePlanIds,
}) => {
  const { formatMessage } = useIntl()
  const [isExpired, setIsExpired] = useState(false)
  const { loading, error, data: programPackages } = useEnrolledProgramPackage(memberId)
  const { settings } = useApp()

  const {
    loadingProgramPackages,
    errorProgramPackages,
    programPackages: expiredProgramPackages,
  } = useProgramPackages(expiredOwnedProgramPackagePlanIds)

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

  if (loading || loadingProgramPackages) {
    return (
      <div className="container py-3">
        <Typography.Title level={4}>{formatMessage(commonMessages.ui.packages)}</Typography.Title>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </div>
    )
  }

  if (error || errorProgramPackages) {
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
        {settings['feature.expired_program_package_plan.enable'] === '1' && expiredProgramPackages.length > 0 && (
          <HStack {...group}>
            {[
              formatMessage(commonMessages.label.availableForLimitTime),
              formatMessage(commonMessages.label.isExpired),
            ].map(value => {
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
        settings['feature.expired_program_package_plan.enable'] === '1' &&
        expiredProgramPackages.length > 0 && <div>{formatMessage(commonMessages.content.noProgramPackage)}</div>}

      <div className="row">
        {(isExpired ? expiredProgramPackages : programPackages).map(programPackage => (
          <Box key={programPackage.id} className="col-12 col-md-6 col-lg-4 mb-4" opacity={isExpired ? '50%' : '100%'}>
            <Link
              to={
                isExpired
                  ? `/program-packages/${programPackage.id}`
                  : `/program-packages/${programPackage.id}/contents?memberId=${memberId}`
              }
            >
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
