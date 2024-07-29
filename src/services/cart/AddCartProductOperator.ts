import { ProductType } from '../../types/product'
import { CartOperator } from './CartOperator'
import { CartOperatorEnum } from './CartOperatorEnum'

export class AddCartProductOperator extends CartOperator {
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
    this.syncCartProducts(CartOperatorEnum.ADD_CART_PRODUCT)
  }
}
