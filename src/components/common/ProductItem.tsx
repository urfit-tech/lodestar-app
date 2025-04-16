import { Typography } from 'antd'
import { CommonTextMixin } from 'lodestar-app-element/src/components/common/index'
import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'
import ProductTypeLabel from 'lodestar-app-element/src/components/labels/ProductTypeLabel'
import React from 'react'
import styled, { css } from 'styled-components'
import { desktopViewMixin } from '../../helpers'
import EmptyCover from '../../images/empty-cover.png'
import { Product } from '../../types/product'
import { CustomRatioImage } from './Image'

const StyledCoverImage = styled.img`
  width: 64px;
  height: 48px;
  min-height: 1px;
  border-radius: 4px;
  object-fit: cover;
  object-position: center;
`
const StyledProductType = styled.div`
  color: var(--gray-dark);
  font-size: 12px;
  letter-spacing: 0.6px;
`
const StyledProductTitle = styled.div`
  color: var(--gray-darker);
  line-height: 1.5;
  letter-spacing: 0.2px;
`
const StyledTitle = styled(Typography.Title)`
  && {
    color: var(--gray-darker);
    font-size: 20px;
    font-weight: bold;
    line-height: 1.3;
    letter-spacing: 0.77px;
  }
`
const StyledMeta = styled.span`
  margin-top: 0.5rem;
  min-width: 4.5rem;
  white-space: nowrap;

  ${desktopViewMixin(css`
    margin-top: 0;
    text-align: right;
  `)}
`
const StyledListLabelBLock = styled.div`
  width: 5rem;
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
`
const StyledListTitleBlock = styled.div`
  overflow: hidden;
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const ProductItem: React.FC<{
  product: Product
  variant?: 'default' | 'simple' | 'simpleCartProduct' | 'checkout' | 'coupon-product'
  quantity?: number
}> = ({ product, variant, quantity }) => {
  const imageUrl =
    product.productType === 'ProgramPlan'
      ? product.coverType === 'video'
        ? product.coverThumbnailUrl || EmptyCover
        : product.coverUrl || EmptyCover
      : product.productType === 'Card'
      ? EmptyCover
      : product.coverUrl || EmptyCover

  switch (variant) {
    case 'simple':
      return (
        <>
          <StyledTitle level={2} ellipsis={{ rows: 2 }} className="flex-grow-1 m-0 mr-5">
            {product.title}
          </StyledTitle>
          <StyledCoverImage src={imageUrl} alt={product.targetId} className="flex-shrink-0" />
        </>
      )
    case 'coupon-product':
      return (
        <div className="d-flex mb-1">
          <StyledListLabelBLock className="flex-shrink-0">
            {product.productType ? <ProductTypeLabel productType={product.productType} /> : null}
          </StyledListLabelBLock>
          <StyledListTitleBlock className="flex-grow-1">{product.title}</StyledListTitleBlock>
        </div>
      )
    case 'simpleCartProduct':
      let listPrice: number
      switch (product.productType) {
        case 'ProgramPlan':
        case 'ProgramPackagePlan':
        case 'ProjectPlan':
        case 'PodcastProgram':
        case 'MerchandiseSpec':
          listPrice = product.salePrice || product.listPrice || 0
          break
        case 'ActivityTicket':
        case 'Card':
          listPrice = product.listPrice
          break
        default:
          listPrice = 0
          break
      }
      return (
        <div className="d-flex align-items-center justify-content-between">
          <CustomRatioImage width="4rem" ratio={2 / 3} src={imageUrl} shape="rounded" className="flex-shrink-0 mr-3" />
          <div className="flex-grow-1">
            <Typography.Paragraph ellipsis={{ rows: 2 }} className="mb-0">
              {product.title}
              {typeof quantity === 'number' ? ` x${quantity}` : ''}
            </Typography.Paragraph>
            <StyledMeta className="text-left">
              <PriceLabel
                listPrice={listPrice * (quantity || 1)}
                currencyId={product.productType === 'MerchandiseSpec' ? product.currencyId : undefined}
              />
            </StyledMeta>
          </div>
        </div>
      )
    // case 'checkout':
    //   return (
    //     <>
    //       <div className="d-flex align-items-center justify-content-between">
    //         <StyledTitle level={2} ellipsis={{ rows: 2 }} className="flex-grow-1 m-0 mr-5">
    //           <span>{title}</span>
    //           {!!startedAt && !!endedAt && (
    //             <StyledPeriod className="mt-2">{`${moment(startedAt).format('YYYY-MM-DD(dd)')} ${moment(
    //               startedAt,
    //             ).format('HH:mm')} - ${moment(endedAt).format('HH:mm')}`}</StyledPeriod>
    //           )}
    //         </StyledTitle>
    //         <CustomRatioImage width="88px" ratio={3 / 4} src={imageUrl} shape="rounded" className="flex-shrink-0" />
    //       </div>
    //       {typeof listPrice == 'number' && (
    //         <PriceLabel
    //           variant="full-detail"
    //           listPrice={listPrice}
    //           salePrice={salePrice}
    //           downPrice={discountDownPrice}
    //           currencyId={currencyId}
    //           periodType={isSubscription === undefined && periodType ? periodType : undefined}
    //           periodAmount={isSubscription === undefined && periodType ? periodAmount : undefined}
    //         />
    //       )}
    //       {isSubscription === false && periodType && (
    //         <StyledHighlight className="mb-3">
    //           {formatMessage(productMessages.programPackage.label.availableForLimitTime, {
    //             amount: periodAmount,
    //             unit:
    //               periodType === 'D'
    //                 ? formatMessage(commonMessages.unit.day)
    //                 : periodType === 'W'
    //                 ? formatMessage(commonMessages.unit.week)
    //                 : periodType === 'M'
    //                 ? formatMessage(commonMessages.unit.monthWithQuantifier)
    //                 : periodType === 'Y'
    //                 ? formatMessage(commonMessages.unit.year)
    //                 : formatMessage(commonMessages.unknown.period),
    //           })}
    //         </StyledHighlight>
    //       )}
    //     </>
    //   )
  }

  return (
    <div className="d-flex align-items-center justify-content-start">
      <CustomRatioImage width="64px" ratio={3 / 4} src={imageUrl} shape="rounded" className="flex-shrink-0 mr-3" />
      <div className="flex-grow-1">
        <StyledProductType>
          <ProductTypeLabel productType={product.productType} />
        </StyledProductType>

        <StyledProductTitle>{product.title}</StyledProductTitle>
      </div>
    </div>
  )
}

export default ProductItem
