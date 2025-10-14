import { gql } from '@apollo/client'
import { any, differenceWith, eqBy, filter, isEmpty, map, prop, reject, startsWith } from 'ramda'
import { CartProductProps } from '../../types/checkout'
import { CartOperator } from './CartOperator'
import { CartOperatorEnum } from './CartOperatorEnum'

const DELETE_CART_PRODUCTS = gql`
  mutation DELETE_CART_PRODUCTS($memberId: String!, $productIds: [String!]!) {
    delete_cart_product(where: { member_id: { _eq: $memberId }, product_id: { _in: $productIds } }) {
      affected_rows
    }
  }
`

const GET_CART_PRODUCTS_FOR_CLEANUP = gql`
  query GET_CART_PRODUCTS_FOR_CLEANUP(
    $appId: String!
    $memberId: String!
    $productIds: [String!]!
    $merchandiseSpecIds: [uuid!]!
  ) {
    product(where: { id: { _in: $productIds } }) {
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

export class RemoveCartProductOperator extends CartOperator {
  operator = CartOperatorEnum.REMOVE_CART_PRODUCTS

  async operation(productIds: string[]) {
    const cachedCartProducts = this.getLocalCartProducts()

    const optimisticCartProducts = reject(cartProduct => productIds.includes(cartProduct.productId), cachedCartProducts)

    this._updateLocalStorage(optimisticCartProducts)
    this.setCartProducts(optimisticCartProducts)

    this._performBackgroundCleanup(productIds, optimisticCartProducts)
  }

  private async _performBackgroundCleanup(productIds: string[], optimisticCartProducts: CartProductProps[]) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, validationData] = await Promise.all([
        this._deleteFromBackend(productIds),
        this._fetchProductsForValidation(optimisticCartProducts),
      ])

      const cleanedCartProducts = this._cleanupInvalidProducts(optimisticCartProducts, validationData)

      const hasChanges = !eqBy(prop('productId') as any, optimisticCartProducts, cleanedCartProducts)

      if (hasChanges) {
        this._updateLocalStorage(cleanedCartProducts)
        this.setCartProducts(cleanedCartProducts)

        await this._syncCleanedProducts(cleanedCartProducts)
      }
    } catch (error) {
      console.error('Background cleanup failed:', error)
    }
  }

  private async _deleteFromBackend(productIds: string[]): Promise<void> {
    if (!this.isLoginStatus()) return

    await this.getApolloClient().mutate({
      mutation: DELETE_CART_PRODUCTS,
      variables: {
        memberId: this.getCurrentMemberId(),
        productIds,
      },
    })
  }

  private async _fetchProductsForValidation(cartProducts: CartProductProps[]): Promise<any | null> {
    if (!this.isLoginStatus() || isEmpty(cartProducts)) return null

    const productIds = map(prop('productId'), cartProducts)
    const merchandiseSpecIds = map(
      (productId: string) => productId.replace('MerchandiseSpec_', ''),
      filter(startsWith('MerchandiseSpec_'), productIds),
    )

    const { data } = await this.getApolloClient().query({
      query: GET_CART_PRODUCTS_FOR_CLEANUP,
      variables: {
        appId: this.getAppId(),
        memberId: this.getCurrentMemberId(),
        productIds,
        merchandiseSpecIds,
      },
      fetchPolicy: 'network-only',
    })

    return data
  }

  private _cleanupInvalidProducts(cartProducts: CartProductProps[], validationData: any | null): CartProductProps[] {
    if (!validationData) return cartProducts

    return filter(cartProduct => {
      if (startsWith('Program_', cartProduct.productId)) {
        return false
      }

      const product = validationData.product?.find((p: any) => p.id === cartProduct.productId)
      if (!product) return true

      const hasNonPhysicalEnrollment = any(
        (enrollment: any) => !enrollment.is_physical,
        product.product_enrollments || [],
      )

      return !hasNonPhysicalEnrollment
    }, cartProducts)
  }

  private async _syncCleanedProducts(cleanedProducts: CartProductProps[]): Promise<void> {
    if (!this.isLoginStatus()) return

    const allProductIds = map(prop('productId'), this.getLocalCartProducts())
    const cleanedProductIds = map(prop('productId'), cleanedProducts)

    const productsToDelete = differenceWith((a, b) => a === b, allProductIds, cleanedProductIds)

    if (!isEmpty(productsToDelete)) {
      await this.getApolloClient().mutate({
        mutation: DELETE_CART_PRODUCTS,
        variables: {
          memberId: this.getCurrentMemberId(),
          productIds: productsToDelete,
        },
      })
    }
  }

  private _updateLocalStorage(cartProducts: CartProductProps[]): void {
    localStorage.setItem('kolable.cart._products', JSON.stringify(cartProducts))
  }
}
