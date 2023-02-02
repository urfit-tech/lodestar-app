import { useQuery } from '@apollo/react-hooks'
import { Box } from '@chakra-ui/react'
import gql from 'graphql-tag'
import { CommonTitleMixin, MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common/index'
import { sum } from 'ramda'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { CustomRatioImage } from '../../components/common/Image'
import MemberAvatar from '../../components/common/MemberAvatar'
import ProgressBar from '../../components/common/ProgressBar'
import { useProgramContentProgress } from '../../contexts/ProgressContext'
import hasura from '../../hasura'
import EmptyCover from '../../images/empty-cover.png'
import { ProgramPreview, ProgramRoleName } from '../../types/program'

const StyledWrapper = styled.div`
  overflow: hidden;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);
`
const StyledMeta = styled.div`
  padding: 1.25rem;
`
const StyledTitle = styled.div`
  ${MultiLineTruncationMixin}
  ${CommonTitleMixin}
  margin-bottom: 1.25rem;
  height: 3em;
`
const StyledDescription = styled.div`
  ${MultiLineTruncationMixin}
  margin-bottom: 1.25rem;
  height: 3em;
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
`
const AvatarPlaceHolder = styled.div`
  height: 2rem;
`

const ProgramCard: React.VFC<{
  memberId: string
  programId: string
  programType?: string
  noInstructor?: boolean
  noPrice?: boolean
  withProgress?: boolean
  isExpired?: boolean
  previousPage?: string
}> = ({ memberId, programId, programType, noInstructor, noPrice, withProgress, isExpired, previousPage }) => {
  const { programPreview } = useProgramPreview(programId)
  const { loadingProgress, programContentProgress } = useProgramContentProgress(programId, memberId)

  const viewRate = programContentProgress?.length
    ? sum(programContentProgress.map(contentProgress => contentProgress.progress)) / programContentProgress.length
    : 0

  return (
    <Box opacity={isExpired ? '50%' : '100%'}>
      {!noInstructor && programPreview?.roles && (
        <AvatarPlaceHolder className="my-3">
          {programPreview.roles
            .filter(role => role.name === 'instructor')
            .slice(0, 1)
            .map(role => (
              <MemberAvatar key={role.memberId} memberId={role.memberId} withName />
            ))}
        </AvatarPlaceHolder>
      )}

      <Link
        to={
          isExpired
            ? `/programs/${programId}?visitIntro=1`
            : programType && previousPage
            ? `/programs/${programId}?type=${programType}&back=${previousPage}`
            : programType
            ? `/programs/${programId}?type=${programType}`
            : previousPage
            ? `/programs/${programId}?back=${previousPage}`
            : `/programs/${programId}`
        }
      >
        <StyledWrapper>
          <CustomRatioImage
            width="100%"
            ratio={9 / 16}
            src={
              (programPreview &&
                (programPreview.coverThumbnailUrl || programPreview.coverUrl || programPreview.coverMobileUrl)) ||
              EmptyCover
            }
            shape="rounded"
          />
          <StyledMeta>
            <StyledTitle>{programPreview && programPreview.title}</StyledTitle>
            <StyledDescription>{programPreview && programPreview.abstract}</StyledDescription>

            {withProgress && !loadingProgress && <ProgressBar percent={Math.floor(viewRate * 100)} />}
          </StyledMeta>
        </StyledWrapper>
      </Link>
    </Box>
  )
}

export default ProgramCard

const useProgramPreview = (programId: string) => {
  const { loading, data, error, refetch } = useQuery<hasura.GET_PROGRAM_PREVIEW, hasura.GET_PROGRAM_PREVIEWVariables>(
    gql`
      query GET_PROGRAM_PREVIEW($programId: uuid!) {
        program_by_pk(id: $programId) {
          id
          cover_url
          cover_mobile_url
          cover_thumbnail_url
          title
          abstract
          program_roles(order_by: [{ created_at: asc }, { id: desc }]) {
            id
            name
            member_id
          }
        }
      }
    `,
    { variables: { programId } },
  )

  const programPreview: ProgramPreview | null =
    loading || error || !data || !data.program_by_pk
      ? null
      : {
          id: data.program_by_pk.id,
          coverUrl: data.program_by_pk.cover_url,
          coverMobileUrl: data.program_by_pk.cover_mobile_url,
          coverThumbnailUrl: data.program_by_pk.cover_thumbnail_url,
          title: data.program_by_pk.title,
          abstract: data.program_by_pk.abstract,
          roles: data.program_by_pk.program_roles.map(programRole => ({
            id: programRole.id,
            name: programRole.name as ProgramRoleName,
            memberId: programRole.member_id,
            memberName: programRole.member_id,
          })),
        }

  return {
    loadingProgramPreview: loading,
    errorProgramPreview: error,
    programPreview,
    refetchProgramPreview: refetch,
  }
}
