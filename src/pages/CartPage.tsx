import { gql, useQuery } from '@apollo/client'
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
import hasura from '../hasura'
import { checkoutMessages } from '../helpers/translation'
import { useMember } from '../hooks/member'
import { CartProductProps } from '../types/checkout'

const CartPage: React.FC = () => {
  const location = useLocation<{ productUrn?: string }>()
  const { formatMessage } = useIntl()
  const [checkoutAlready, setCheckoutAlready] = useState(false)
  const [shopId] = useQueryParam('shopId', StringParam)
  const { cartProducts: rawCartProducts } = useContext(CartContext)
  const { loading: loadingExistentProducts, data: cartProducts } = useFilterExistentProducts(rawCartProducts)
  const { id: appId } = useApp()
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

  console.log(57, loadingExistentProducts)
  if (isAuthenticating || loadingMember || loadingExistentProducts) {
    return (
      <DefaultLayout>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout key={shopId || 'default'}>
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
              cartProducts={cartProductGroups[shopId] || []}
              withCartLink
            />
          ))}
        </div>
      ) : typeof shopId === 'string' && shopId !== '' ? (
        <CheckoutBlock
          member={member}
          shopId={shopId}
          cartProducts={cartProducts.filter(cartProduct => cartProduct.shopId === shopId)}
        />
      ) : shopIds.length === 1 ? (
        <CheckoutBlock
          member={member}
          shopId={shopIds[0]}
          cartProducts={cartProducts.filter(cartProduct => cartProduct.shopId === shopIds[0])}
        />
      ) : (
        <CheckoutBlock
          member={member}
          shopId=""
          cartProducts={cartProducts.filter(cartProduct => !cartProduct.shopId)}
        />
      )}
    </DefaultLayout>
  )
}

const useFilterExistentProducts = (cartProducts: CartProductProps[]) => {
  const activityTicketIds = cartProducts
    .map(cartProduct => cartProduct.productId.split('_'))
    .filter(([type]) => type === 'ActivityTicket')
    .map(([_, target]) => target)

  const {
    loading,
    data: targetProducts,
    error,
  } = useQuery<hasura.GetExistentProducts, hasura.GetExistentProductsVariables>(GetExistentProducts, {
    variables: { activityTicketIds },
  })

  console.log(130, targetProducts)

  const pairs = [{ tableName: 'activity_ticket', prefix: 'ActivityTicket' }]

  const existentIds = pairs.flatMap(pair =>
    targetProducts
      ? (targetProducts as any)[pair.tableName]
          .filter((v: { id: string; deleted_at: null | string }) => !v?.deleted_at)
          .map((v: { id: string; deleted_at: null | string }) => `${pair.prefix}_${v.id}`)
      : [],
  )

  const data = cartProducts.filter(
    cartProduct =>
      !pairs.map(pair => pair.prefix).includes(cartProduct.productId.split('_')[0]) ||
      existentIds.includes(cartProduct.productId),
  )

  return { loading, error, data }
}

const GetExistentProducts = gql`
  query GetExistentProducts($activityTicketIds: [uuid!]!) {
    activity_ticket(where: { id: { _in: $activityTicketIds } }) {
      id
      deleted_at
    }
  }
`

export default CartPage
