import { Box } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { CommonTitleMixin, MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common/index'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { CustomRatioImage } from '../../components/common/Image'
import MemberAvatar from '../../components/common/MemberAvatar'
import ProgressBar from '../../components/common/ProgressBar'
import EmptyCover from '../../images/empty-cover.png'
import { ProgramRole } from '../../types/program'

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
  programId: string
  programType?: string
  noInstructor?: boolean
  withProgress?: boolean
  isExpired?: boolean
  previousPage?: string
  view?: string
  deliveredAt: Date | null
  roles: ProgramRole[]
  coverThumbnailUrl: string | null
  coverUrl: string | null
  coverMobileUrl: string | null
  title: string
  abstract: string
  lastViewDate: Date | null
  viewRate: number
}> = ({
  programId,
  programType,
  previousPage,
  noInstructor,
  isExpired,
  view,
  roles,
  coverThumbnailUrl,
  coverUrl,
  coverMobileUrl,
  deliveredAt,
  title,
  abstract,
  lastViewDate,
  withProgress,
  viewRate,
}) => {
  const { settings } = useApp()
  const datetimeEnabled = settings['program.datetime.enabled'] === '1'

  return (
    <>
      {view === 'Grid' && (
        <Box opacity={isExpired ? '50%' : '100%'}>
          {!noInstructor && (
            <AvatarPlaceHolder className="my-3">
              {roles
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
                src={coverThumbnailUrl || coverUrl || coverMobileUrl || EmptyCover}
                shape="rounded"
              />
              <StyledMeta>
                <StyledTitle>{title}</StyledTitle>
                {datetimeEnabled && (
                  <StyledDescription size="small">
                    {`${dayjs(deliveredAt).format('YYYY-MM-DD')} 購買`}
                    {lastViewDate ? ` / ${dayjs(lastViewDate).format('YYYY-MM-DD')}上次觀看` : ' / 尚未觀看'}
                  </StyledDescription>
                )}
                <StyledDescription>{abstract}</StyledDescription>

                {withProgress && <ProgressBar percent={Math.floor(viewRate * 100)} width="100%" />}
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
                src={coverThumbnailUrl || coverUrl || coverMobileUrl || EmptyCover}
                shape="rounded"
              />
              <StyledMeta view={view}>
                <Box minWidth="50%" maxWidth="50%">
                  <StyledTitle view={view}>{title}</StyledTitle>
                  {datetimeEnabled && (
                    <StyledDescription size="small" view={view}>
                      {`${dayjs(deliveredAt).format('YYYY-MM-DD')} 購買`}
                      {lastViewDate ? ` / ${dayjs(lastViewDate).format('YYYY-MM-DD')}上次觀看` : ' / 尚未觀看'}
                    </StyledDescription>
                  )}
                </Box>
                <Box width="100%" display="flex" alignItems="center" justifyContent="flex-end">
                  {!noInstructor && (
                    <AvatarPlaceHolder className="my-3" view={view}>
                      {roles
                        .filter(role => role.name === 'instructor')
                        .slice(0, 1)
                        .map(role => (
                          <MemberAvatar key={role.memberId} memberId={role.memberId} withName view={view} />
                        ))}
                    </AvatarPlaceHolder>
                  )}

                  {withProgress && <ProgressBar percent={Math.floor(viewRate * 100)} width="40%" />}
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
