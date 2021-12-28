import { SkeletonText } from '@chakra-ui/react'
import { Icon, Typography } from 'antd'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { groupBy } from 'ramda'
import React, { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { StringParam, useQueryParam } from 'use-query-params'
import CartProductTableCard from '../components/checkout/CartProductTableCard'
import CheckoutBlock from '../components/checkout/CheckoutBlock'
import DefaultLayout from '../components/layout/DefaultLayout'
import CartContext from '../contexts/CartContext'
import { getCookie, notEmpty } from '../helpers'
import { checkoutMessages } from '../helpers/translation'
import { useSimpleProductCollection } from '../hooks/common'
import { useMember } from '../hooks/member'

const CartPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const [shopId] = useQueryParam('shopId', StringParam)
  const { cartProducts } = useContext(CartContext)
  const { isAuthenticating, currentMemberId, currentMember } = useAuth()
  const { loadingMember, member } = useMember(currentMemberId || '')
  const getSimpleProductCollection = useSimpleProductCollection()
  const cartProductGroups = groupBy(cartProduct => cartProduct.shopId || '', cartProducts)
  const shopIds = Object.keys(cartProductGroups)
  // "Scroll To Top" every cart router change if not top
  useEffect(() => {
    // DefaultLayout component ID : layout-content
    const layoutContent = document.getElementById('layout-content')
    if (layoutContent?.scrollTop !== 0) {
      layoutContent?.scrollTo(0, 0)
    }
  }, [shopId])

  useEffect(() => {
    if (cartProducts.length > 0) {
      const cartProductIds = cartProducts.map(product => product.productId)
      getSimpleProductCollection(cartProductIds).then(products => {
        const productList = cartProducts
          .map(cartProduct => {
            const currentProduct = products.find(
              product => `${product.productType}_${product.id}` === cartProduct.productId,
            )

            if (currentProduct === undefined) return undefined

            return {
              id: currentProduct.id,
              item: currentProduct.sku || currentProduct.id,
              title: currentProduct.title,
              // TODO: base on product type to get url
              url: `${window.location.origin}/programs/${currentProduct.id}`,
              type: 'elearning',
              price: currentProduct.salePrice || currentProduct.listPrice,
              author:
                currentProduct?.authors
                  ?.filter(author => author.role === 'instructor')
                  .map(author => ({ id: author.id, name: author.name })) || [],
              channels: {
                master: {
                  id: currentProduct?.categories || [],
                },
              },
            }
          })
          .filter(notEmpty)

        // salesforce
        if (productList.length > 0) {
          ;(window as any).dataLayer = (window as any).dataLayer || []
          ;(window as any).dataLayer.push({
            event: 'sfData',
            memberData: {
              user_id: currentMemberId || '',
              social_id: currentMemberId || '',
              env: process.env.NODE_ENV === 'production' ? 'prod' : 'develop',
              email: currentMember?.email || '',
              dmp_id: getCookie('__eruid') || '',
            },
            itemData: {
              products: productList,
            },
          })
        }
      })
    }
  }, [currentMemberId])

  if (isAuthenticating || loadingMember) {
    return (
      <DefaultLayout>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout>
      {/* group cart products by product owner */}
      {shopIds.length > 1 && typeof shopId === 'undefined' && (
        <div className="container py-5">
          <Typography.Title level={3} className="mb-4">
            <Icon type="shopping-cart" className="mr-2" />
            <span>{formatMessage(checkoutMessages.title.chooseCart)}</span>
          </Typography.Title>

          {shopIds.map(shopId => (
            <CartProductTableCard
              key={shopId}
              className="mb-3"
              shopId={shopId}
              cartProducts={cartProductGroups[shopId]}
              withCartLink
            />
          ))}
        </div>
      )}

      {typeof shopId === 'string' && (
        <CheckoutBlock
          member={member}
          shopId={shopId}
          cartProducts={cartProducts.filter(cartProduct => cartProduct.shopId === (shopId || ''))}
        />
      )}

      {shopIds.length === 1 && <CheckoutBlock member={member} shopId={shopIds[0] || ''} cartProducts={cartProducts} />}

      {cartProducts.length === 0 && (
        <div className="container py-5">
          <Typography.Title level={3} className="mb-4">
            <Icon type="shopping-cart" className="mr-2" />
            <span>{formatMessage(checkoutMessages.title.cart)}</span>
          </Typography.Title>

          <CartProductTableCard className="mb-3" shopId="" cartProducts={cartProducts} />
        </div>
      )}
    </DefaultLayout>
  )
}

export default CartPage
