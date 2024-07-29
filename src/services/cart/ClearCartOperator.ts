import { CartOperator } from './CartOperator'

export class ClearCartOperator extends CartOperator {
  async operation(currentMemberId: string) {
    localStorage.removeItem('kolable.cart._products')
    this.setCartProducts([])
    if (currentMemberId) {
      await this.updateCartProducts({ variables: { memberId: currentMemberId, cartProductObjects: [] } })
    }
  }
}
