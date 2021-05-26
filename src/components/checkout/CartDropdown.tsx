import { Badge, Button, List, Popover } from 'antd'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import ProductItem from '../../components/common/ProductItem'
import CartContext from '../../contexts/CartContext'
import { checkoutMessages, commonMessages } from '../../helpers/translation'

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
    color: var(--gray-darker);
  }
`

const CartDropdown: React.VFC = () => {
  const { cartProducts } = useContext(CartContext)
  const { formatMessage } = useIntl()

  const content = (
    <Wrapper>
      {cartProducts.length > 0 ? (
        <>
          <StyledList itemLayout="horizontal">
            {cartProducts.map(cartProduct => (
              <StyledListItem key={cartProduct.productId}>
                <ProductItem
                  id={cartProduct.productId}
                  variant="simpleCartProduct"
                  quantity={cartProduct.options?.quantity}
                />
              </StyledListItem>
            ))}
          </StyledList>
          <StyledAction>
            <Link to="/cart">
              <Button type="link" block>
                {formatMessage(commonMessages.button.list)}
              </Button>
            </Link>
          </StyledAction>
        </>
      ) : (
        <div className="p-3 d-flex align-items-center">
          <span className="mr-2">{formatMessage(checkoutMessages.content.cartNothing)}</span>
          <Link to="/programs">{formatMessage(checkoutMessages.link.cartExplore)}</Link>
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
        <StyledButton type="link" icon="shopping-cart" />
      </StyledBadge>
    </Popover>
  )
}

export default CartDropdown
