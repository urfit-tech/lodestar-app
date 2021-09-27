import { Button, Icon } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { useContext } from 'react'
import ReactPixel from 'react-facebook-pixel'
import ReactGA from 'react-ga'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import CartContext from '../../contexts/CartContext'
import { handleError } from '../../helpers'
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
  const { isProgramInCart, handleAddCartProgram } = useAddProgramToCart(program)

  return program.isSoldOut ? (
    <Button isFullWidth isDisabled>
      {formatMessage(commonMessages.button.soldOut)}
    </Button>
  ) : isProgramInCart ? (
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
          onClick={handleAddCartProgram}
        >
          <Icon as={AiOutlineShoppingCart} />
          <span className="ml-2">{formatMessage(commonMessages.button.addCart)}</span>
        </StyleButton>
      )}

      <Button
        colorScheme="primary"
        isFullWidth
        onClick={() => handleAddCartProgram()?.then(() => history.push('/cart'))}
      >
        {program.listPrice === 0
          ? formatMessage(commonMessages.button.join)
          : formatMessage(commonMessages.ui.purchase)}
      </Button>
    </div>
  )
}

const useAddProgramToCart = (program: Pick<ProgramProps, 'id' | 'title' | 'listPrice' | 'salePrice'>) => {
  const { settings } = useApp()
  const { addCartProduct, isProductInCart } = useContext(CartContext)

  const sessionStorageKey = `lodestar.sharing_code.Program_${program.id}`
  const [sharingCode = window.sessionStorage.getItem(sessionStorageKey)] = useQueryParam('sharing', StringParam)
  sharingCode && window.sessionStorage.setItem(sessionStorageKey, sharingCode)

  return {
    isProgramInCart: isProductInCart?.('Program', program.id),
    handleAddCartProgram: () => {
      if (settings['tracking.fb_pixel_id']) {
        ReactPixel.track('AddToCart', {
          content_name: program.title || program.id,
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

      return addCartProduct?.('Program', program.id, {
        from: window.location.pathname,
        sharingCode,
      }).catch(handleError)
    },
  }
}

export { useAddProgramToCart }

export default ProgramPaymentButton
