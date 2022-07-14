import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'
import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import EmptyCover from '../../images/empty-cover.png'
import { MerchandiseBriefProps } from '../../types/merchandise'
import { CustomRatioImage } from '../common/Image'

const StyledTitle = styled.h3`
  color: var(--gray-darker);
  font-size: 16px;
  font-weight: bold;
  line-height: 1.5;
  letter-spacing: 0.2px;
`

const MerchandiseCard: React.VFC<
  MerchandiseBriefProps & {
    onClick?: () => void
  }
> = ({ id, title, minPrice, maxPrice, images, currencyId, specs, soldAt, onClick }) => {
  const isOnSale = (soldAt?.getTime() || 0) > Date.now()
  const history = useHistory()
  return (
    <div
      className="cursor-pointer"
      onClick={() => {
        onClick?.()
        history.push(`/merchandises/${id}`)
      }}
    >
      <CustomRatioImage
        width="100%"
        ratio={1}
        src={(images && images[0]?.url) || EmptyCover}
        shape="rounded"
        className="mb-2"
      />
      <div className="text-center">
        <StyledTitle>
          <Link to={`/merchandises/${id}`} onClick={onClick}>
            {title}
          </Link>
        </StyledTitle>
        {specs.length === 1 && (
          <div>
            <PriceLabel
              variant="inline"
              currencyId={currencyId}
              listPrice={specs[0].listPrice}
              salePrice={isOnSale ? specs[0].salePrice : undefined}
            />
          </div>
        )}
        {specs.length > 1 && (
          <div>
            <PriceLabel currencyId={currencyId} listPrice={minPrice} />
            {` ~ `}
            <PriceLabel currencyId={currencyId} listPrice={maxPrice} />
          </div>
        )}
      </div>
    </div>
  )
}

export default MerchandiseCard
