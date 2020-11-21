import React from 'react'
import styled from 'styled-components'
import EmptyCover from '../../images/empty-cover.png'
import { MerchandiseBriefProps } from '../../types/merchandise'
import { CustomRatioImage } from '../common/Image'
import PriceLabel from '../common/PriceLabel'

const StyledTitle = styled.h3`
  color: var(--gray-darker);
  font-size: 16px;
  font-weight: bold;
  line-height: 1.5;
  letter-spacing: 0.2px;
`

const MerchandiseCard: React.FC<MerchandiseBriefProps> = ({ title, minPrice, maxPrice, images }) => {
  return (
    <>
      <CustomRatioImage
        width="100%"
        ratio={1}
        src={(images && images[0]?.url) || EmptyCover}
        shape="rounded"
        className="mb-2"
      />
      <div className="text-center">
        <StyledTitle>{title}</StyledTitle>
        <div>
          <PriceLabel listPrice={minPrice} />
          {` ~ `}
          <PriceLabel listPrice={maxPrice} />
        </div>
      </div>
    </>
  )
}

export default MerchandiseCard
