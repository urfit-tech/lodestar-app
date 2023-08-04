import { gql, useApolloClient, useMutation } from '@apollo/client'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { uniqBy } from 'ramda'
import React, { useCallback, useEffect, useState } from 'react'
import hasura from '../hasura'
import { CartProductProps } from '../types/checkout'
import { ProductType } from '../types/product'
import Cookies from 'js-cookie'
import { isEmpty } from 'lodash'

const CartContext = React.createContext<{
  cartProducts: CartProductProps[]
  isProductInCart?: (productType: ProductType, productTarget: string) => boolean
  getCartProduct?: (productId: string) => CartProductProps | null
  addCartProduct?: (
    productType: ProductType,
    productTarget: string,
    productOptions?: { [key: string]: any },
  ) => Promise<void>
  updatePluralCartProductQuantity?: (productId: string, quantity: number) => Promise<void>
  removeCartProducts?: (productIds: string[]) => Promise<void>
  clearCart?: () => Promise<void>
}>({
  cartProducts: [],
})

export const CartProvider: React.FC = ({ children }) => {
  const { id: appId, settings } = useApp()
  const apolloClient = useApolloClient()
  const { currentMemberId } = useAuth()
  const [updateCartProducts] = useMutation<hasura.UPDATE_CART_PRODUCTS, hasura.UPDATE_CART_PRODUCTSVariables>(
    UPDATE_CART_PRODUCTS,
  )

  const [cartProducts, setCartProducts] = useState<CartProductProps[]>([])

  const getLocalCartProducts = () => {
    let cachedCartProducts: CartProductProps[]
    try {
      // remove deprecated localStorage key
      localStorage.removeItem('kolable.cart')
      localStorage.removeItem('kolable.cart.products')
      cachedCartProducts = JSON.parse(localStorage.getItem('kolable.cart._products') || '[]')
    } catch (error) {
      cachedCartProducts = []
    }
    return cachedCartProducts
  }

  const getUtmAndDmpId = () => {
    let dmpId = null
    let utm = null
    try {
      utm = JSON.parse(Cookies.get('utm'))
      dmpId = JSON.parse(Cookies.get('__eruid'))
    } catch (error) {
      console.log('getUtmAndDmpId:' + error)
    }
    return { dmpId, utm }
  }

  // sync cart products: save to localStorage & update to remote
  const syncCartProducts = useCallback(
    (isInit?: boolean) => {
      const cachedCartProducts = getLocalCartProducts()
      const cartProductOptions: { [ProductId: string]: any } = {}
      cachedCartProducts.forEach(cartProduct => {
        cartProductOptions[cartProduct.productId] = cartProduct.options
      })

      apolloClient
        .query<hasura.GET_CART_PRODUCT_COLLECTION, hasura.GET_CART_PRODUCT_COLLECTIONVariables>({
          query: GET_CART_PRODUCT_COLLECTION,
          variables: {
            appId,
            memberId: currentMemberId || '',
            productIds: isInit ? [] : cachedCartProducts.map(cartProduct => cartProduct.productId),
            localProductIds: cachedCartProducts.map(cartProduct => cartProduct.productId),
            merchandiseSpecIds: cachedCartProducts
              .filter(cartProduct => cartProduct.productId.startsWith('MerchandiseSpec_'))
              .map(cartProduct => cartProduct.productId.replace('MerchandiseSpec_', '')),
          },
          fetchPolicy: 'no-cache',
        })
        .then(({ data }) => {
          const cartProducts: CartProductProps[] = uniqBy(
            cartProduct => cartProduct.productId,
            [
              // remote cart product
              ...data.cart_product.map(cartProduct => ({
                productId: cartProduct.product.id,
                shopId: cartProduct.product.id.startsWith('MerchandiseSpec_')
                  ? data.merchandise_spec.find(v => v.id === cartProduct.product.id.replace('MerchandiseSpec_', ''))
                      ?.merchandise.member_shop_id || ''
                  : '',
                enrollments: cartProduct.product.product_enrollments.map(enrollment => ({
                  memberId: enrollment.member_id || null,
                  isPhysical: enrollment.is_physical || false,
                })),
                options: cartProductOptions[cartProduct.product.id],
              })),
              // local cart product
              ...cachedCartProducts.map(cartProduct => ({
                ...cartProduct,

                shopId: cartProduct.productId.startsWith('MerchandiseSpec_')
                  ? data.merchandise_spec.find(v => v.id === cartProduct.productId.replace('MerchandiseSpec_', ''))
                      ?.merchandise.member_shop_id || ''
                  : '',
                enrollments: data.product
                  .find(product => product.id === cartProduct.productId)
                  ?.product_enrollments.map(enrollment => ({
                    memberId: enrollment.member_id || null,
                    isPhysical: enrollment.is_physical || false,
                  })),
              })),
            ],
          )

          const filteredProducts = cartProducts.filter(
            cartProduct =>
              cartProduct.productId.startsWith('Program_') === false &&
              (cartProduct.enrollments
                ? cartProduct.enrollments.length === 0 ||
                  cartProduct.enrollments.map(enrollment => enrollment.isPhysical).includes(true)
                : false),
          )

          localStorage.setItem('kolable.cart._products', JSON.stringify(filteredProducts))
          setCartProducts(filteredProducts)

          if (!currentMemberId) {
            return
          }

          updateCartProducts({
            variables: {
              memberId: currentMemberId,
              cartProductObjects: filteredProducts.map(product => {
                const dmpId = product?.options?.dmpId || ''
                const utm = product?.options?.utm
                const options = {}
                if (utm) Object.assign(options, { utm })
                if (dmpId) Object.assign(options, { dmpId })
                return {
                  app_id: appId,
                  member_id: currentMemberId,
                  product_id: product.productId,
                  options: !isEmpty(options) ? options : null,
                }
              }),
            },
          }).catch(() => {})
        })
        .catch(() => {})
    },
    [apolloClient, appId, currentMemberId, updateCartProducts],
  )

  // init state
  useEffect(() => {
    syncCartProducts(true)
  }, [syncCartProducts])

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        isProductInCart: (productType: ProductType, productTarget: string) =>
          cartProducts.some(cartProduct => cartProduct.productId === `${productType}_${productTarget}`),
        getCartProduct: (productId: string) => {
          const targetCartProduct = cartProducts.find(cartProduct => cartProduct.productId === productId)
          return targetCartProduct || null
        },
        addCartProduct: async (
          productType: ProductType,
          productTarget: string,
          productOptions?: { [key: string]: any },
        ) => {
          const { utm, dmpId } = getUtmAndDmpId()
          const cachedCartProducts = getLocalCartProducts()
          const repeatedCartProduct = cachedCartProducts.find(
            cartProduct => cartProduct.productId === `${productType}_${productTarget}`,
          )
          const newCartProducts = Number(settings['feature.cart.disable'])
            ? []
            : cachedCartProducts.filter(cartProduct => cartProduct.productId !== `${productType}_${productTarget}`)

          newCartProducts.push({
            productId: `${productType}_${productTarget}`,
            shopId: '',
            options:
              productType === 'MerchandiseSpec'
                ? {
                    quantity: (productOptions?.quantity || 1) + (repeatedCartProduct?.options?.quantity || 0),
                  }
                : { ...productOptions, utm, dmpId },
          })

          localStorage.setItem('kolable.cart._products', JSON.stringify(newCartProducts))
          syncCartProducts()
        },
        updatePluralCartProductQuantity: async (productId: string, quantity: number) => {
          const cachedCartProducts = getLocalCartProducts()
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
          syncCartProducts()
        },
        removeCartProducts: async (productIds: string[]) => {
          const cachedCartProducts = getLocalCartProducts()
          const newCartProduct = cachedCartProducts.filter(cartProduct => !productIds.includes(cartProduct.productId))
          localStorage.setItem('kolable.cart._products', JSON.stringify(newCartProduct))
          syncCartProducts()
        },
        clearCart: async () => {
          localStorage.removeItem('kolable.cart._products')
          setCartProducts([])
          currentMemberId && updateCartProducts({ variables: { memberId: currentMemberId, cartProductObjects: [] } })
        },
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

const GET_CART_PRODUCT_COLLECTION = gql`
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
        product: { id: { _in: $productIds }, product_owner: { member: { app_id: { _eq: $appId } } } }
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
const UPDATE_CART_PRODUCTS = gql`
  mutation UPDATE_CART_PRODUCTS($memberId: String!, $cartProductObjects: [cart_product_insert_input!]!) {
    delete_cart_product(where: { member_id: { _eq: $memberId } }) {
      affected_rows
    }
    insert_cart_product(objects: $cartProductObjects) {
      affected_rows
    }
  }
`

export default CartContext
