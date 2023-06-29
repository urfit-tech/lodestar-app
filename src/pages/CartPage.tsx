import { SkeletonText } from '@chakra-ui/react'
import { Icon, Typography } from 'antd'
import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { notEmpty } from 'lodestar-app-element/src/helpers'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import { getResourceByProductId } from 'lodestar-app-element/src/hooks/util'
import { groupBy } from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useLocation } from 'react-router-dom'
import { StringParam, useQueryParam } from 'use-query-params'
import CartProductTableCard from '../components/checkout/CartProductTableCard'
import CheckoutBlock from '../components/checkout/CheckoutBlock'
import DefaultLayout from '../components/layout/DefaultLayout'
import CartContext from '../contexts/CartContext'
import { checkoutMessages } from '../helpers/translation'
import { useMember } from '../hooks/member'

const CartPage: React.VFC = () => {
  const location = useLocation<{ productUrn?: string }>()
  const { formatMessage } = useIntl()
  const [checkoutAlready, setCheckoutAlready] = useState(false)
  const [shopId] = useQueryParam('shopId', StringParam)
  const { cartProducts } = useContext(CartContext)
  const { id: appId, settings } = useApp()
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
  const cartProductWithUrns = cartProducts.map(cartProduct => {
    const { type, target } = getResourceByProductId(cartProduct.productId)
    return { urn: `${appId}:${type}:${target}`, ...cartProduct }
  })
  const { resourceCollection } = useResourceCollection(cartProductWithUrns.map(p => p.urn))
  const filteredResourceCollection = resourceCollection.filter(notEmpty).map(resource => ({
    ...resource,
    options: { quantity: cartProductWithUrns.find(p => p.urn === resource.urn)?.options?.quantity },
  }))

  const filteredResourceUrns = filteredResourceCollection.map(resource => resource.urn)

  if (isAuthenticating || loadingMember) {
    return (
      <DefaultLayout>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout>
      {!checkoutAlready &&
        (location.state?.productUrn ? filteredResourceUrns.includes(location.state.productUrn) : true) &&
        filteredResourceCollection.length > 0 && (
          <Tracking.ViewCart resources={filteredResourceCollection} onViewCart={() => setCheckoutAlready(true)} />
        )}

      {/* group cart products by product owner */}
      {shopIds.length > 1 && typeof shopId === 'undefined' ? (
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
      ) : shopIds.length === 1 || (typeof shopId === 'string' && shopId === '') ? (
        <CheckoutBlock member={member} shopId={shopIds[0] || ''} cartProducts={cartProducts} />
      ) : typeof shopId === 'string' && shopId !== '' ? (
        <CheckoutBlock
          member={member}
          shopId={shopId}
          cartProducts={cartProducts.filter(cartProduct => cartProduct.shopId === (shopId || ''))}
        />
      ) : (
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
