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
import CoinCheckoutModal from '../checkout/CoinCheckoutModal'

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

type ActivityTicketPaymentButtonProps = {
  ticketId: string
  ticketPrice: number
  ticketCurrencyId: string
}
const ActivityTicketPaymentButton: React.VFC<ActivityTicketPaymentButtonProps> = ({
  ticketId,
  ticketPrice,
  ticketCurrencyId,
}) => {
  const { formatMessage } = useIntl()
  const { settings } = useApp()
  const { addCartProduct, isProductInCart } = useContext(CartContext)
  const history = useHistory()

  const handleAddCart = () => {
    return addCartProduct?.('ActivityTicket', ticketId, {
      from: window.location.pathname,
    }).catch(handleError)
  }

  return (
    <>
      {isProductInCart?.('ActivityTicket', ticketId) ? (
        <Button colorScheme="primary" isFullWidth onClick={() => history.push(`/cart`)}>
          {formatMessage(commonMessages.button.cart)}
        </Button>
      ) : ticketCurrencyId === 'LSC' ? (
        <CoinCheckoutModal
          productId={'ActivityTicket_' + ticketId}
          currencyId={ticketCurrencyId}
          amount={ticketPrice}
        />
      ) : (
        <div className="d-flex flex-column">
          {ticketPrice !== 0 && !settings['feature.cart.disable'] && (
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
            {ticketPrice === 0 ? formatMessage(commonMessages.button.join) : formatMessage(commonMessages.ui.purchase)}
          </Button>
        </div>
      )}
    </>
  )
}

export default ActivityTicketPaymentButton
