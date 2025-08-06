import { Button, Icon, Spinner } from '@chakra-ui/react'
import { Badge, List, Popover } from 'antd'
import React, { useContext } from 'react'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import ProductItem from '../../components/common/ProductItem'
import CartContext from '../../contexts/CartContext'
import { checkoutMessages, commonMessages } from '../../helpers/translation'
import { useProductCollection } from '../../hooks/common'

const Wrapper = styled.div`
  width: 100vw;
  max-width: 320px;
`
const StyledList = styled(List)`
  && {
    max-height: calc(70vh - 57px - 42px);
    overflow-y: auto;
    overflow-x: hidden;
  }
`
const StyledListItem = styled(List.Item)`
  && {
    padding: 12px;
    cursor: pointer;
  }
`
const StyledAction = styled.div`
  border-top: 1px solid #ececec;

  button {
    color: #9b9b9b;
  }
`
const StyledBadge = styled(Badge)`
  button {
    font-size: 20px;
  }

  .ant-badge-count {
    top: 8px;
    right: 4px;
  }
`
const StyledButton = styled(Button)`
  &&,
  &&:hover,
  &&:active,
  &&:focus {
    color: ${props => props.theme['@nav-color'] || '#585858'};
  }
`

const CartDropdown: React.FC = () => {
  const { cartProducts } = useContext(CartContext)
  const { formatMessage } = useIntl()

  const ProductListItem: React.FC<{ productIds: string[] }> = ({ productIds }) => {
    const { loading, productCollection } = useProductCollection(productIds)
    return (
      <>
        {loading ? (
          <StyledListItem>
            <Spinner />
          </StyledListItem>
        ) : (
          productCollection.map(product => (
            <StyledListItem key={product.targetId}>
              <ProductItem
                product={product}
                variant="simpleCartProduct"
                quantity={
                  cartProducts.find(
                    cartProduct => cartProduct.productId === `${product.productType}_${product.targetId}`,
                  )?.options?.quantity || 0
                }
              />
            </StyledListItem>
          ))
        )}
      </>
    )
  }

  const content = (
    <Wrapper>
      {cartProducts.length > 0 ? (
        <>
          <StyledList itemLayout="horizontal">
            <ProductListItem productIds={cartProducts.map(cartProduct => cartProduct.productId) || []} />
          </StyledList>
          <StyledAction>
            <Link to="/cart">
              <Button variant="ghost" isFullWidth>
                {formatMessage(commonMessages.button.list)}
              </Button>
            </Link>
          </StyledAction>
        </>
      ) : (
        <div className="p-3 d-flex align-items-center">
          <span className="mr-2">{formatMessage(checkoutMessages.content.cartNothing)}</span>
          <Link to="/programs">
            <Button variant="ghost">{formatMessage(checkoutMessages.link.cartExplore)}</Button>
          </Link>
        </div>
      )}
    </Wrapper>
  )

  return (
    <Popover
      placement="bottomRight"
      trigger="click"
      title={formatMessage(checkoutMessages.title.cart)}
      content={content}
    >
      <StyledBadge count={cartProducts.length} className="mr-2">
        <StyledButton variant="ghost">
          <Icon as={AiOutlineShoppingCart} />
        </StyledButton>
      </StyledBadge>
    </Popover>
  )
}

export default CartDropdown
