import { Button } from '@chakra-ui/react'
import { CardProps } from 'antd/lib/card'
import { camelCase } from 'lodash'
import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAppTheme } from 'lodestar-app-element/src/contexts/AppThemeContext'
import * as R from 'ramda'
import { addIndex, assoc, map, pipe } from 'ramda'
import React from 'react'
import { useIntl } from 'react-intl'
import { checkoutMessages } from '../../helpers/translation'
import {
  CartProductProps,
  InvoiceProps,
  OrderDiscountProps,
  OrderProductProps,
  ShippingOptionIdType,
  ShippingOptionProps,
  ShippingProps,
} from '../../types/checkout'
import AdminCard from '../common/AdminCard'
import CheckoutCardDetailCard from './CheckoutCardDetailCard'

const CheckoutCard: React.VFC<
  CardProps & {
    isDisabled: boolean
    discountId: string | null
    check: {
      orderProducts: OrderProductProps[]
      orderDiscounts: OrderDiscountProps[]
      payments?: Array<{ itemName: string; itemAmt: number; itemCount: number }>
      shippingOption: ShippingOptionProps | null
    }
    cartProducts: CartProductProps[]
    invoice: InvoiceProps
    shipping: ShippingProps | null
    onCheckout?: () => void
  }
> = ({ isDisabled, discountId, check, cartProducts, invoice, shipping, loading, onCheckout, ...cardProps }) => {
  const { formatMessage } = useIntl()
  const theme = useAppTheme()
  const { currencyId: appCurrencyId } = useApp()
  const calculateOriginalTotal = R.pipe(R.map(R.prop('price')), R.sum) as (products: OrderProductProps[]) => number

  const applyDiscountToProduct = R.curry(
    (orderDiscounts: OrderDiscountProps[], orderProducts: OrderProductProps[], checkoutAmount: number): number => {
      return orderProducts.reduce((acc: number, orderProduct: OrderProductProps) => {
        const discount = orderDiscounts.find(orderDiscount => orderDiscount.productId === orderProduct.productId)
        const effectiveDiscount =
          (discount?.price || 0) > orderProduct.price ? orderProduct.price : discount?.price || 0

        return Math.max(0, acc - effectiveDiscount)
      }, checkoutAmount)
    },
  )

  const applyNonProductSpecificDiscounts = R.curry(
    (orderDiscounts: OrderDiscountProps[], checkoutAmount: number): number => {
      const nonProductSpecificDiscounts = orderDiscounts.filter(orderDiscount => !orderDiscount.productId)
      return nonProductSpecificDiscounts.reduce((acc: number, orderDiscount: OrderDiscountProps) => {
        return Math.max(0, acc - orderDiscount.price)
      }, checkoutAmount)
    },
  )

  return (
    <AdminCard {...cardProps}>
      {addIndex(map)((detail, idx: number) => (pipe as any)(assoc('key', String(idx)), CheckoutCardDetailCard)(detail))(
        check.payments
          ? check.payments.map(payment => ({
              name: payment.itemName,
              price: payment.itemAmt,
              quantity: payment.itemCount,
            }))
          : check.orderProducts.map(orderProduct => ({
              name: orderProduct.name,
              price: orderProduct.price,
              quantity: orderProduct?.options?.quantity,
            })),
      )}

      {check.orderProducts.map((orderProduct, index) => {
        return orderProduct.options?.productGiftPlan?.giftPlan?.gifts?.map(v => {
          return (
            <div key={index} className="row mb-2">
              <div className="col-6 offset-md-4 col-md-4">{`${formatMessage(checkoutMessages.content.gift)} ${
                v.title
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
              listPrice={((): number => {
                type PipeFunction = (x: number) => number

                const total = R.pipe(
                  calculateOriginalTotal,
                  applyDiscountToProduct(check.orderDiscounts, check.orderProducts) as PipeFunction,
                  applyNonProductSpecificDiscounts(check.orderDiscounts) as PipeFunction,
                )(check.orderProducts)

                return total
              })()}
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
