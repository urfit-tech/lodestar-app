import { ApolloClient } from '@apollo/client'
import { CartProductProps } from '../../types/checkout'
import { AddCartProductOperator } from './AddCartProductOperator'
import { CartOperator } from './CartOperator'
import { CartOperatorEnum } from './CartOperatorEnum'
import { ClearCartOperator } from './ClearCartOperator'
import { InitCartOperator } from './InitCartOperator'
import { RemoveCartProductOperator } from './RemoveCartProductOperator'
import { UpdatePluralCartProductQuantityOperator } from './UpdatePluralCartProductQuantityOperator'

export class CreateCartOperationContextFactory {
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

  createOperator(operation: CartOperatorEnum): CartOperator {
    const operationMap: Record<CartOperatorEnum, new (...args: any[]) => CartOperator> = {
      [CartOperatorEnum.INIT]: InitCartOperator,
      [CartOperatorEnum.REMOVE_ITEM]: RemoveCartProductOperator,
      [CartOperatorEnum.ADD_CART_PRODUCT]: AddCartProductOperator,
      [CartOperatorEnum.UPDATE_PLURAL_CART_PRODUCT_QUANTITY]: UpdatePluralCartProductQuantityOperator,
      [CartOperatorEnum.REMOVE_CART_PRODUCTS]: RemoveCartProductOperator,
      [CartOperatorEnum.CLEAR_CART]: ClearCartOperator,
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
