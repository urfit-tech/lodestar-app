import { ApolloClient, gql, useApolloClient, useMutation } from '@apollo/client'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { getConversionApiData } from 'lodestar-app-element/src/helpers/conversionApi'
import { ConversionApiContent, ConversionApiEvent } from 'lodestar-app-element/src/types/conversionApi'
import { uniqBy } from 'ramda'
import React, { useEffect, useMemo, useState } from 'react'
import hasura from '../hasura'
import { getTrackingCookie } from '../helpers'
import { useMember } from '../hooks/member'
import { CartProductProps } from '../types/checkout'
import { ProductType } from '../types/product'

enum cartOperation {
  INIT,
  REMOVE_ITEM,
  ADD_CART_PRODUCT,
  UPDATE_PLURAL_CART_PRODUCT_QUANTITY,
  REMOVE_CART_PRODUCTS,
  CLEAR_CART,
}

abstract class CartOperator {
  private apolloClient: ApolloClient<any>
  private appId: string
  private currentMemberId: string | null
  protected updateCartProducts: (variables: any) => Promise<any>
  protected setCartProducts: React.Dispatch<React.SetStateAction<CartProductProps[]>>

  constructor(
    apolloClient: ApolloClient<any>,
    appId: string,
    currentMemberId: string | null,
    updateCartProducts: (variables: any) => Promise<any>,
    setCartProducts: React.Dispatch<React.SetStateAction<CartProductProps[]>>,
  ) {
    this.apolloClient = apolloClient
    this.appId = appId
    this.currentMemberId = currentMemberId
    this.updateCartProducts = updateCartProducts
    this.setCartProducts = setCartProducts
  }

  abstract operation(...args: any[]): Promise<void>

  public async syncCartProducts(operation: cartOperation) {
    const cachedCartProducts = this.getLocalCartProducts()
    const cartProductOptions = this._restructureCachedCartProducts(cachedCartProducts)

    const remoteCartProducts = await this._fetchRemoteCartProducts(operation, cachedCartProducts)
    const mergedCartProducts = this._mergeLocalAndRemoteCartProducts({
      remoteCartProducts,
      cachedCartProducts,
      cartProductOptions,
    })
    const availableProducts = this._removePhaseOutCartProducts(mergedCartProducts)

    this._updateLocalCache(availableProducts)

    if (!this.currentMemberId) {
      return
    }

    try {
      await this.updateCartProducts({
        variables: {
          memberId: this.currentMemberId,
          cartProductObjects: availableProducts.map(product => {
            const tracking = product?.options?.tracking || {}
            return {
              app_id: this.appId,
              member_id: this.currentMemberId,
              product_id: product.productId,
              options: { tracking },
            }
          }),
        },
      })

      this.setCartProducts(availableProducts)
    } catch (error) {}
  }

  public getLocalCartProducts(): CartProductProps[] {
    let cachedCartProducts: CartProductProps[]
    try {
      localStorage.removeItem('kolable.cart')
      localStorage.removeItem('kolable.cart.products')
      cachedCartProducts = JSON.parse(localStorage.getItem('kolable.cart._products') || '[]')
    } catch (error) {
      cachedCartProducts = []
    }
    return cachedCartProducts
  }

  private _restructureCachedCartProducts(cachedCartProducts: CartProductProps[]): { [ProductId: string]: any } {
    return cachedCartProducts.reduce((options, cartProduct) => {
      options[cartProduct.productId] = cartProduct.options
      return options
    }, {} as { [ProductId: string]: any })
  }

  private _createGetCartProductOperationQuery(operation: cartOperation): string {
    const productIdsCondition =
      operation === cartOperation.REMOVE_CART_PRODUCTS
        ? `product: { id: { _in: $productIds }, product_owner: { member: { app_id: { _eq: $appId } } } }`
        : ''

    return `
      query GET_CART_PRODUCT_COLLECTION(
        $appId: String!
        $memberId: String!
        $productIds: [String!]
        $localProductIds: [String!]!
        $merchandiseSpecIds: [uuid!]!
      ) {
        cart_product(
          where: {
            app_id: { _eq: $appId }
            member_id: { _eq: $memberId }
            ${productIdsCondition}
          }
        ) {
          id
          product {
            id
            type
            product_owner {
              member_id
            }
            product_enrollments(where: { member_id: { _eq: $memberId } }) {
              member_id
              is_physical
            }
          }
        }
        product(where: { id: { _in: $localProductIds } }) {
          id
          type
          product_enrollments(where: { member_id: { _eq: $memberId } }) {
            member_id
            is_physical
          }
        }
        merchandise_spec(where: { id: { _in: $merchandiseSpecIds } }) {
          id
          merchandise {
            id
            member_shop_id
          }
        }
      }
    `
  }

  private async _fetchRemoteCartProducts(operation: cartOperation, cachedCartProducts: any[]) {
    const query = this._createGetCartProductOperationQuery(operation)

    const { data } = await this.apolloClient.query({
      query: gql`
        ${query}
      `,
      variables: {
        appId: this.appId,
        memberId: this.currentMemberId || '',
        productIds: cachedCartProducts.map(cartProduct => cartProduct.productId),
        localProductIds: cachedCartProducts.map(cartProduct => cartProduct.productId),
        merchandiseSpecIds: cachedCartProducts
          .filter(cartProduct => cartProduct.productId.startsWith('MerchandiseSpec_'))
          .map(cartProduct => cartProduct.productId.replace('MerchandiseSpec_', '')),
      },
      fetchPolicy: 'no-cache',
    })

    return data
  }

  private _mergeLocalAndRemoteCartProducts({
    remoteCartProducts,
    cachedCartProducts,
    cartProductOptions,
  }: {
    remoteCartProducts: hasura.GET_CART_PRODUCT_COLLECTION
    cachedCartProducts: any[]
    cartProductOptions: { [ProductId: string]: any }
  }) {
    return uniqBy(
      cartProduct => cartProduct.productId,
      [
        ...remoteCartProducts.cart_product.map(cartProduct => ({
          productId: cartProduct.product.id,
          shopId: cartProduct.product.id.startsWith('MerchandiseSpec_')
            ? remoteCartProducts.merchandise_spec.find(
                v => v.id === cartProduct.product.id.replace('MerchandiseSpec_', ''),
              )?.merchandise.member_shop_id || ''
            : '',
          enrollments: cartProduct.product.product_enrollments.map(enrollment => ({
            memberId: enrollment.member_id || null,
            isPhysical: enrollment.is_physical || false,
          })),
          options: cartProductOptions[cartProduct.product.id],
        })),
        ...cachedCartProducts.map(cartProduct => ({
          ...cartProduct,
          shopId: cartProduct.productId.startsWith('MerchandiseSpec_')
            ? remoteCartProducts.merchandise_spec.find(
                v => v.id === cartProduct.productId.replace('MerchandiseSpec_', ''),
              )?.merchandise.member_shop_id || ''
            : '',
          enrollments: remoteCartProducts.product
            .find(product => product.id === cartProduct.productId)
            ?.product_enrollments.map(enrollment => ({
              memberId: enrollment.member_id || null,
              isPhysical: enrollment.is_physical || false,
            })),
        })),
      ],
    )
  }

  private _removePhaseOutCartProducts(cartProducts: CartProductProps[]): CartProductProps[] {
    return cartProducts
      .filter(cartProduct => !this._isPhasedOutProduct(cartProduct))
      .filter(cartProduct => this._hasValidEnrollments(cartProduct))
  }

  private _isPhasedOutProduct(cartProduct: CartProductProps): boolean {
    return cartProduct.productId.startsWith('Program_')
  }

  private _hasValidEnrollments(cartProduct: CartProductProps): boolean {
    return cartProduct.enrollments
      ? cartProduct.enrollments.length === 0 || cartProduct.enrollments.some(enrollment => enrollment.isPhysical)
      : false
  }

  private _updateLocalCache(filteredProducts: CartProductProps[]) {
    localStorage.setItem('kolable.cart._products', JSON.stringify(filteredProducts))
  }
}

class AddCartProductOperator extends CartOperator {
  async operation(
    productType: ProductType,
    productTarget: string,
    cartDisableSetting: boolean,
    trackingOptions: {},
    productOptions?: { [key: string]: any },
  ) {
    const cachedCartProducts = this.getLocalCartProducts()
    const repeatedCartProduct = cachedCartProducts.find(
      cartProduct => cartProduct.productId === `${productType}_${productTarget}`,
    )
    const newCartProducts = Number(cartDisableSetting)
      ? []
      : cachedCartProducts.filter(cartProduct => cartProduct.productId !== `${productType}_${productTarget}`)
    const newCartProduct = {
      productId: `${productType}_${productTarget}`,
      shopId: '',
      options:
        productType === 'MerchandiseSpec'
          ? {
              quantity: (productOptions?.quantity || 1) + (repeatedCartProduct?.options?.quantity || 0),
              tracking: trackingOptions,
            }
          : { ...productOptions, tracking: trackingOptions },
    }
    newCartProducts.push(newCartProduct)
    localStorage.setItem('kolable.cart._products', JSON.stringify(newCartProducts))
    this.syncCartProducts(cartOperation.ADD_CART_PRODUCT)
  }
}

class UpdatePluralCartProductQuantityOperator extends CartOperator {
  async operation(productId: string, quantity: number) {
    const cachedCartProducts = this.getLocalCartProducts()
    const newCartProducts = cachedCartProducts.map(cartProduct =>
      cartProduct.productId === productId
        ? {
            ...cartProduct,
            options: {
              ...cartProduct.options,
              quantity,
            },
          }
        : cartProduct,
    )

    localStorage.setItem('kolable.cart._products', JSON.stringify(newCartProducts))
    this.syncCartProducts(cartOperation.UPDATE_PLURAL_CART_PRODUCT_QUANTITY)
  }
}

class RemoveCartProductOperator extends CartOperator {
  async operation(productIds: string[]) {
    const cachedCartProducts = this.getLocalCartProducts()
    const newCartProduct = cachedCartProducts.filter(cartProduct => !productIds.includes(cartProduct.productId))
    localStorage.setItem('kolable.cart._products', JSON.stringify(newCartProduct))
    this.syncCartProducts(cartOperation.REMOVE_CART_PRODUCTS)
  }
}

class InitCartOperator extends CartOperator {
  async operation() {
    this.syncCartProducts(cartOperation.INIT)
  }
}

class ClearCartOperator extends CartOperator {
  async operation(currentMemberId: string) {
    localStorage.removeItem('kolable.cart._products')
    this.setCartProducts([])
    if (currentMemberId) {
      await this.updateCartProducts({ variables: { memberId: currentMemberId, cartProductObjects: [] } })
    }
  }
}

class CreateCartOperationContextFactory {
  private apolloClient: ApolloClient<any>
  private appId: string
  private currentMemberId: string | null
  protected updateCartProducts: (variables: any) => Promise<any>
  protected setCartProducts: React.Dispatch<React.SetStateAction<CartProductProps[]>>

  constructor(
    apolloClient: ApolloClient<any>,
    appId: string,
    currentMemberId: string | null,
    updateCartProducts: (variables: any) => Promise<any>,
    setCartProducts: React.Dispatch<React.SetStateAction<CartProductProps[]>>,
  ) {
    this.apolloClient = apolloClient
    this.appId = appId
    this.currentMemberId = currentMemberId
    this.updateCartProducts = updateCartProducts
    this.setCartProducts = setCartProducts
  }

  createOperator(operation: cartOperation): CartOperator {
    const operationMap: Record<cartOperation, new (...args: any[]) => CartOperator> = {
      [cartOperation.INIT]: InitCartOperator,
      [cartOperation.REMOVE_ITEM]: RemoveCartProductOperator,
      [cartOperation.ADD_CART_PRODUCT]: AddCartProductOperator,
      [cartOperation.UPDATE_PLURAL_CART_PRODUCT_QUANTITY]: UpdatePluralCartProductQuantityOperator,
      [cartOperation.REMOVE_CART_PRODUCTS]: RemoveCartProductOperator,
      [cartOperation.CLEAR_CART]: ClearCartOperator,
    }

    const OperatorClass = operationMap[operation]
    if (!OperatorClass) {
      throw new Error(`Unsupported cart operation: ${operation}`)
    }

    return new OperatorClass(
      this.apolloClient,
      this.appId,
      this.currentMemberId,
      this.updateCartProducts,
      this.setCartProducts,
    )
  }
}

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
    const operator = cartOperationFactory.createOperator(cartOperation.INIT)
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
          const addCartOperator = cartOperationFactory.createOperator(cartOperation.ADD_CART_PRODUCT)
          await addCartOperator.operation(
            productType,
            productTarget,
            !!settings['feature.cart.disable'],
            trackingOptions,
            productOptions,
          )
        },
        updatePluralCartProductQuantity: async (productId: string, quantity: number) => {
          const operator = cartOperationFactory.createOperator(cartOperation.UPDATE_PLURAL_CART_PRODUCT_QUANTITY)
          await operator.operation(productId, quantity)
        },
        removeCartProducts: async (productIds: string[]) => {
          const operator = cartOperationFactory.createOperator(cartOperation.REMOVE_CART_PRODUCTS)
          await operator.operation(productIds)
        },
        clearCart: async () => {
          const operator = cartOperationFactory.createOperator(cartOperation.CLEAR_CART)
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
