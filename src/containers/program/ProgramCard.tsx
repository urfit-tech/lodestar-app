import { gql, useQuery } from '@apollo/client'
import { Box, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import dayjs from 'dayjs'
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

const StyledWrapper = styled.div<{ view?: string }>`
  ${props =>
    props.view === 'List' &&
    `
    display:flex;
    align-items:center;
  `}
  overflow: hidden;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);
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
      margin-bottom: 0.25rem;
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
const StyledDescription = styled.div<{ size?: string; view?: string }>`
  ${props =>
    props.size === 'small'
      ? `
      font-size: 12px;
      `
      : `
      font-size: 14px;
      height: 3em;
      margin-bottom: 1.25rem;
      `}
  ${props => (props.view === 'List' ? '' : 'margin-bottom: 0.5rem;')}
  ${MultiLineTruncationMixin}
  color: var(--gray-dark);
  letter-spacing: 0.4px;
`
const AvatarPlaceHolder = styled.div<{ view?: string }>`
  ${props => props.view === 'List' && 'width: 40%;'}
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
  view?: string
  programDatetimeEnabled?: boolean
  programDeliveredAt?: Date
}> = ({
  memberId,
  programId,
  programType,
  noInstructor,
  noPrice,
  withProgress,
  isExpired,
  previousPage,
  view,
  programDatetimeEnabled,
  programDeliveredAt,
}) => {
  const { loadingProgramPreview, programPreview } = useProgramPreview(programId)
  const { loadingProgress, programContentProgress } = useProgramContentProgress(programId, memberId)

  const viewRate = programContentProgress?.length
    ? sum(programContentProgress.map(contentProgress => contentProgress.progress)) / programContentProgress.length
    : 0

  const lastViewDate = programContentProgress?.length
    ? programContentProgress
        .map(contentProgress => contentProgress.updatedAt)
        .sort((a, b) => {
          if (a && b) {
            return +new Date(b) - +new Date(a)
          }
          return 0
        })[0]
    : undefined

  return (
    <>
      {view === 'Grid' && (
        <Box opacity={isExpired ? '50%' : '100%'}>
          {loadingProgramPreview ? (
            <AvatarPlaceHolder className="my-3">
              <SkeletonCircle size="10" />
            </AvatarPlaceHolder>
          ) : (
            !noInstructor && (
              <AvatarPlaceHolder className="my-3">
                {programPreview?.roles
                  .filter(role => role.name === 'instructor')
                  .slice(0, 1)
                  .map(role => (
                    <MemberAvatar key={role.memberId} memberId={role.memberId} withName />
                  ))}
              </AvatarPlaceHolder>
            )
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
                {loadingProgramPreview ? (
                  <SkeletonText m="4" noOfLines={4} spacing="4" skeletonHeight="2" />
                ) : (
                  <>
                    <StyledTitle>{programPreview?.title}</StyledTitle>
                    {programDatetimeEnabled && (
                      <StyledDescription size="small">
                        {`${dayjs(programDeliveredAt).format('YYYY-MM-DD')} 購買`}
                        {lastViewDate ? ` / ${dayjs(lastViewDate).format('YYYY-MM-DD')}上次觀看` : ' / 尚未觀看'}
                      </StyledDescription>
                    )}
                    <StyledDescription>{programPreview?.abstract}</StyledDescription>
                  </>
                )}
                {withProgress && (
                  <ProgressBar percent={Math.floor(viewRate * 100)} width="100%" loading={loadingProgress} />
                )}
              </StyledMeta>
            </StyledWrapper>
          </Link>
        </Box>
      )}
      {view === 'List' && (
        <Box opacity={isExpired ? '50%' : '100%'} width="100%">
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
            <StyledWrapper view={view}>
              <CustomRatioImage
                width="15%"
                height="15%"
                margin="12px"
                ratio={9 / 16}
                src={
                  (programPreview &&
                    (programPreview.coverThumbnailUrl || programPreview.coverUrl || programPreview.coverMobileUrl)) ||
                  EmptyCover
                }
                shape="rounded"
              />
              <StyledMeta view={view}>
                <Box minWidth="50%" maxWidth="50%">
                  {loadingProgramPreview ? (
                    <SkeletonText m="4" noOfLines={3} spacing="4" skeletonHeight="2" />
                  ) : (
                    <>
                      <StyledTitle view={view}>{programPreview?.title}</StyledTitle>
                      {programDatetimeEnabled && (
                        <StyledDescription size="small" view={view}>
                          {`${dayjs(programDeliveredAt).format('YYYY-MM-DD')} 購買`}
                          {lastViewDate ? ` / ${dayjs(lastViewDate).format('YYYY-MM-DD')}上次觀看` : ' / 尚未觀看'}
                        </StyledDescription>
                      )}
                    </>
                  )}
                </Box>
                <Box width="100%" display="flex" alignItems="center" justifyContent="flex-end">
                  {loadingProgramPreview ? (
                    <AvatarPlaceHolder className="my-3" view={view}>
                      <SkeletonCircle size="10" />
                    </AvatarPlaceHolder>
                  ) : (
                    <>
                      {!noInstructor && (
                        <AvatarPlaceHolder className="my-3" view={view}>
                          {programPreview?.roles
                            .filter(role => role.name === 'instructor')
                            .slice(0, 1)
                            .map(role => (
                              <MemberAvatar key={role.memberId} memberId={role.memberId} withName view={view} />
                            ))}
                        </AvatarPlaceHolder>
                      )}
                    </>
                  )}
                  {withProgress && (
                    <ProgressBar percent={Math.floor(viewRate * 100)} width="40%" loading={loadingProgress} />
                  )}
                </Box>
              </StyledMeta>
            </StyledWrapper>
          </Link>
        </Box>
      )}
    </>
  )
}

export default ProgramCard

const useProgramPreview = (programId: string) => {
  const { loading, data, error, refetch } = useQuery<hasura.GetProgramPreview, hasura.GetProgramPreviewVariables>(
    gql`
      query GetProgramPreview($programId: uuid!) {
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
          coverUrl: data.program_by_pk.cover_url || null,
          coverMobileUrl: data.program_by_pk.cover_mobile_url || null,
          coverThumbnailUrl: data.program_by_pk.cover_thumbnail_url || null,
          title: data.program_by_pk.title,
          abstract: data.program_by_pk.abstract || '',
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
