import { useProductGiftPlan } from 'lodestar-app-element/src/hooks/giftPlan'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { checkoutMessages } from '../../helpers/translation'
import EmptyCover from '../../images/empty-cover.png'
import { CustomRatioImage } from '../common/Image'

const GiftPlanBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding: 12px 20px;
  width: 100%;
  background-color: #f7f8f8;
  border-radius: 4px;
`

const GiftDescriptionBlock = styled.div`
  display: flex;
  align-items: center;
`

const GiftTag = styled.span`
  padding: 2px 6px;
  font-size: 12px;
  color: ${props => props.theme['@primary-color']};
  border: 1px solid ${props => props.theme['@primary-color']};
  border-radius: 4px;
`

const GiftName = styled.p`
  margin-left: 12px;
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`

const CartProductGiftPlan: React.VFC<{ productId: string; isTargetLoaded: boolean }> = ({
  productId,
  isTargetLoaded,
}) => {
  const { formatMessage } = useIntl()
  const { productGiftPlan } = useProductGiftPlan(productId)
  let isAvailable =
    (productGiftPlan.startedAt && Date.now() < new Date(productGiftPlan.startedAt).getTime()) ||
    (productGiftPlan.endedAt && Date.now() > new Date(productGiftPlan.endedAt).getTime())
      ? false
      : true

  return isTargetLoaded && productGiftPlan.productGiftPlanId && isAvailable ? (
    <GiftPlanBlock>
      <GiftDescriptionBlock>
        <GiftTag>{formatMessage(checkoutMessages.ui.gift)}</GiftTag>
        <GiftName>{productGiftPlan.gift.title}</GiftName>
      </GiftDescriptionBlock>
      <CustomRatioImage width="52px" ratio={1 / 1} src={productGiftPlan.gift.coverUrl || EmptyCover} />
    </GiftPlanBlock>
  ) : null
}

export default CartProductGiftPlan
