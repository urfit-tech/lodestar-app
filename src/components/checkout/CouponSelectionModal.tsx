import { Button, Input } from '@chakra-ui/react'
import { Divider, message, Modal, Spin } from 'antd'
import axios from 'axios'
import { sum } from 'ramda'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { handleError } from '../../helpers'
import { checkoutMessages, codeMessages, commonMessages } from '../../helpers/translation'
import { useCouponCollection } from '../../hooks/data'
import { CouponProps, OrderDiscountProps, OrderProductProps } from '../../types/checkout'
import { useAuth } from '../auth/AuthContext'
import CouponCard from './CouponCard'

const CouponSelectionModal: React.FC<{
  memberId: string
  orderProducts: OrderProductProps[]
  orderDiscounts: OrderDiscountProps[]
  onSelect?: (coupon: CouponProps) => void
  render?: React.FC<{
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    selectedCoupon?: CouponProps
  }>
}> = ({ memberId, orderProducts, orderDiscounts, onSelect, render }) => {
  const { formatMessage } = useIntl()
  const { authToken, apiHost } = useAuth()
  const { coupons, loadingCoupons, refetchCoupons } = useCouponCollection(memberId)

  const [code, setCode] = useState('')
  const [visible, setVisible] = useState(false)
  const [inserting, setInserting] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<CouponProps>()

  const handleCouponInsert = () => {
    setInserting(true)
    axios
      .post(
        `https://${apiHost}/payment/exchange`,
        {
          code,
          type: 'Coupon',
        },
        {
          headers: { authorization: `Bearer ${authToken}` },
        },
      )
      .then(({ data }) => {
        if (data.code === 'SUCCESS') {
          refetchCoupons()
          setCode('')
          message.success(formatMessage(codeMessages[data.code as keyof typeof codeMessages]))
        } else {
          message.error(formatMessage(codeMessages[data.code as keyof typeof codeMessages]))
        }
      })
      .catch(handleError)
      .finally(() => setInserting(false))
  }

  return (
    <>
      {render && render({ setVisible, selectedCoupon })}

      <Modal
        title={formatMessage(checkoutMessages.title.chooseCoupon)}
        footer={null}
        onCancel={() => setVisible(false)}
        visible={visible}
      >
        {loadingCoupons ? (
          <Spin />
        ) : (
          coupons
            .filter(coupon => !coupon.status.outdated && !coupon.status.used)
            .map(coupon => {
              const couponPlanScope = coupon.couponCode.couponPlan.scope
              const couponPlanProductIds = coupon.couponCode.couponPlan.productIds || []
              const isInCouponScope = (productId: string) => {
                const [productType] = productId.split('_')
                return (
                  couponPlanScope === null ||
                  couponPlanScope.includes(productType) ||
                  couponPlanProductIds.includes(productId)
                )
              }

              const filteredOrderProducts = orderProducts.filter(orderProduct =>
                isInCouponScope(orderProduct.productId),
              )
              const filteredOrderDiscounts = orderDiscounts.filter(orderDiscount => orderDiscount.type === 'DownPrice')
              const price =
                sum(filteredOrderProducts.map(orderProduct => orderProduct.price)) -
                sum(filteredOrderDiscounts.map(orderDiscount => orderDiscount.price))

              return coupon.couponCode.couponPlan.constraint <= price ? (
                <CouponCard
                  key={coupon.id}
                  coupon={coupon}
                  onClick={() => {
                    onSelect && onSelect(coupon)
                    setSelectedCoupon(coupon)
                    setVisible(false)
                  }}
                  style={{ cursor: 'pointer', marginBottom: '12px' }}
                />
              ) : (
                <CouponCard
                  key={coupon.id}
                  coupon={coupon}
                  style={{ userSelect: 'none', cursor: 'not-allowed', marginBottom: '12px', color: '#9b9b9b' }}
                />
              )
            })
        )}

        <Divider>{formatMessage(commonMessages.defaults.or)}</Divider>

        <div className="d-flex">
          <div className="flex-grow-1">
            <Input
              variant="outline"
              style={{ borderRadius: '4px 0px 0px 4px' }}
              placeholder={formatMessage(checkoutMessages.form.placeholder.enter)}
              value={code}
              onChange={e => setCode(e.target.value)}
            />
          </div>
          <Button
            colorScheme="primary"
            isFullWidth
            style={{ width: '72px', borderRadius: '0px 4px 4px 0px' }}
            isLoading={inserting}
            onClick={handleCouponInsert}
          >
            {formatMessage(commonMessages.button.add)}
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default CouponSelectionModal
