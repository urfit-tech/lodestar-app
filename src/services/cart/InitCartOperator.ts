import { CartOperator } from './CartOperator'
import { CartOperatorEnum } from './CartOperatorEnum'

export class InitCartOperator extends CartOperator {
  operator = CartOperatorEnum.INIT

  async operation() {
    this.syncCartProducts(this.operator)
  }
}
