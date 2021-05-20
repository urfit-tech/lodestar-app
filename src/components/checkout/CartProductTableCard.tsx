import { useQuery } from '@apollo/react-hooks'
import { Button, Icon } from '@chakra-ui/react'
import { Divider, List, Skeleton } from 'antd'
import { CardProps } from 'antd/lib/card'
import gql from 'graphql-tag'
import React, { Fragment, useContext, useEffect } from 'react'
import ReactGA from 'react-ga'
import { AiOutlineClose } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import CartContext from '../../contexts/CartContext'
import hasura from '../../hasura'
import { checkoutMessages } from '../../helpers/translation'
import { useMemberShop } from '../../hooks/checkout'
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
const CartProductTableCard: React.FC<CartProductTableCardProps> = ({
  shopId,
  cartProducts: cartProductWithoutInventory,
  withCartLink,
  ...cardProps
}) => {
  const { formatMessage } = useIntl()
  const { removeCartProducts } = useContext(CartContext)
  const { loading, cartProducts, refetch } = useProductInventory(cartProductWithoutInventory)
  const { memberShop } = useMemberShop(shopId)

  useEffect(() => {
    refetch && refetch()
  })

  if (loading) {
    return (
      <AdminCard {...cardProps}>
        <Skeleton active />
      </AdminCard>
    )
  }

  return (
    <AdminCard {...cardProps}>
      {cartProducts.length === 0 && (
        <div className="d-flex align-items-center">
          <span className="mr-2">{formatMessage(checkoutMessages.content.cartNothing)}</span>
          <Link to="/programs">{formatMessage(checkoutMessages.link.cartExplore)}</Link>
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

      <List itemLayout="horizontal" className="mb-4">
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
                    onClick={() => {
                      ReactGA.plugin.execute('ec', 'addProduct', {
                        id: cartProduct.productId,
                        quantity: `${cartProduct.options?.quantity || 1}`,
                      })
                      ReactGA.plugin.execute('ec', 'setAction', 'remove')
                      ReactGA.ga('send', 'event', 'UX', 'click', 'remove from cart')
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

const useProductInventory = (cartProducts: CartProductProps[]) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PRODUCT_INVENTORY,
    hasura.GET_PRODUCT_INVENTORYVariables
  >(GET_PRODUCT_INVENTORY, {
    variables: {
      productIds: cartProducts.map(cartProduct => cartProduct.productId),
    },
  })

  const productInventories =
    loading || error || !data
      ? []
      : data.product_inventory_status.map(productInventory => ({
          productId: productInventory.product_id || '',
          buyableQuantity: productInventory.buyable_quantity,
        }))

  return {
    loading,
    error,
    cartProducts: cartProducts.map(cartProduct => ({
      ...cartProduct,
      buyableQuantity: null,
      ...productInventories.find(cartProductsInventory => cartProduct.productId === cartProductsInventory.productId),
    })),
    refetch,
  }
}

const GET_PRODUCT_INVENTORY = gql`
  query GET_PRODUCT_INVENTORY($productIds: [String!]) {
    product_inventory_status(where: { product_id: { _in: $productIds } }) {
      product_id
      buyable_quantity
    }
  }
`
