import { gql, useApolloClient, useMutation } from '@apollo/client'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { getConversionApiData } from 'lodestar-app-element/src/helpers/conversionApi'
import { ConversionApiContent, ConversionApiEvent } from 'lodestar-app-element/src/types/conversionApi'
import React, { useEffect, useMemo, useState } from 'react'
import hasura from '../hasura'
import { getTrackingCookie } from '../helpers'
import { useMember } from '../hooks/member'
import { CartOperatorEnum } from '../services/cart/CartOperatorEnum'
import { CreateCartOperationContextFactory } from '../services/cart/CreateCartOperationContextFactory'
import { CartProductProps } from '../types/checkout'
import { ProductType } from '../types/product'

const CartContext = React.createContext<{
  cartProducts: CartProductProps[]
  isProductInCart?: (productType: ProductType, productTarget: string) => boolean
  getCartProduct?: (productId: string) => CartProductProps | null
  addCartProduct?: (
    productType: ProductType,
    productTarget: string,
    productOptions?: { [key: string]: any },
  ) => Promise<void>
  updatePluralCartProductQuantity?: (productId: string, quantity: number) => Promise<void>
  removeCartProducts?: (productIds: string[]) => Promise<void>
  clearCart?: () => Promise<void>
}>({
  cartProducts: [],
})

export const CartProvider: React.FC = ({ children }) => {
  const { id: appId, settings, enabledModules } = useApp()
  const apolloClient = useApolloClient()
  const { currentMemberId, authToken } = useAuth()
  const { member } = useMember(currentMemberId || '')
  const [updateCartProducts] = useMutation<hasura.UPDATE_CART_PRODUCTS, hasura.UPDATE_CART_PRODUCTSVariables>(
    UPDATE_CART_PRODUCTS,
  )

  const [cartProducts, setCartProducts] = useState<CartProductProps[]>([])

  const cartOperationFactory = useMemo(
    () =>
      new CreateCartOperationContextFactory(apolloClient, appId, currentMemberId, updateCartProducts, setCartProducts),
    [apolloClient, appId, currentMemberId, updateCartProducts],
  )

  useEffect(() => {
    const operator = cartOperationFactory.createOperator(CartOperatorEnum.INIT)
    operator.operation()
  }, [cartOperationFactory])

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        isProductInCart: (productType: ProductType, productTarget: string) =>
          cartProducts.some(cartProduct => cartProduct.productId === `${productType}_${productTarget}`),
        getCartProduct: (productId: string) => {
          const targetCartProduct = cartProducts.find(cartProduct => cartProduct.productId === productId)
          return targetCartProduct || null
        },
        addCartProduct: async (
          productType: ProductType,
          productTarget: string,
          productOptions?: { [key: string]: any },
        ) => {
          const trackingCookie = getTrackingCookie()
          const trackingOptions = { ...trackingCookie }
          const contents: ConversionApiContent[] = [{ id: `${productType}_${productTarget}`, quantity: 1 }]
          const event: ConversionApiEvent = {
            sourceUrl: window.location.href,
            purchaseData: {
              currency: 'TWD',
            },
          }
          const { conversionApi, conversionApiData } = getConversionApiData(member, { contents, event })
          if (
            settings['tracking.fb_conversion_api.pixel_id'] &&
            settings['tracking.fb_conversion_api.access_token'] &&
            enabledModules.fb_conversion_api
          ) {
            if (authToken) await conversionApi(authToken, 'AddToCart').catch(error => console.log(error))
            Object.assign(trackingOptions, { fb: conversionApiData })
          }
          const addCartOperator = cartOperationFactory.createOperator(CartOperatorEnum.ADD_CART_PRODUCT)
          await addCartOperator.operation(
            productType,
            productTarget,
            !!settings['feature.cart.disable'],
            trackingOptions,
            productOptions,
          )
        },
        updatePluralCartProductQuantity: async (productId: string, quantity: number) => {
          const operator = cartOperationFactory.createOperator(CartOperatorEnum.UPDATE_PLURAL_CART_PRODUCT_QUANTITY)
          await operator.operation(productId, quantity)
        },
        removeCartProducts: async (productIds: string[]) => {
          const operator = cartOperationFactory.createOperator(CartOperatorEnum.REMOVE_CART_PRODUCTS)
          await operator.operation(productIds)
        },
        clearCart: async () => {
          const operator = cartOperationFactory.createOperator(CartOperatorEnum.CLEAR_CART)
          await operator.operation(currentMemberId)
        },
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

const UPDATE_CART_PRODUCTS = gql`
  mutation UPDATE_CART_PRODUCTS($memberId: String!, $cartProductObjects: [cart_product_insert_input!]!) {
    delete_cart_product(where: { member_id: { _eq: $memberId } }) {
      affected_rows
    }
    insert_cart_product(objects: $cartProductObjects) {
      affected_rows
    }
  }
`

export default CartContext
