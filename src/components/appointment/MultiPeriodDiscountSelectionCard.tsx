import { Button, Radio, RadioGroup, Stack } from '@chakra-ui/react'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useCouponCollection } from 'lodestar-app-element/src/hooks/data'
import { complement, includes } from 'ramda'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { rgba } from '../../helpers'
import { checkoutMessages, commonMessages } from '../../helpers/translation'
import { useEnrolledMembershipCardIds } from '../../hooks/card'
import { CheckProps } from '../../types/checkout'
import { AuthModalContext } from '../auth/AuthModal'
import MembershipCardSelectionModal from '../checkout/MembershipCardSelectionModal'
import MultiPeriodCouponSelectionModal from './MultiPeriodCouponSelectionModal'

const StyledRadio = styled(Radio)`
  &&:focus {
    box-shadow: 0 0 0 3px ${props => rgba(props.theme['@primary-color'], 0.6)};
  }
`

const DiscountSelectionCard: React.VFC<{
  value?: string | null
  check?: CheckProps
  currentlyUsedDiscountIds: Array<string>
  onChange?: (discountId: string) => void
}> = ({ value: discountId, check, currentlyUsedDiscountIds, onChange }) => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const { enrolledMembershipCardIds } = useEnrolledMembershipCardIds(currentMemberId || '')

  const { coupons, loadingCoupons, refetchCoupons } = useCouponCollection(currentMemberId ?? '')
  const leftCoupons = coupons
    .filter(coupon => complement(includes(`Coupon_${coupon.id}`))(currentlyUsedDiscountIds))
    .filter(coupon => !coupon.status.outdated && !coupon.status.used)

  const [discountType, discountTarget] = discountId?.split('_') || [null, null]
  return (
    <RadioGroup
      value={discountType || 'None'}
      onChange={value => onChange?.(value === 'None' ? '' : `${value}`)}
      style={{ width: '100%' }}
    >
      <Stack>
        <StyledRadio height="3rem" colorScheme="primary" value="None">
          {formatMessage(checkoutMessages.form.radio.noDiscount)}
        </StyledRadio>
        {discountId || leftCoupons.length > 0 ? (
          <div className="d-flex align-items-center">
            <StyledRadio height="3rem" colorScheme="primary" value="Coupon">
              <span>{formatMessage(checkoutMessages.form.radio.useCoupon)}</span>
            </StyledRadio>
            {discountType === 'Coupon' && (
              <span className="ml-2">
                {currentMemberId ? (
                  <MultiPeriodCouponSelectionModal
                    memberId={currentMemberId}
                    orderProducts={check?.orderProducts || []}
                    orderDiscounts={check?.orderDiscounts || []}
                    currentlyUsedDiscountIds={currentlyUsedDiscountIds}
                    coupons={leftCoupons}
                    loadingCoupons={loadingCoupons}
                    refetchCoupons={refetchCoupons}
                    onSelect={coupon => {
                      onChange?.(`Coupon_${coupon.id}`)
                    }}
                    renderTrigger={({ onOpen, selectedCoupon }) => (
                      <>
                        <Button variant="outline" onClick={onOpen}>
                          {discountTarget
                            ? formatMessage(commonMessages.button.reselectCoupon)
                            : formatMessage(commonMessages.button.chooseCoupon)}
                        </Button>
                        {selectedCoupon && (
                          <span className="ml-3">
                            {selectedCoupon.couponCode.couponPlan.title} {selectedCoupon.couponCode.code}
                          </span>
                        )}
                      </>
                    )}
                  />
                ) : (
                  <Button onClick={() => setAuthModalVisible && setAuthModalVisible(true)}>
                    {formatMessage(commonMessages.button.chooseCoupon)}
                  </Button>
                )}
              </span>
            )}
          </div>
        ) : (
          <></>
        )}
        {enrolledMembershipCardIds.length > 0 && (
          <StyledRadio height="3rem" value="Card" colorScheme="primary">
            <span>{formatMessage(checkoutMessages.content.useMemberCard)}</span>
            {discountType === 'Card' && (
              <span className="ml-2">
                {currentMemberId ? (
                  <MembershipCardSelectionModal
                    memberId={currentMemberId}
                    onSelect={membershipCardId => onChange?.(`Card_${membershipCardId}`)}
                    render={({ setVisible, selectedMembershipCard }: any) => (
                      <>
                        <Button variant="outline" onClick={() => setVisible(true)}>
                          {discountTarget
                            ? formatMessage(commonMessages.button.reselectCoupon)
                            : formatMessage(checkoutMessages.title.chooseMemberCard)}
                        </Button>
                        {selectedMembershipCard && <span className="ml-3">{selectedMembershipCard.title}</span>}
                      </>
                    )}
                  />
                ) : null}
              </span>
            )}
          </StyledRadio>
        )}
      </Stack>
    </RadioGroup>
  )
}

export default DiscountSelectionCard
