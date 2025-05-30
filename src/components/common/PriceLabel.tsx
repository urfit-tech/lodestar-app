import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import { useCurrency } from '../../hooks/util'
import { PeriodType } from '../../types/program'
import ShortenPeriodTypeLabel from './ShortenPeriodTypeLabel'

const messages = defineMessages({
  listPrice: { id: 'common.label.listPrice', defaultMessage: '定價' },
  free: { id: 'common.label.free', defaultMessage: '免費' },
  firstPeriod: { id: 'common.label.firstPeriod', defaultMessage: '首期' },
  fromSecondPeriod: { id: 'common.label.fromSecondPeriod', defaultMessage: '第二期開始' },
  originalPrice: { id: 'common.label.originalPrice', defaultMessage: '原價' },
  voucherPlanPriceLabel: {
    id: 'product.label.voucherPlanPriceLabel',
    defaultMessage: '1 份 {saleAmount} 張 ',
  },
})

const FullDetailPrice = styled.div<{ isSaleAmount?: boolean }>`
  > div:first-child {
    color: ${props => (props.isSaleAmount ? props.theme['@primary-color'] : 'var(--gray-darker)')};
    font-size: ${props => (props.isSaleAmount ? '16px' : '28px')};
    letter-spacing: ${props => (props.isSaleAmount ? '0.2px' : undefined)};
    font-weight: bold;
  }
  > div:nth-child(2) {
    color: var(--gray-darker);
  }
`
const SalePrice = styled.div``
const ListPrice = styled.div`
  ${SalePrice} + && {
    color: var(--black-45);
    font-size: 14px;
    text-decoration: line-through;
  }
`

const InlinePrice = styled.div`
  color: ${props => props.theme['@primary-color']};

  & > div {
    display: inline;
  }

  & > div:first-child:not(:last-child) {
    margin-right: 0.5rem;
    color: var(--black-45);
    text-decoration: line-through;
  }
`

type PriceLabelOptions = {
  listPrice: number
  salePrice?: number | null
  downPrice?: number | null
  periodAmount?: number | null
  periodType?: PeriodType
  currencyId?: 'LSC' | string
  coinUnit?: string
  saleAmount?: number | null
}
const PriceLabel: React.FC<
  PriceLabelOptions & {
    variant?: 'default' | 'inline' | 'full-detail'
    render?: React.FC<PriceLabelOptions & { formatCurrency: (price: number) => string }>
    noFreeText?: boolean
  }
> = ({ variant, render, noFreeText, ...options }) => {
  const { listPrice, salePrice, saleAmount, downPrice, currencyId, coinUnit, periodAmount, periodType } = options
  const { formatMessage } = useIntl()
  const { formatCurrency } = useCurrency(currencyId, coinUnit)

  const displayPrice = salePrice || listPrice
  const firstPeriodPrice = displayPrice - (downPrice || 0)

  if (render) {
    return render({ ...options, formatCurrency })
  }

  const periodElem = !!periodType && (
    <>
      {` / ${periodAmount && periodAmount > 1 ? periodAmount : ''}`}
      <ShortenPeriodTypeLabel periodType={periodType} withQuantifier={!!periodAmount && periodAmount > 1} />
    </>
  )

  if (variant === 'full-detail') {
    return (
      <FullDetailPrice className="price" isSaleAmount={!!saleAmount}>
        {!!downPrice && (
          <div className="downPrice">
            <span className="downPrice__firstPeriod">{formatMessage(messages.firstPeriod)}</span>
            {firstPeriodPrice === 0 && !noFreeText && (
              <span className="downPrice__free">{formatMessage(messages.free)}</span>
            )}
            <span className="downPrice__firstPeriodPriceAmount">{formatCurrency(firstPeriodPrice)}</span>
          </div>
        )}

        {typeof salePrice === 'number' && (
          <SalePrice className="salePrice">
            {!!downPrice && (
              <span className="salePrice__fromSecondPeriod">{formatMessage(messages.fromSecondPeriod)}</span>
            )}
            {salePrice === 0 && !noFreeText && (
              <span className="salePrice__freeText">{formatMessage(messages.free)}</span>
            )}
            {saleAmount ? (
              <>
                <span className="salePrice__saleAmount">
                  {formatMessage(messages.voucherPlanPriceLabel, { saleAmount: saleAmount })}
                </span>
                <span className="salePrice__amount">{formatCurrency(salePrice)}</span>
              </>
            ) : (
              <span className="salePrice__amount">{formatCurrency(salePrice)}</span>
            )}
            <span className="salePrice__periodUnit" style={{ fontSize: '16px' }}>
              {periodElem}
            </span>
          </SalePrice>
        )}

        <ListPrice className="listPrice">
          {typeof salePrice === 'number' ? (
            <span className="listPrice__originalPriceText">{formatMessage(messages.originalPrice)}</span>
          ) : !!downPrice ? (
            <span className="listPrice__fromSecondPeriodText">{formatMessage(messages.fromSecondPeriod)}</span>
          ) : (
            ''
          )}
          {listPrice === 0 && !noFreeText && (
            <span className="listPrice__freeText">{formatMessage(messages.free)}</span>
          )}
          <span className="listPrice__amount">{formatCurrency(listPrice)}</span>
          <span className="listPrice__periodUnit" style={{ fontSize: '16px' }}>
            {periodElem}
          </span>
        </ListPrice>
      </FullDetailPrice>
    )
  }

  if (variant === 'inline') {
    return (
      <InlinePrice className="price">
        <ListPrice className="listPrice">
          <span className="listPrice__amount">{formatCurrency(listPrice)}</span>
          <span className="listPrice__periodUnit">{periodElem}</span>
        </ListPrice>
        {typeof salePrice === 'number' && (
          <SalePrice className="salePrice">
            <span className="salePrice__amount">{formatCurrency(salePrice)}</span>
            <span className="salePrice__periodUnit">{periodElem}</span>
          </SalePrice>
        )}
      </InlinePrice>
    )
  }

  return <span className="price listPrice__amount">{formatCurrency(listPrice)}</span>
}

export default PriceLabel
