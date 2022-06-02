import React from 'react'
import styled from 'styled-components'
import { durationFullFormatter } from '../../helpers'
import EmptyCover from '../../images/empty-cover.png'
import { AvatarImage, CustomRatioImage } from '../common/Image'
import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'
import Responsive, { BREAK_POINT } from '../common/Responsive'

const StyledWrapper = styled.div`
  overflow: hidden;
  background-color: white;
  border-radius: 4px;
  box-shadow: 2px 4px 8px 0 rgba(0, 0, 0, 0.1);
`
const StyledCoverBlock = styled.div`
  position: relative;
`
const StyledDuration = styled.div`
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  padding: 0 0.25rem;
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 12px;
  letter-spacing: 0.58px;
`
const StyledMeta = styled.div`
  padding: 0.75rem;

  @media (min-width: ${BREAK_POINT}px) {
    padding: 1.25rem;
  }
`
const StyledTitle = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 1.5em;
  color: var(--gray-darker);
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;

  @media (min-width: ${BREAK_POINT}px) {
    -webkit-line-clamp: 2;
    height: 3em;
  }
`
const StyledDescription = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.4px;

  @media (min-width: ${BREAK_POINT}px) {
    line-height: 20px;

    span:first-child {
      display: inline;
    }
  }
`

export type PodcastProgramCardProps = {
  coverUrl: string | null
  title: string
  instructor?: {
    id: string
    avatarUrl?: string | null
    name: string
  } | null
  salePrice?: number
  listPrice: number
  duration: number
  durationSecond: number
  variant?: 'progress'
  percent?: number
  isEnrolled?: boolean
  noPrice?: boolean
}
const PodcastProgramCard: React.VFC<PodcastProgramCardProps> = ({
  coverUrl,
  title,
  instructor,
  salePrice,
  listPrice,
  duration,
  durationSecond,
  variant,
  percent,
  isEnrolled,
  noPrice,
}) => {
  return (
    <StyledWrapper className="d-flex justify-content-between">
      <StyledCoverBlock className="flex-shrink-0">
        <Responsive.Default>
          <CustomRatioImage width="88px" ratio={1} src={coverUrl || EmptyCover} />
        </Responsive.Default>
        <Responsive.Desktop>
          <CustomRatioImage width="140px" ratio={1} src={coverUrl || EmptyCover} />
        </Responsive.Desktop>
        <StyledDuration>{durationFullFormatter(durationSecond)}</StyledDuration>
      </StyledCoverBlock>

      <StyledMeta className="flex-grow-1 d-flex flex-column justify-content-between">
        <StyledTitle>{title}</StyledTitle>

        <StyledDescription className="d-flex justify-content-between">
          <div className="d-none d-lg-flex align-items-center">
            <AvatarImage src={instructor?.avatarUrl} size={36} className="mr-2" />
            <span>{instructor?.name}</span>
          </div>

          {!noPrice && (
            <div className="text-right">
              <PriceLabel variant="inline" listPrice={listPrice} salePrice={salePrice} />
            </div>
          )}
        </StyledDescription>
      </StyledMeta>
    </StyledWrapper>
  )
}

export default PodcastProgramCard
