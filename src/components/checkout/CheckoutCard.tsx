import { Button } from '@chakra-ui/react'
import { CardProps } from 'antd/lib/card'
import { camelCase } from 'lodash'
import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAppTheme } from 'lodestar-app-element/src/contexts/AppThemeContext'
import { prop, sum } from 'ramda'
import React from 'react'
import { useIntl } from 'react-intl'
import { checkoutMessages } from '../../helpers/translation'
import { CartProductProps, CheckProps, InvoiceProps, ShippingOptionIdType, ShippingProps } from '../../types/checkout'
import AdminCard from '../common/AdminCard'

const CheckoutCard: React.VFC<
  CardProps & {
    isDisabled: boolean
    discountId: string | null
    check: CheckProps
    cartProducts: CartProductProps[]
    invoice: InvoiceProps
    shipping: ShippingProps | null
    onCheckout?: () => void
  }
> = ({ isDisabled, discountId, check, cartProducts, invoice, shipping, loading, onCheckout, ...cardProps }) => {
  const { formatMessage } = useIntl()
  const theme = useAppTheme()
  const { currencyId: appCurrencyId } = useApp()

  return (
    <AdminCard {...cardProps}>
      {check.orderProducts.map((orderProduct, index) => (
        <div key={index} className="row mb-2">
          <div className="col-6 offset-md-4 col-md-4">
            {orderProduct.name} x{orderProduct?.options?.quantity || 1}
          </div>
          <div className="col-6 col-md-4 text-right">
            <PriceLabel
              listPrice={
                orderProduct.options?.currencyId ? orderProduct.options?.currencyPrice || 0 : orderProduct.price
              }
              currencyId={orderProduct.options?.currencyId || appCurrencyId}
            />
          </div>
        </div>
      ))}

      {check.orderProducts.map((orderProduct, index) => {
        return orderProduct.options?.giftPlans?.map(v => {
          return (
            <div key={index} className="row mb-2">
              <div className="col-6 offset-md-4 col-md-4">{`${formatMessage(checkoutMessages.content.gift)} ${
                v.giftPlan.gift.title
              }`}</div>
            </div>
          )
        })
      })}

      {check?.orderDiscounts?.map((orderDiscount, index) => (
        <div key={index} className="row mb-2">
          <div className="col-6 offset-md-4 col-md-4">{orderDiscount.name}</div>
          <div className="col-6 col-md-4 text-right">
            <PriceLabel listPrice={-orderDiscount.price} currencyId={appCurrencyId} />
          </div>
        </div>
      ))}

      {check?.shippingOption && (
        <div className="row mb-2">
          <div className="col-10 offset-md-4 col-md-6">
            {formatMessage(checkoutMessages.shipping[camelCase(check.shippingOption.id) as ShippingOptionIdType])}
          </div>
          <div className="col-2 col-md-2 text-right">
            {/* TODO unchecked 尚未驗證UI */}
            <PriceLabel listPrice={check.shippingOption.fee} currencyId={appCurrencyId} />
          </div>
        </div>
      )}

      {check?.orderProducts && check?.orderDiscounts && (
        <div className="row mb-3 mt-5">
          <div
            className="col-12 offset-md-8 col-md-4 text-right"
            style={{
              fontSize: '24px',
              color: theme.colors.primary[500],
            }}
          >
            <span className="mr-2">{formatMessage(checkoutMessages.content.total)}</span>
            <PriceLabel
              listPrice={
                sum(check.orderProducts.map(prop('price'))) -
                sum(check.orderDiscounts.map(prop('price'))) +
                (check.shippingOption?.fee || 0)
              }
            />
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-12 offset-md-8 col-md-4 offset-lg-10 col-lg-2">
          <Button
            colorScheme="primary"
            isFullWidth
            isDisabled={check.orderProducts.length === 0 || isDisabled}
            isLoading={loading}
            onClick={() => onCheckout?.()}
          >
            {formatMessage(checkoutMessages.button.cartSubmit)}
          </Button>
        </div>
      </div>
    </AdminCard>
  )
}

export default CheckoutCard
