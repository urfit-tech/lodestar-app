import { Button, Divider } from 'antd'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { dateFormatter } from '../../helpers'
import { checkoutMessages, commonMessages } from '../../helpers/translation'
import { CouponProps } from '../../types/checkout'
import AdminCard from '../common/AdminCard'
import PriceLabel from '../common/PriceLabel'
import CouponDescriptionModal from './CouponDescriptionModal'

const StyledAdminCard = styled(AdminCard)`
  position: relative;
  &::before {
    content: ' ';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #f7f8f8;
    top: 50%;
    transform: translateY(-50%);
    left: -10px;
    z-index: 999;
    box-shadow: inset rgba(0, 0, 0, 0.06) -1px 0px 5px 0px;
  }
  &::after {
    content: ' ';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #f7f8f8;
    top: 50%;
    transform: translateY(-50%);
    right: -10px;
    z-index: 999;
    box-shadow: inset rgba(0, 0, 0, 0.06) 4px 0px 5px 0px;
  }
  .ant-card-head {
    border-bottom: 0;
  }
  .ant-card-head-title {
    padding: 0;
  }
  .ant-card-body {
    padding: 14px 28px 17px 28px;
  }
  .ant-card-bordered {
    border-radius: 0px;
  }
`
const StyledTitle = styled.span`
  display: -webkit-box;
  height: 3.25rem;
  line-height: 1.3;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  letter-spacing: 0.77px;
  font-size: 20px;
  font-weight: bold;
  overflow: hidden;
  white-space: break-spaces;
`
const StyledPriceLabel = styled.span<{ outdated?: boolean }>`
  color: ${props => (props.outdated ? 'var(--gray)' : props.theme['@primary-color'])};
  font-size: 24px;
  letter-spacing: 0.2px;
`
const StyledText = styled.span<{ outdated?: boolean }>`
  padding: 2px 6px;
  color: ${props => (props.outdated ? 'var(--gray-dark)' : props.theme['@primary-color'])};
  background-color: ${props => (props.outdated ? 'var(--gray-lighter)' : props.theme['@processing-color'])};
  font-size: 14px;
  line-height: 1.57;
  letter-spacing: 0.4px;
`

const CouponAdminCard: React.FC<{
  coupon: CouponProps
  outdated?: boolean
}> = ({ coupon, outdated }) => {
  const { formatMessage } = useIntl()
  const [visible, setVisible] = useState(false)

  return (
    <StyledAdminCard
      title={
        <div className="d-flex align-items-start justify-content-between py-4">
          <StyledTitle>{coupon.couponCode.couponPlan.title}</StyledTitle>
          <StyledPriceLabel className="ml-4" outdated={outdated}>
            {coupon.couponCode.couponPlan.type === 'cash' ? (
              <PriceLabel listPrice={coupon.couponCode.couponPlan.amount} />
            ) : coupon.couponCode.couponPlan.type === 'percent' ? (
              coupon.couponCode.couponPlan.amount % 10 === 0 ? (
                `${10 - coupon.couponCode.couponPlan.amount / 10} ${formatMessage(commonMessages.unit.off)}`
              ) : (
                `${100 - coupon.couponCode.couponPlan.amount} ${formatMessage(commonMessages.unit.off)}`
              )
            ) : null}
          </StyledPriceLabel>
        </div>
      }
    >
      <StyledText outdated={outdated}>
        {coupon.couponCode.couponPlan.constraint
          ? formatMessage(checkoutMessages.coupon.full, {
              amount: <PriceLabel listPrice={coupon.couponCode.couponPlan.constraint} />,
            })
          : formatMessage(checkoutMessages.content.discountDirectly)}
        {coupon.couponCode.couponPlan.type === 'cash'
          ? formatMessage(checkoutMessages.coupon.amount, {
              amount: <PriceLabel listPrice={coupon.couponCode.couponPlan.amount} />,
            })
          : coupon.couponCode.couponPlan.type === 'percent'
          ? formatMessage(checkoutMessages.coupon.proportion, {
              amount: coupon.couponCode.couponPlan.amount,
            })
          : null}
      </StyledText>
      <div style={{ fontFamily: 'Roboto', fontSize: '14px', paddingTop: '12px' }}>
        {coupon.couponCode.couponPlan.startedAt
          ? dateFormatter(coupon.couponCode.couponPlan.startedAt)
          : formatMessage(checkoutMessages.coupon.fromNow)}
        {' ~ '}
        {coupon.couponCode.couponPlan.endedAt
          ? dateFormatter(coupon.couponCode.couponPlan.endedAt)
          : formatMessage(checkoutMessages.coupon.noPeriod)}
      </div>

      <Divider className="my-3" />

      <div className="d-flex align-items-center justify-content-between">
        <Button
          type="link"
          onClick={() => setVisible(true)}
          style={{
            fontSize: '14px',
            padding: 0,
            letterSpacing: '-1px',
            height: 'auto',
          }}
        >
          {formatMessage(commonMessages.button.details)}
        </Button>
        <CouponDescriptionModal coupon={coupon} visible={visible} onCancel={() => setVisible(false)} />
      </div>
    </StyledAdminCard>
  )
}

export default CouponAdminCard
