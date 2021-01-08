import { useQuery } from '@apollo/react-hooks'
import { Skeleton, Typography } from 'antd'
import gql from 'graphql-tag'
import { sum, uniqBy } from 'ramda'
import React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { commonMessages } from '../../helpers/translation'
import EmptyCover from '../../images/empty-cover.png'
import types from '../../types'
import { CommonTitleMixin } from '../common'

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

const ProgramPackageCollectionBlock: React.FC<{ memberId: string }> = ({ memberId }) => {
  const { formatMessage } = useIntl()
  const { loading, error, programPackages } = useEnrolledProgramPackage(memberId)
  if (loading) {
    return (
      <div className="container py-3">
        <Typography.Title level={4}>{formatMessage(commonMessages.ui.packages)}</Typography.Title>
        <Skeleton active />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-3">
        <Typography.Title level={4}>{formatMessage(commonMessages.ui.packages)}</Typography.Title>
        <div>{formatMessage(commonMessages.status.readingError)}</div>
      </div>
    )
  }

  return (
    <div className="container py-3">
      <Typography.Title level={4} className="mb-4">
        {formatMessage(commonMessages.ui.packages)}
      </Typography.Title>
      <div className="row">
        {programPackages.map(programPackage => (
          <div key={programPackage.id} className="col-12 col-md-6 col-lg-4 mb-4">
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
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgramPackageCollectionBlock

const useEnrolledProgramPackage = (memberId: string) => {
  const { loading, error, data } = useQuery<
    types.GET_ENROLLED_PROGRAM_PACKAGES,
    types.GET_ENROLLED_PROGRAM_PACKAGESVariables
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
