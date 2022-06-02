import { Button, Input, Spinner } from '@chakra-ui/react'
import { Divider, message } from 'antd'
import axios from 'axios'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { sum } from 'ramda'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { handleError } from '../../helpers'
import { checkoutMessages, codeMessages, commonMessages } from '../../helpers/translation'
import { useCouponCollection } from '../../hooks/data'
import { CouponProps, OrderDiscountProps, OrderProductProps } from '../../types/checkout'
import CommonModal from '../common/CommonModal'
import CouponCard from './CouponCard'
import messages from './translation'

const StyledInputWrapper = styled.div`
  && {
    input:focus {
      box-shadow: none;
    }
  }
`

const CouponSelectionModal: React.VFC<{
  memberId: string
  orderProducts: OrderProductProps[]
  orderDiscounts: OrderDiscountProps[]
  renderTrigger: (params: { onOpen: () => void; selectedCoupon?: CouponProps }) => React.ReactElement
  onSelect?: (coupon: CouponProps) => void
}> = ({ memberId, orderProducts, orderDiscounts, onSelect, renderTrigger }) => {
  const { formatMessage } = useIntl()
  const { authToken } = useAuth()
  const { coupons, loadingCoupons, refetchCoupons } = useCouponCollection(memberId)

  const [code, setCode] = useState('')
  const [visible, setVisible] = useState(false)
  const [inserting, setInserting] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<CouponProps>()

  const handleCouponInsert = () => {
    setInserting(true)
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_ROOT}/payment/exchange`,
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
          message.success(formatMessage(messages.CouponSelectionModal.addSuccess))
        } else {
          message.error(formatMessage(codeMessages[data.code as keyof typeof codeMessages]))
        }
      })
      .catch(handleError)
      .finally(() => setInserting(false))
  }

  return (
    <>
      {renderTrigger({ onOpen: () => setVisible(true), selectedCoupon })}
      <CommonModal
        title={formatMessage(checkoutMessages.title.chooseCoupon)}
        onClose={() => setVisible(false)}
        isOpen={visible}
      >
        {loadingCoupons ? (
          <Spinner />
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
              const isDisabled = coupon.couponCode.couponPlan.constraint > price
              return (
                <CouponCard
                  key={coupon.id}
                  coupon={coupon}
                  onClick={() => {
                    if (isDisabled) {
                      return
                    }
                    onSelect && onSelect(coupon)
                    setSelectedCoupon(coupon)
                    setVisible(false)
                  }}
                  isDisabled={isDisabled}
                  style={{ marginBottom: '12px' }}
                />
              )
            })
        )}

        <Divider>{formatMessage(commonMessages.defaults.or)}</Divider>

        <div className="d-flex">
          <StyledInputWrapper className="flex-grow-1">
            <Input
              variant="outline"
              style={{ borderRadius: '4px 0px 0px 4px' }}
              placeholder={formatMessage(checkoutMessages.form.placeholder.enter)}
              value={code}
              onChange={e => setCode(e.target.value)}
            />
          </StyledInputWrapper>
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
      </CommonModal>
    </>
  )
}

export default CouponSelectionModal
