import { Box, Text } from '@chakra-ui/react'
import { LayoutProps, SpaceProps } from '@chakra-ui/styled-system'
import dayjs from 'dayjs'
import { CommonTitleMixin, MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common/index'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ProgramCover } from '../../components/common/Image'
import MemberAvatar from '../../components/common/MemberAvatar'
import ProgressBar from '../../components/common/ProgressBar'
import EmptyCover from '../../images/empty-cover.png'
import { ProgramRole } from '../../types/program'

const StyledCard = styled(Box)`
  overflow: hidden;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);
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
const AvatarPlaceHolder = styled(Box)`
  height: 2rem;
`

const ProgramDatetime: React.FC<{
  deliveredAt: Date | undefined | null
  lastViewedAt: Date | undefined | null
  size?: string
  view?: string
  display?: LayoutProps['display']
}> = ({ display, size, view, deliveredAt, lastViewedAt }) => {
  return (
    <StyledDescription display={display} view={view} size={size}>
      {`${dayjs(deliveredAt).format('YYYY-MM-DD')} 購買`}
      {lastViewedAt ? ` / ${dayjs(lastViewedAt).format('YYYY-MM-DD')} 上次觀看` : ` / 尚未觀看`}
    </StyledDescription>
  )
}

const CreatorInfo: React.FC<{
  roles: ProgramRole[]
  className?: string
  marginY?: SpaceProps['marginY']
  display?: LayoutProps['display']
  view?: string
  noAvatar?: boolean
  withName?: boolean
}> = ({ roles, className, display, marginY, view, withName, noAvatar }) => {
  return (
    <AvatarPlaceHolder
      width={view === 'List' && { base: '100%', md: '40%' }}
      display={display}
      className={className}
      marginY={marginY}
    >
      {roles
        .filter(role => role.name === 'instructor')
        .slice(0, 1)
        .map(role => (
          <MemberAvatar
            key={role.memberId}
            memberId={role.memberId}
            withName={withName}
            noAvatar={noAvatar}
            view={view}
          />
        ))}
    </AvatarPlaceHolder>
  )
}

const ProgramCard: React.VFC<{
  programId: string
  roles: ProgramRole[]
  coverThumbnailUrl: string | null
  coverUrl: string | null
  coverMobileUrl: string | null
  title: string
  abstract: string
  viewRate: number
  view?: string
  programType?: string
  previousPage?: string
  noInstructor?: boolean
  withProgress?: boolean
  isExpired?: boolean
  datetimeEnabled?: boolean
  deliveredAt?: Date | null
  lastViewDate?: Date | null
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
  datetimeEnabled,
}) => {
  return (
    <>
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
        <Box opacity={isExpired ? '50%' : '100%'}>
          {view !== 'List' ? (
            <>
              {!noInstructor && <CreatorInfo className="my-3" roles={roles} withName={true} />}

              <StyledCard>
                <ProgramCover
                  width="100%"
                  paddingTop="calc(100% * 9/16)"
                  src={coverThumbnailUrl || coverUrl || coverMobileUrl || EmptyCover}
                  shape="rounded"
                />
                <Box padding="1.25rem">
                  <StyledTitle>{title}</StyledTitle>
                  {datetimeEnabled && (
                    <ProgramDatetime size="small" deliveredAt={deliveredAt} lastViewedAt={lastViewDate} />
                  )}
                  <StyledDescription>{abstract}</StyledDescription>

                  {withProgress && <ProgressBar percent={Math.floor(viewRate * 100)} width="100%" />}
                </Box>
              </StyledCard>
            </>
          ) : (
            <StyledCard>
              <Box
                display="flex"
                alignItems="center"
                marginY={{ base: '16px', md: '0px' }}
                marginX={{ base: '12px', md: '0px' }}
              >
                <ProgramCover
                  width={{ base: '40%', md: '15%' }}
                  height={{ base: '40%', md: '15%' }}
                  paddingTop={{ base: 'calc(40% * 9/16)', md: 'calc(15% * 9/16)' }}
                  margin={{ base: '0px 16px 0px 0px', md: '12px' }}
                  src={coverThumbnailUrl || coverUrl || coverMobileUrl || EmptyCover}
                  shape="rounded"
                />
                <Box
                  width={{ base: '50%', md: '80%' }}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box minWidth={{ base: '100%', md: '50%' }} maxWidth={{ base: '100%', md: '50%' }}>
                    <StyledTitle noOfLines={{ base: 2, md: 1 }} view={view}>
                      {title}
                    </StyledTitle>
                    {datetimeEnabled && (
                      <ProgramDatetime
                        size="small"
                        display={{ base: 'none', md: 'block' }}
                        view={view}
                        deliveredAt={deliveredAt}
                        lastViewedAt={lastViewDate}
                      />
                    )}
                    {!noInstructor && (
                      <CreatorInfo
                        display={{ base: 'block', md: 'none' }}
                        roles={roles}
                        view={view}
                        withName={true}
                        noAvatar={true}
                      />
                    )}
                  </Box>

                  <Box
                    width="100%"
                    alignItems="center"
                    justifyContent={{ md: 'space-between', lg: 'flex-end' }}
                    display={{ base: 'none', md: 'flex' }}
                  >
                    {!noInstructor && <CreatorInfo marginY="1rem" roles={roles} view={view} withName={true} />}
                    {withProgress && <ProgressBar percent={Math.floor(viewRate * 100)} width="40%" />}
                  </Box>
                </Box>
              </Box>
              <Box display={{ base: 'block', md: 'none' }} marginX="12px" marginBottom="16px">
                {withProgress && <ProgressBar percent={Math.floor(viewRate * 100)} marginBottom="8px" />}
                {datetimeEnabled && (
                  <ProgramDatetime size="small" view={view} deliveredAt={deliveredAt} lastViewedAt={lastViewDate} />
                )}
              </Box>
            </StyledCard>
          )}
        </Box>
      </Link>
    </>
  )
}

export default ProgramCard
