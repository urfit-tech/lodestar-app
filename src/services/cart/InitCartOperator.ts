import { CartOperator } from './CartOperator'
import { CartOperatorEnum } from './CartOperatorEnum'

export class InitCartOperator extends CartOperator {
  async operation() {
    this.syncCartProducts(CartOperatorEnum.INIT)
  }
}
