import { CartOperator } from './CartOperator'
import { CartOperatorEnum } from './CartOperatorEnum'

export class UpdatePluralCartProductQuantityOperator extends CartOperator {
  operator = CartOperatorEnum.UPDATE_PLURAL_CART_PRODUCT_QUANTITY

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
    this.syncCartProducts(this.operator)
  }
}
