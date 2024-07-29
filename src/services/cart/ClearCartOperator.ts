import { CartOperator } from './CartOperator'
import { CartOperatorEnum } from './CartOperatorEnum'

export class ClearCartOperator extends CartOperator {
  operator = CartOperatorEnum.CLEAR_CART

  async operation(currentMemberId: string) {
    localStorage.removeItem('kolable.cart._products')
    this.setCartProducts([])
    if (currentMemberId) {
      await this.updateCartProducts({ variables: { memberId: currentMemberId, cartProductObjects: [] } })
    }
  }
}
