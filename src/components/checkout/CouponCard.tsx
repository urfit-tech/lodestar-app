import { Card } from 'antd'
import { CardProps } from 'antd/lib/card'
import React from 'react'
import { useIntl } from 'react-intl'
import { dateFormatter } from '../../helpers'
import { checkoutMessages } from '../../helpers/translation'
import { CouponProps } from '../../types/checkout'
import PriceLabel from '../common/PriceLabel'

const CouponCard: React.FC<
  CardProps & {
    coupon: CouponProps
  }
> = ({ coupon, ...cardProps }) => {
  const { formatMessage } = useIntl()

  return (
    <Card {...cardProps}>
      <div style={{ fontSize: '20px', fontWeight: 'bold', paddingBottom: '12px' }}>
        {coupon.couponCode.couponPlan.title}
      </div>
      <div>
        {coupon.couponCode.couponPlan.constraint
          ? formatMessage(
              { id: 'checkout.coupon.full', defaultMessage: '消費滿 {amount} 折抵' },
              { amount: <PriceLabel listPrice={coupon.couponCode.couponPlan.constraint} /> },
            )
          : formatMessage(checkoutMessages.content.discountDirectly)}
        {coupon.couponCode.couponPlan.type === 'cash'
          ? formatMessage(
              { id: 'checkout.coupon.amount', defaultMessage: '金額 {amount} 元' },
              { amount: <PriceLabel listPrice={coupon.couponCode.couponPlan.amount} /> },
            )
          : coupon.couponCode.couponPlan.type === 'percent'
          ? formatMessage(
              { id: 'checkout.coupon.proportion', defaultMessage: '比例 {amount}%' },
              { amount: coupon.couponCode.couponPlan.amount },
            )
          : null}
      </div>
      <div>
        {coupon.couponCode.couponPlan.startedAt
          ? dateFormatter(coupon.couponCode.couponPlan.startedAt)
          : formatMessage(checkoutMessages.coupon.fromNow)}
        {' ~ '}
        {coupon.couponCode.couponPlan.endedAt
          ? dateFormatter(coupon.couponCode.couponPlan.endedAt)
          : formatMessage(checkoutMessages.coupon.noPeriod)}
      </div>
    </Card>
  )
}

export default CouponCard
