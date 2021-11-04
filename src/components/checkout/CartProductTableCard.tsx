import { useQuery } from '@apollo/react-hooks'
import { Button, Divider, Icon, SkeletonText } from '@chakra-ui/react'
import { List } from 'antd'
import { CardProps } from 'antd/lib/card'
import gql from 'graphql-tag'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { Fragment, useContext, useEffect } from 'react'
import ReactGA from 'react-ga'
import { AiOutlineClose } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import CartContext from '../../contexts/CartContext'
import hasura from '../../hasura'
import { checkoutMessages } from '../../helpers/translation'
import { useMemberShop } from '../../hooks/checkout'
import { useSimpleProductCollection } from '../../hooks/common'
import EmptyAvatar from '../../images/avatar.svg'
import { CartProductProps } from '../../types/checkout'
import AdminCard from '../common/AdminCard'
import { CustomRatioImage } from '../common/Image'
import CartProductItem from './CartProductItem'

type CartProductTableCardProps = CardProps & {
  shopId: string
  cartProducts: CartProductProps[]
  withCartLink?: boolean
}
const CartProductTableCard: React.VFC<CartProductTableCardProps> = ({
  shopId,
  cartProducts: cartProductWithoutInventory,
  withCartLink,
  ...cardProps
}) => {
  const { formatMessage } = useIntl()
  const { removeCartProducts } = useContext(CartContext)
  const { loading, cartProductsWithInventory: cartProducts, refetch } = useProductInventory(cartProductWithoutInventory)
  const { memberShop } = useMemberShop(shopId)
  const getSimpleProductCollection = useSimpleProductCollection()
  const { settings, id: appId } = useApp()

  useEffect(() => {
    refetch && refetch()
  })
  useEffect(() => {
    if (settings['tracking.gtm_id'] && cartProducts) {
      const cartProductIds = cartProducts.map(cartProduct => cartProduct.productId)

      getSimpleProductCollection(cartProductIds)
        .then(simpleProducts => {
          ;(window as any).dataLayer = (window as any).dataLayer || []
          ;(window as any).dataLayer.push({ ecommerce: null })
          ;(window as any).dataLayer.push({
            event: 'checkout',
            ecommerce: {
              checkout: {
                // FIXME: action option fetch from payment method
                actionField: { step: 1, option: 'credit' },
                products: simpleProducts.map(simpleProduct => ({
                  name: simpleProduct.title,
                  id: simpleProduct.id,
                  price: simpleProduct.isOnSale ? simpleProduct.salePrice : simpleProduct.listPrice || 0,
                  brand: settings['title'] || appId,
                  categories: simpleProduct.categories?.join('|'),
                  variant: simpleProduct.roles?.join('|'),
                  quantity:
                    cartProducts.find(cartProduct => cartProduct.productId.split('_')[1] === simpleProduct.id)?.options
                      ?.quantity || 1,
                })),
              },
            },
          })
        })
        .catch()
    }
  }, [cartProducts, settings])

  if (loading) {
    return (
      <AdminCard {...cardProps}>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </AdminCard>
    )
  }

  return (
    <AdminCard {...cardProps}>
      {cartProducts.length === 0 && (
        <div className="d-flex align-items-center">
          <span className="mr-2">{formatMessage(checkoutMessages.content.cartNothing)}</span>
          <Link to="/programs">
            <Button variant="ghost">{formatMessage(checkoutMessages.link.cartExplore)}</Button>
          </Link>
        </div>
      )}

      {memberShop && (
        <>
          <div className="d-flex align-items-center">
            <CustomRatioImage
              width="32px"
              ratio={1}
              src={memberShop.pictureUrl || EmptyAvatar}
              shape="circle"
              className="mr-2"
            />
            <span>{memberShop.title}</span>
          </div>
          <Divider className="my-4" />
        </>
      )}

      <List itemLayout="horizontal" className={cartProducts.length !== 0 ? 'mb-4' : ''}>
        {cartProducts.map(
          cartProduct =>
            cartProduct.productId && (
              <Fragment key={cartProduct.productId}>
                <div className="d-flex align-items-center justify-content-between">
                  <CartProductItem
                    id={cartProduct.productId}
                    quantity={cartProduct.options?.quantity}
                    buyableQuantity={cartProduct.buyableQuantity}
                  />
                  <Icon
                    as={AiOutlineClose}
                    className="flex-shrink-0"
                    onClick={async () => {
                      ReactGA.plugin.execute('ec', 'addProduct', {
                        id: cartProduct.productId,
                        quantity: `${cartProduct.options?.quantity || 1}`,
                      })
                      ReactGA.plugin.execute('ec', 'setAction', 'remove')
                      ReactGA.ga('send', 'event', 'UX', 'click', 'remove from cart')
                      try {
                        const simpleProduct = (await getSimpleProductCollection([cartProduct.productId]))[0]
                        ;(window as any).dataLayer = (window as any).dataLayer || []
                        ;(window as any).dataLayer.push({ ecommerce: null })
                        ;(window as any).dataLayer.push({
                          event: 'removeFromCart',
                          ecommerce: {
                            remove: {
                              products: [
                                {
                                  name: simpleProduct.title,
                                  id: simpleProduct.id,
                                  price: simpleProduct.isOnSale
                                    ? simpleProduct.salePrice
                                    : simpleProduct.listPrice || 0,
                                  brand: settings['title'] || appId,
                                  categories: simpleProduct.categories?.join('|'),
                                  variant: simpleProduct.roles?.join('|'),
                                  quantity:
                                    cartProducts.find(
                                      cartProduct => cartProduct.productId.split('_')[1] === simpleProduct.id,
                                    )?.options?.quantity || 1,
                                },
                              ],
                            },
                          },
                        })
                      } catch {}

                      removeCartProducts && removeCartProducts([cartProduct.productId])
                    }}
                  />
                </div>
                <Divider className="my-4" />
              </Fragment>
            ),
        )}
      </List>

      {withCartLink && (
        <div className="text-right mt-2">
          <Link to={`/cart?shopId=${shopId}`}>
            <Button colorScheme="primary" className="px-5">
              {formatMessage(checkoutMessages.button.cartSubmit)}
            </Button>
          </Link>
        </div>
      )}
    </AdminCard>
  )
}

export default CartProductTableCard

export const useProductInventory = (cartProducts: CartProductProps[]) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PRODUCT_INVENTORY,
    hasura.GET_PRODUCT_INVENTORYVariables
  >(GET_PRODUCT_INVENTORY, {
    variables: {
      productIds: cartProducts.map(cartProduct => cartProduct.productId),
      activityTicketIds: cartProducts
        .filter(cartProduct => cartProduct.productId.includes('ActivityTicket'))
        .map(cartProduct => cartProduct.productId.split('_')[1]),
    },
  })

  const activityTicketInventories =
    data?.activity_ticket_enrollment_count?.map(v => ({
      productId: `ActivityTicket_${v.activity_ticket_id}`,
      buyableQuantity: v.buyable_quantity,
    })) || []

  const productInventories =
    data?.product_inventory_status.map(v => ({
      productId: v.product_id || '',
      buyableQuantity: v.buyable_quantity,
    })) || []

  return {
    loading,
    error,
    cartProductsWithInventory: cartProducts.map(cartProduct => ({
      ...cartProduct,
      buyableQuantity: null,
      ...[...productInventories, ...activityTicketInventories].find(
        cartProductsInventory => cartProduct.productId === cartProductsInventory.productId,
      ),
    })),
    refetch,
  }
}

const GET_PRODUCT_INVENTORY = gql`
  query GET_PRODUCT_INVENTORY($productIds: [String!], $activityTicketIds: [uuid!]) {
    product_inventory_status(where: { product_id: { _in: $productIds } }) {
      product_id
      buyable_quantity
    }
    activity_ticket_enrollment_count(where: { activity_ticket_id: { _in: $activityTicketIds } }) {
      activity_id
      activity_ticket_id
      buyable_quantity
      count
    }
  }
`
