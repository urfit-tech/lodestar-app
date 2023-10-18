import { Box, Text } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { CommonTitleMixin, MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common/index'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ProgramCover } from '../../components/common/Image'
import MemberAvatar from '../../components/common/MemberAvatar'
import ProgressBar from '../../components/common/ProgressBar'
import EmptyCover from '../../images/empty-cover.png'
import { ProgramRole } from '../../types/program'

const StyledWrapper = styled(Box)`
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
const StyledTitle = styled(Text)<{ view?: string }>`
  ${MultiLineTruncationMixin}
  ${CommonTitleMixin}
  ${props =>
    props.view === 'List'
      ? `
      display:block;
      overflow: hidden;
      text-overflow: ellipsis;
      `
      : `
      margin-bottom: 1.25rem;
      height: 3rem;
      `}
`
const StyledDescription = styled(Text)<{ size?: string; view?: string }>`
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
const AvatarPlaceHolder = styled(Box)<{ view?: string }>`
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
              <ProgramCover
                width="100%"
                paddingTop="calc(100% * 9/16)"
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
        <Box opacity={isExpired ? '50%' : '100%'}>
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
              <Box display="flex" marginY={{ base: '16px', md: '0px' }} marginX={{ base: '12px', md: '0px' }}>
                <ProgramCover
                  width={{ base: '40%', md: '15%' }}
                  height={{ base: '40%', md: '15%' }}
                  paddingTop={{ base: 'calc(40% * 9/16)', md: 'calc(15% * 9/16)' }}
                  margin={{ base: '0px 16px 0px 0px', md: '12px' }}
                  src={coverThumbnailUrl || coverUrl || coverMobileUrl || EmptyCover}
                  shape="rounded"
                />
                <StyledMeta view={view}>
                  <Box minWidth={{ base: '100%', md: '50%' }} maxWidth={{ base: '100%', md: '50%' }}>
                    <StyledTitle noOfLines={{ base: 2, md: 1 }} view={view}>
                      {title}
                    </StyledTitle>
                    {datetimeEnabled && (
                      <StyledDescription size="small" display={{ base: 'none', md: 'block' }} view={view}>
                        {`${dayjs(deliveredAt).format('YYYY-MM-DD')} 購買`}
                        {lastViewDate ? ` / ${dayjs(lastViewDate).format('YYYY-MM-DD')}上次觀看` : ' / 尚未觀看'}
                      </StyledDescription>
                    )}
                    {!noInstructor && (
                      <Box display={{ base: 'block', md: 'none' }}>
                        {roles
                          .filter(role => role.name === 'instructor')
                          .slice(0, 1)
                          .map(role => (
                            <MemberAvatar key={role.memberId} memberId={role.memberId} withName noAvatar view={view} />
                          ))}
                      </Box>
                    )}
                  </Box>

                  <Box
                    width="100%"
                    alignItems="center"
                    justifyContent="flex-end"
                    display={{ base: 'none', md: 'flex' }}
                  >
                    {!noInstructor && (
                      <AvatarPlaceHolder marginY="1rem" view={view}>
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
              </Box>
              <Box display={{ base: 'block', md: 'none' }} marginX="12px" marginBottom="16px">
                {withProgress && <ProgressBar percent={Math.floor(viewRate * 100)} marginBottom="8px" />}
                {datetimeEnabled && (
                  <StyledDescription size="small" view={view}>
                    {`${dayjs(deliveredAt).format('YYYY-MM-DD')} 購買`}
                    {lastViewDate ? ` / ${dayjs(lastViewDate).format('YYYY-MM-DD')}上次觀看` : ' / 尚未觀看'}
                  </StyledDescription>
                )}
              </Box>
            </StyledWrapper>
          </Link>
        </Box>
      )}
    </>
  )
}

export default ProgramCard
