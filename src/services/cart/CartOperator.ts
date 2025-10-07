import { ApolloClient, gql } from '@apollo/client'
import { uniqBy } from 'ramda'
import hasura from '../../hasura'
import { CartProductProps } from '../../types/checkout'
import { CartOperatorEnum } from './CartOperatorEnum'

type updateCartProductVariables = {
  variables: {
    memberId: string
    cartProductObjects: {
      app_id: string
      member_id: string | null
      product_id: string
      options: { tracking: any }
    }[]
  }
}

export abstract class CartOperator {
  private apolloClient: ApolloClient<any>
  private appId: string
  private currentMemberId: string | null
  protected updateCartProducts: (variables: updateCartProductVariables) => Promise<any>
  protected setCartProducts: React.Dispatch<React.SetStateAction<CartProductProps[]>>
  protected operator: CartOperatorEnum | undefined

  constructor(
    apolloClient: ApolloClient<any>,
    appId: string,
    currentMemberId: string | null,
    updateCartProducts: (variables: updateCartProductVariables) => Promise<any>,
    setCartProducts: React.Dispatch<React.SetStateAction<CartProductProps[]>>,
  ) {
    this.apolloClient = apolloClient
    this.appId = appId
    this.currentMemberId = currentMemberId
    this.updateCartProducts = updateCartProducts
    this.setCartProducts = setCartProducts
  }

  abstract operation(...args: any[]): Promise<void>

  protected getApolloClient(): ApolloClient<any> {
    return this.apolloClient
  }

  protected getAppId(): string {
    return this.appId
  }

  protected getCurrentMemberId(): string | null {
    return this.currentMemberId
  }

  protected isLoginStatus(): boolean {
    return !!this.currentMemberId
  }

  public async syncCartProducts(operation: CartOperatorEnum) {
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

    try {
      if (this.isLoginStatus()) {
        await this.updateCartProducts({
          variables: {
            memberId: this.currentMemberId || '',
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
      }

      this.setCartProducts(availableProducts)
    } catch (error) {
      console.error(error)
    }
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

  private _createGetCartProductOperationQuery(operation: CartOperatorEnum) {
    const productIdsCondition =
      operation === CartOperatorEnum.REMOVE_CART_PRODUCTS
        ? `product: { id: { _in: $productIds }, product_owner: { member: { app_id: { _eq: $appId } } } }`
        : ''

    return gql`
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

  private async _fetchRemoteCartProducts(operation: CartOperatorEnum, cachedCartProducts: CartProductProps[]) {
    const query = this._createGetCartProductOperationQuery(operation)

    if (this.appId && this.currentMemberId) {
      const { data } = await this.apolloClient.query({
        query,
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
        ...(remoteCartProducts?.cart_product?.map(cartProduct => ({
          productId: cartProduct.product.id,
          shopId: cartProduct.product.id.startsWith('MerchandiseSpec_')
            ? remoteCartProducts?.merchandise_spec?.find(
                v => v.id === cartProduct.product.id.replace('MerchandiseSpec_', ''),
              )?.merchandise.member_shop_id || ''
            : '',
          enrollments:
            cartProduct.product.product_enrollments?.map(enrollment => ({
              memberId: enrollment.member_id || null,
              isPhysical: enrollment.is_physical || false,
            })) || [],
          options: cartProductOptions?.[cartProduct.product.id],
        })) || []),
        ...(cachedCartProducts?.map(cartProduct => ({
          ...cartProduct,
          shopId: cartProduct.productId.startsWith('MerchandiseSpec_')
            ? remoteCartProducts?.merchandise_spec?.find(
                v => v.id === cartProduct.productId.replace('MerchandiseSpec_', ''),
              )?.merchandise.member_shop_id || ''
            : '',
          enrollments:
            remoteCartProducts?.product
              ?.find(product => product.id === cartProduct.productId)
              ?.product_enrollments?.map(enrollment => ({
                memberId: enrollment.member_id || null,
                isPhysical: enrollment.is_physical || false,
              })) || [],
        })) || []),
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
