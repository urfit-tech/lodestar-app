import React from 'react'
import styled from 'styled-components'
import EmptyCover from '../../images/empty-cover.png'
import { CustomRatioImage } from '../common/Image'
import PriceLabel from '../common/PriceLabel'
import { BREAK_POINT } from '../common/Responsive'

const StyledWrapper = styled.div`
  overflow: hidden;
  background-color: white;
  border-radius: 4px;
  box-shadow: 2px 4px 8px 0 rgba(0, 0, 0, 0.1);
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

export type PodcastProgramBriefCardProps = {
  coverUrl: string | null
  title: string
  listPrice: number
  salePrice?: number | null
  soldAt?: Date | null
}
const PodcastProgramBriefCard: React.VFC<PodcastProgramBriefCardProps> = ({
  coverUrl,
  title,
  listPrice,
  salePrice,
  soldAt,
}) => {
  return (
    <>
      <StyledWrapper className="d-flex flex-column justify-content-between">
        <CustomRatioImage width="100%" ratio={1} src={coverUrl || EmptyCover} />
        <StyledMeta className="flex-grow-1 d-flex flex-column justify-content-between">
          <StyledTitle>{title}</StyledTitle>
          <div className="text-right">
            <PriceLabel
              variant="inline"
              listPrice={listPrice}
              salePrice={(soldAt?.getTime() || 0) > Date.now() ? salePrice : undefined}
            />
          </div>
        </StyledMeta>
      </StyledWrapper>
    </>
  )
}

export default PodcastProgramBriefCard
