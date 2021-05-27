import { Button, Icon } from '@chakra-ui/react'
import React, { useContext } from 'react'
import ReactPixel from 'react-facebook-pixel'
import ReactGA from 'react-ga'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { useApp } from '../../containers/common/AppContext'
import CartContext from '../../contexts/CartContext'
import { commonMessages } from '../../helpers/translation'
import { ProgramProps } from '../../types/program'

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

const ProgramPaymentButton: React.VFC<{ program: ProgramProps; variant?: string }> = ({ program, variant }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const [sharingCode] = useQueryParam('sharing', StringParam)
  const { settings } = useApp()
  const { addCartProduct, isProductInCart } = useContext(CartContext)

  const handleClick = async () => {
    if (settings['tracking.fb_pixel_id']) {
      ReactPixel.track('AddToCart', {
        value: program.listPrice,
        currency: 'TWD',
      })
    }
    if (settings['tracking.ga_id']) {
      ReactGA.plugin.execute('ec', 'addProduct', {
        id: program.id,
        name: program.title,
        category: 'Program',
        price: `${program.listPrice}`,
        quantity: '1',
        currency: 'TWD',
      })
      ReactGA.plugin.execute('ec', 'setAction', 'add')
      ReactGA.ga('send', 'event', 'UX', 'click', 'add to cart')
    }

    return await addCartProduct?.('Program', program.id, {
      from: window.location.pathname,
      sharingCode,
    }).catch(() => {})
  }

  return program.isSoldOut ? (
    <Button isFullWidth isDisabled>
      {formatMessage(commonMessages.button.soldOut)}
    </Button>
  ) : isProductInCart && isProductInCart('Program', program.id) ? (
    <Button colorScheme="primary" isFullWidth onClick={() => history.push(`/cart`)}>
      {formatMessage(commonMessages.button.cart)}
    </Button>
  ) : (
    <div className={variant === 'multiline' ? 'd-flex flex-column' : 'd-flex'}>
      {program.listPrice !== 0 && (
        <StyleButton
          className="mr-2"
          variant="outline"
          colorScheme="primary"
          isFullWidth={variant === 'multiline'}
          isMultiline={variant === 'multiline'}
          onClick={() => handleClick()}
        >
          <Icon as={AiOutlineShoppingCart} />
          <span className="ml-2">{formatMessage(commonMessages.button.addCart)}</span>
        </StyleButton>
      )}

      <Button colorScheme="primary" isFullWidth onClick={() => handleClick().then(() => history.push('/cart'))}>
        {program.listPrice !== 0
          ? formatMessage(commonMessages.ui.purchase)
          : formatMessage(commonMessages.button.join)}
      </Button>
    </div>
  )
}

export default ProgramPaymentButton
