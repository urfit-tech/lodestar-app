import { Box, Text } from '@chakra-ui/react'
import { LayoutProps, SpaceProps } from '@chakra-ui/styled-system'
import dayjs from 'dayjs'
import { CommonTitleMixin, MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ProgramCover } from '../../components/common/Image'
import EmptyCover from '../../images/empty-cover.png'
import { ProgramPackageProps } from '../../types/programPackage'

const StyledCard = styled(Box)`
  overflow: hidden;
  background: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
`

const StyledTitle = styled(Text)<{ view?: string }>`
  ${MultiLineTruncationMixin}
  ${CommonTitleMixin}
  ${props =>
    props.view === 'List'
      ? `
      margin-bottom:0px;
      display:block;
      overflow: hidden;
      text-overflow: ellipsis;
      `
      : `
      margin-bottom: 1.25rem;
      height: 3rem;
      `}
`

const StyledDescription = styled(Text)<{ view?: string }>`
  ${MultiLineTruncationMixin}
  ${props =>
    props.view === 'List' &&
    `
    margin-top:4px;
  `}
  font-size: 12px;
  color: var(--gray-dark);
  letter-spacing: 0.4px;
`

const PackageDatetime: React.FC<{
  deliveredAt: Date | undefined | null
  lastViewedAt: Date | undefined | null
  view?: string
  display?: LayoutProps['display']
  marginX?: SpaceProps['marginX']
  marginBottom?: SpaceProps['marginBottom']
}> = ({ display, view, deliveredAt, lastViewedAt, marginX, marginBottom }) => {
  return (
    <StyledDescription display={display} marginX={marginX} marginBottom={marginBottom} view={view}>
      {`${dayjs(deliveredAt).format('YYYY-MM-DD')} 購買`}
      {lastViewedAt ? ` / ${dayjs(lastViewedAt).format('YYYY-MM-DD')} 上次觀看` : ` / 尚未觀看`}
    </StyledDescription>
  )
}

const PackageCard: React.VFC<
  Pick<ProgramPackageProps, 'coverUrl' | 'title'> & {
    memberId?: string
    view?: string
    programDateEnabled?: boolean
    lastViewedAt?: Date | null
    deliveredAt?: Date | null
    link: string
  }
> = ({ coverUrl, title, memberId, view, lastViewedAt, programDateEnabled: datetimeEnabled, deliveredAt, link }) => {
  return (
    <>
      <Link to={link}>
        <StyledCard>
          {view !== 'List' ? (
            <>
              <ProgramCover width="100%" paddingTop="calc(100% * 9/16)" src={coverUrl || EmptyCover} shape="rounded" />
              <Box padding="1.25rem">
                <StyledTitle>{title}</StyledTitle>
                {datetimeEnabled && memberId && (
                  <PackageDatetime deliveredAt={deliveredAt} lastViewedAt={lastViewedAt} />
                )}
              </Box>
            </>
          ) : (
            <>
              <Box
                display="flex"
                marginY={{ base: '16px', md: '0px' }}
                marginX={{ base: '12px', md: '0px' }}
                alignItems="center"
              >
                <ProgramCover
                  width={{ base: '40%', md: '15%' }}
                  height={{ base: '40%', md: '15%' }}
                  paddingTop={{ base: 'calc(40% * 9/16)', md: 'calc(15% * 9/16)' }}
                  margin={{ base: '0px 16px 0px 0px', md: '12px' }}
                  src={coverUrl || EmptyCover}
                  shape="rounded"
                />
                <Box width="80%">
                  <StyledTitle fontSize="1rem" noOfLines={{ base: 2, md: 1 }} view={view}>
                    {title}
                  </StyledTitle>
                  {datetimeEnabled && memberId && (
                    <PackageDatetime
                      display={{ base: 'none', md: 'block' }}
                      view={view}
                      deliveredAt={deliveredAt}
                      lastViewedAt={lastViewedAt}
                    />
                  )}
                </Box>
              </Box>
              {datetimeEnabled && memberId && (
                <PackageDatetime
                  display={{ base: 'block', md: 'none' }}
                  marginX="12px"
                  marginBottom="16px"
                  view={view}
                  deliveredAt={deliveredAt}
                  lastViewedAt={lastViewedAt}
                />
              )}
            </>
          )}
        </StyledCard>
      </Link>
    </>
  )
}

export default PackageCard
