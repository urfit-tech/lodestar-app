import { SkeletonText } from '@chakra-ui/react'
import { Icon, Typography } from 'antd'
import { groupBy } from 'ramda'
import React, { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { StringParam, useQueryParam } from 'use-query-params'
import { useAuth } from '../components/auth/AuthContext'
import CartProductTableCard from '../components/checkout/CartProductTableCard'
import CheckoutBlock from '../components/checkout/CheckoutBlock'
import DefaultLayout from '../components/layout/DefaultLayout'
import CartContext from '../contexts/CartContext'
import { checkoutMessages } from '../helpers/translation'
import { useMember } from '../hooks/member'

const CartPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const [shopId] = useQueryParam('shopId', StringParam)
  const { cartProducts } = useContext(CartContext)
  const { isAuthenticating, currentMemberId } = useAuth()
  const { loadingMember, member } = useMember(currentMemberId || '')

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
