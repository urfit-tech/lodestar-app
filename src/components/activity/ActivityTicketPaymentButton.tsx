import { Button, Icon } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { handleError } from 'lodestar-app-element/src/helpers'
import React, { useContext } from 'react'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components'
import CartContext from '../../contexts/CartContext'
import { commonMessages } from '../../helpers/translation'
import { ActivityTicketProps } from '../../types/activity'

const StyleButton = styled(Button)<{ isMultiline?: boolean }>`
  span {
    display: none;
  }

  ${props =>
    props.isMultiline &&
    css`
      order: 1;
      margin-top: 0.75rem;

      span {
        display: inline;
      }
    `}
`

const ActivityTicketPaymentButton: React.VFC<{
  ticket: ActivityTicketProps
}> = ({ ticket }) => {
  const { formatMessage } = useIntl()
  const { settings } = useApp()
  const { addCartProduct, isProductInCart } = useContext(CartContext)
  const history = useHistory()

  const handleAddCart = () => {
    return addCartProduct?.('ActivityTicket', ticket.id, {
      from: window.location.pathname,
    }).catch(handleError)
  }

  return (
    <>
      {isProductInCart?.('ActivityTicket', ticket.id) ? (
        <Button colorScheme="primary" isFullWidth onClick={() => history.push(`/cart`)}>
          {formatMessage(commonMessages.button.cart)}
        </Button>
      ) : (
        <div className="d-flex flex-column">
          {ticket.price !== 0 && !settings['feature.cart.disable'] && (
            <StyleButton
              className="mr-2"
              variant="outline"
              colorScheme="primary"
              isFullWidth
              isMultiline
              onClick={handleAddCart}
            >
              <Icon as={AiOutlineShoppingCart} />
              <span className="ml-2">{formatMessage(commonMessages.button.addCart)}</span>
            </StyleButton>
          )}

          <Button colorScheme="primary" isFullWidth onClick={() => handleAddCart()?.then(() => history.push('/cart'))}>
            {ticket.price === 0 ? formatMessage(commonMessages.button.join) : formatMessage(commonMessages.ui.purchase)}
          </Button>
        </div>
      )}
    </>
  )
}

export default ActivityTicketPaymentButton
