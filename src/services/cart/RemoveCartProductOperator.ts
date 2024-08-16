import { CartOperator } from './CartOperator'
import { CartOperatorEnum } from './CartOperatorEnum'

export class RemoveCartProductOperator extends CartOperator {
  operator = CartOperatorEnum.REMOVE_CART_PRODUCTS

  async operation(productIds: string[]) {
    const cachedCartProducts = this.getLocalCartProducts()
    const newCartProduct = cachedCartProducts.filter(cartProduct => !productIds.includes(cartProduct.productId))
    localStorage.setItem('kolable.cart._products', JSON.stringify(newCartProduct))
    this.syncCartProducts(this.operator)
  }
}
