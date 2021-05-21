import { Button, Radio } from 'antd'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { checkoutMessages, commonMessages } from '../../helpers/translation'
import { useEnrolledMembershipCardIds } from '../../hooks/card'
import { CheckProps } from '../../types/checkout'
import { useAuth } from '../auth/AuthContext'
import { AuthModalContext } from '../auth/AuthModal'
import CouponSelectionModal from './CouponSelectionModal'
import MembershipCardSelectionModal from './MembershipCardSelectionModal'

const StyledRadio = styled(Radio)`
  && {
    display: block;
    height: 3rem;
    line-height: 3rem;
  }
`

const DiscountSelectionCard: React.FC<{
  value?: string | null
  check?: CheckProps
  onChange?: (discountId: string) => void
}> = ({ value: discountId, check, onChange }) => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const { enrolledMembershipCardIds } = useEnrolledMembershipCardIds(currentMemberId || '')

  const [discountType, discountTarget] = discountId?.split('_') || [null, null]

  return (
    <Radio.Group
      style={{ width: '100%' }}
      value={discountType || 'None'}
      onChange={e => onChange && onChange(e.target.value)}
    >
      <StyledRadio value="None">{formatMessage(checkoutMessages.form.radio.noDiscount)}</StyledRadio>
      <StyledRadio value="Coupon">
        <span>{formatMessage(checkoutMessages.form.radio.useCoupon)}</span>
        {discountType === 'Coupon' && (
          <span className="ml-2">
            {currentMemberId ? (
              <CouponSelectionModal
                memberId={currentMemberId}
                orderProducts={check?.orderProducts || []}
                orderDiscounts={check?.orderDiscounts || []}
                onSelect={coupon => {
                  onChange?.(`Coupon_${coupon.id}`)
                }}
                render={({ onOpen, selectedCoupon }) => (
                  <>
                    <Button onClick={onOpen}>
                      {discountTarget
                        ? formatMessage(commonMessages.button.reselectCoupon)
                        : formatMessage(commonMessages.button.chooseCoupon)}
                    </Button>
                    {selectedCoupon && <span className="ml-3">{selectedCoupon.couponCode.couponPlan.title}</span>}
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
      </StyledRadio>

      {enrolledMembershipCardIds.length > 0 && (
        <StyledRadio value="Card">
          <span>{formatMessage(checkoutMessages.content.useMemberCard)}</span>
          {discountType === 'Card' && (
            <span className="ml-2">
              {currentMemberId ? (
                <MembershipCardSelectionModal
                  memberId={currentMemberId}
                  onSelect={membershipCardId => {
                    onChange?.(`Card_${membershipCardId}`)
                  }}
                  render={({ setVisible, selectedMembershipCard }: any) => (
                    <>
                      <Button onClick={() => setVisible(true)}>
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
    </Radio.Group>
  )
}

export default DiscountSelectionCard
