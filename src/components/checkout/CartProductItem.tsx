import { Icon } from '@chakra-ui/icons'
import { Spinner } from '@chakra-ui/react'
import { Typography } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { useContext, useEffect, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled, { css } from 'styled-components'
import ProductTypeLabel from '../../components/common/ProductTypeLabel'
import CartContext from '../../contexts/CartContext'
import { desktopViewMixin } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { useSimpleProduct } from '../../hooks/common'
import EmptyCover from '../../images/empty-cover.png'
import { ReactComponent as ExclamationCircleIcon } from '../../images/exclamation-circle.svg'
import { ProductType } from '../../types/product'
import { CustomRatioImage } from '../common/Image'
import PriceLabel from '../common/PriceLabel'
import QuantityInput from '../common/QuantityInput'

const messages = defineMessages({
  remainStock: { id: 'product.text.remainStock', defaultMessage: '剩餘庫存' },
})

const StyledContentBlock = styled.div`
  ${desktopViewMixin(css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `)}
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
const StyledInventoryBlock = styled.span`
  font-size: 14px;
`

const CartProductItem: React.VFC<{
  id: string
  quantity: number
  buyableQuantity: number | null
}> = ({ id, quantity, buyableQuantity }) => {
  const { formatMessage } = useIntl()
  const { enabledModules } = useApp()
  const { updatePluralCartProductQuantity } = useContext(CartContext)
  const { target } = useSimpleProduct({ id })
  const [pluralProductQuantity, setPluralProductQuantity] = useState(quantity || 1)

  useEffect(() => {
    updatePluralCartProductQuantity?.(id, pluralProductQuantity)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, pluralProductQuantity])

  if (!target) {
    return <Spinner size="lg" />
  }

  const [productType] = id.split('_') as [ProductType]
  const { title, coverUrl, isOnSale, listPrice, salePrice, isLimited, isPhysical } = target

  return (
    <div className="flex-grow-1 d-flex align-items-center justify-content-start">
      <CustomRatioImage
        width="5rem"
        ratio={2 / 3}
        src={coverUrl || EmptyCover}
        shape="rounded"
        className="flex-shrink-0 mr-3"
        disabled={buyableQuantity === 0}
      />
      <StyledContentBlock className="flex-grow-1 mr-2">
        <Typography.Paragraph ellipsis={{ rows: 2 }} className="flex-grow-1 mb-0 mr-2">
          {title}
          {pluralProductQuantity > 0 && ` x${pluralProductQuantity}`}
        </Typography.Paragraph>

        {!!buyableQuantity && quantity > buyableQuantity && (
          <StyledInventoryBlock className="d-flex align-items-center mr-3">
            <Icon as={ExclamationCircleIcon} className="mr-2" />
            {`${formatMessage(messages.remainStock)} ${buyableQuantity}`}
          </StyledInventoryBlock>
        )}

        {((productType === 'ActivityTicket' && enabledModules.group_buying_ticket) ||
          (productType === 'ProjectPlan' && isLimited === true) ||
          (productType === 'MerchandiseSpec' && isPhysical === true)) &&
          !!buyableQuantity &&
          buyableQuantity > 0 && (
            <div className="d-flex flex-column flex-md-row align-items-left align-items-md-center mr-md-3">
              <QuantityInput
                value={pluralProductQuantity}
                min={1}
                max={buyableQuantity}
                onChange={value => setPluralProductQuantity(value || 1)}
              />
            </div>
          )}

        {productType === 'ProjectPlan' && isLimited === true && isPhysical === false && (
          <div className="mr-3">
            <QuantityInput
              value={pluralProductQuantity}
              min={1}
              onChange={value => setPluralProductQuantity(value || 1)}
            />
          </div>
        )}

        {((productType === 'ProjectPlan' && isLimited === true) || productType === 'MerchandiseSpec') &&
        buyableQuantity === 0 ? (
          <StyledInventoryBlock className="d-flex align-items-center">
            <Icon as={ExclamationCircleIcon} className="mr-2" />
            <span>{formatMessage(commonMessages.button.soldOut)}</span>
          </StyledInventoryBlock>
        ) : (
          <>
            <StyledMeta className="mr-2 d-none d-md-block">
              <ProductTypeLabel productType={productType} />
            </StyledMeta>
            <StyledMeta>
              {
                <PriceLabel
                  variant="inline"
                  listPrice={(listPrice || 0) * pluralProductQuantity}
                  salePrice={isOnSale ? (salePrice || 0) * pluralProductQuantity : undefined}
                />
              }
            </StyledMeta>
          </>
        )}
      </StyledContentBlock>
    </div>
  )
}

export default CartProductItem
