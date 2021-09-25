import { useQuery } from '@apollo/react-hooks'
import { Icon } from '@chakra-ui/icons'
import { SkeletonText } from '@chakra-ui/react'
import gql from 'graphql-tag'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import hasura from '../../hasura'
import { ReactComponent as RocketIcon } from '../../images/icon-rocket.svg'
import { ProgramPackageProgramProps } from '../../types/programPackage'
import ProgramCollection from '../package/ProgramCollection'
import { ProgramDisplayedListItem } from '../program/ProgramDisplayedListItem'

const messages = defineMessages({
  learningStart: { id: 'project.text.learningStart', defaultMessage: '學習旅程即將開始' },
  support: { id: 'project.text.support', defaultMessage: '將會有領航員聯繫你，協助你開始上課！' },
})

const StyledEmptyBlock = styled.div`
  height: 60vh;
`
const StyledTitle = styled.h2`
  && {
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 0.8px;
    text-align: center;
    color: var(--gray-darker);
  }
`
const StyledSubtitle = styled.h3`
  && {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.57;
    letter-spacing: 0.18px;
    color: var(--gray-darker);
  }
`
const StyledSection = styled.section`
  height: 100%;
  min-height: 60vh;
`

const ProjectProgramCollectionSection: React.VFC<{
  projectId: string
  programCategory: string
}> = ({ projectId, programCategory }) => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { loading, error, programs } = useEnrolledPrivateTeachProgram(currentMemberId || '', programCategory)

  if (loading || error) {
    return <SkeletonText mt="1" noOfLines={4} spacing="4" />
  }

  if (programs.length === 0) {
    return (
      <StyledEmptyBlock className="d-flex justify-content-center align-items-center">
        <div className="d-flex flex-column align-items-center">
          <Icon as={RocketIcon} className="mb-4" w="120px" h="120px" />
          <StyledTitle className="mb-1">{formatMessage(messages.learningStart)}</StyledTitle>
          <StyledSubtitle>{formatMessage(messages.support)}</StyledSubtitle>
        </div>
      </StyledEmptyBlock>
    )
  }

  return (
    <StyledSection className="mt-3">
      <ProgramCollection
        programs={programs}
        renderItem={({ program }) => (
          <Link className="col-12" to={`/programs/${program.id}/contents?back=project_${projectId}`}>
            <ProgramDisplayedListItem key={program.id} program={program} memberId={currentMemberId} />
          </Link>
        )}
        noDisplayTypeButton
      />
    </StyledSection>
  )
}

const normalizeTimeToSecond = (time?: any) => {
  const t = new Date(time || 0).getTime()
  if (isNaN(t)) {
    return 0
  }
  return Math.floor(t / 1000)
}

const useEnrolledPrivateTeachProgram = (memberId: string, programCategory: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_ENROLLED_PRIVATE_TEACH_PROGRAMS,
    hasura.GET_ENROLLED_PRIVATE_TEACH_PROGRAMSVariables
  >(
    gql`
      query GET_ENROLLED_PRIVATE_TEACH_PROGRAMS($memberId: String!, $programCategory: String!) {
        program_plan_enrollment(
          where: {
            program_plan: { program: { program_categories: { category: { name: { _eq: $programCategory } } } } }
            member_id: { _eq: $memberId }
          }
        ) {
          started_at
          ended_at
          options
          program_plan {
            id
            program {
              id
              title
              cover_url
              program_categories {
                id
                category {
                  id
                  name
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
        programCategory,
      },
      fetchPolicy: 'no-cache',
    },
  )

  const programs: ProgramPackageProgramProps[] =
    data?.program_plan_enrollment
      .sort((a, b) => {
        const dateCompare = normalizeTimeToSecond(a.ended_at) - normalizeTimeToSecond(b.ended_at)
        if (dateCompare) {
          return dateCompare
        }
        return (a.options?.position || 0) - (b.options?.position || 0)
      })
      .map(programPlan => ({
        id: programPlan.program_plan?.program.id || '',
        title: programPlan.program_plan?.program.title || '',
        coverUrl: programPlan.program_plan?.program.cover_url,
        categories:
          programPlan.program_plan?.program?.program_categories
            .map(programCategory => ({
              id: programCategory.category.id,
              name: programCategory.category.name,
            }))
            .filter(category => category.name !== programCategory) || [],
        expiredAt: programPlan.ended_at ? new Date(programPlan.ended_at) : null,
      })) || []

  return {
    loading,
    error,
    programs,
    refetch,
  }
}

export default ProjectProgramCollectionSection
