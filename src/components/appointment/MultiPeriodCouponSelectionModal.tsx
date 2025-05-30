import { Button, Input, Spinner } from '@chakra-ui/react'
import axios from 'axios'
import CouponCard from 'lodestar-app-element/src/components/cards/CouponCard'
import Divider from 'lodestar-app-element/src/components/common/Divider'
import CommonModal from 'lodestar-app-element/src/components/modals/CommonModal'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { handleError } from 'lodestar-app-element/src/helpers'
import { checkoutMessages, commonMessages } from 'lodestar-app-element/src/helpers/translation'
import { useToastMessage } from 'lodestar-app-element/src/hooks/util'
import { CouponProps, OrderDiscountProps, OrderProductProps } from 'lodestar-app-element/src/types/checkout'
import { always, complement, equals, filter, head, ifElse, includes, isEmpty, map, pipe, prop, sum } from 'ramda'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

const StyledInputWrapper = styled.div`
  && {
    input:focus {
      box-shadow: none;
    }
  }
`

const MultiPeriodCouponSelectionModal: React.FC<{
  memberId: string
  orderProducts: OrderProductProps[]
  orderDiscounts: OrderDiscountProps[]
  coupons: CouponProps[]
  currentlyUsedDiscountIds: string[]
  loadingCoupons: boolean
  refetchCoupons: () => Promise<void>
  selectedCoupontId: string | null
  renderTrigger: (params: { onOpen: () => void; selectedCoupon?: CouponProps }) => React.ReactElement
  onSelect?: (coupon: CouponProps) => void
}> = ({
  orderProducts,
  orderDiscounts,
  coupons,
  currentlyUsedDiscountIds,
  loadingCoupons,
  refetchCoupons,
  onSelect,
  selectedCoupontId,
  renderTrigger,
}) => {
  const { formatMessage } = useIntl()
  const { authToken } = useAuth()

  const [code, setCode] = useState('')
  const [visible, setVisible] = useState(false)
  const [inserting, setInserting] = useState(false)

  const [selectedCoupon, setSelectedCoupon] = useState<CouponProps | undefined>(
    selectedCoupontId
      ? (pipe as any)(filter((pipe as any)(prop('id'), equals(selectedCoupontId))), head)(coupons)
      : undefined,
  )

  const leftCoupons = coupons.filter(coupon => complement(includes(`Coupon_${coupon.id}`))(currentlyUsedDiscountIds))

  const toastMessage = useToastMessage()

  const handleCouponInsert = () => {
    setInserting(true)
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_ROOT}/payment/exchange`,
        {
          code: code.trim(),
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
          toastMessage({ responseCode: data.code })
        } else {
          toastMessage({ responseCode: data.code, status: 'error' })
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
          ifElse(
            isEmpty,
            always(<p style={{ fontSize: '1.2em' }}>目前無可用折價券，請於下列輸入框中輸入代碼，新增折價券：</p>),
            map((coupon: CouponProps) => {
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

              const isDisabled = filteredOrderProducts.length === 0 || coupon.couponCode.couponPlan.constraint > price
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
                />
              )
            }),
          )(leftCoupons)
        )}

        {coupons.length > 0 ? <Divider>{formatMessage(commonMessages.label.or)}</Divider> : <></>}

        <div className="d-flex">
          <StyledInputWrapper className="flex-grow-1">
            <Input
              variant="outline"
              style={{ borderRadius: '4px 0px 0px 4px' }}
              placeholder={formatMessage(checkoutMessages.placeholder.enterCouponCode)}
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

export default MultiPeriodCouponSelectionModal
