import { Icon } from '@chakra-ui/react'
import { Button } from 'antd'
import { ButtonProps } from 'antd/lib/button'
import React, { useContext } from 'react'
import ReactGA from 'react-ga'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import CartContext from '../../contexts/CartContext'
import { commonMessages } from '../../helpers/translation'
import { ProgramProps } from '../../types/program'

const StyleButton = styled(Button)<{ variant?: string }>`
  span {
    display: none;
  }

  ${props =>
    props.variant === 'multiline' &&
    css`
      order: 1;
      margin-top: 0.75rem;

      span {
        display: inline;
      }
    `}
`

type ProgramPaymentButtonProps = {
  program: ProgramProps
  cartButtonProps?: ButtonProps
  orderButtonProps?: ButtonProps
  variant?: string
}
const ProgramPaymentButton: React.FC<ProgramPaymentButtonProps> = ({
  program,
  cartButtonProps,
  orderButtonProps,
  variant,
}) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { addCartProduct, isProductInCart } = useContext(CartContext)
  const [sharingCode] = useQueryParam('sharing', StringParam)

  const onClickAddCartProduct = () => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        addCartProduct &&
          (await addCartProduct('Program', program.id, {
            from: window.location.pathname,
            sharingCode,
          }))

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
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  }

  return program.isSoldOut ? (
    <Button block disabled>
      {formatMessage(commonMessages.button.soldOut)}
    </Button>
  ) : isProductInCart && isProductInCart('Program', program.id) ? (
    <Button block type="primary" onClick={() => history.push(`/cart`)}>
      {formatMessage(commonMessages.button.cart)}
    </Button>
  ) : (
    <div className={variant === 'multiline' ? 'd-flex flex-column' : 'd-flex'}>
      {program.listPrice !== 0 && (
        <StyleButton
          onClick={() => onClickAddCartProduct()}
          className="mr-2"
          block={variant === 'multiline'}
          variant={variant}
          {...cartButtonProps}
        >
          <Icon as={AiOutlineShoppingCart} />
          <span className="ml-2">{formatMessage(commonMessages.button.addCart)}</span>
        </StyleButton>
      )}

      <Button
        type="primary"
        block
        onClick={() => onClickAddCartProduct().then(() => history.push('/cart'))}
        {...orderButtonProps}
      >
        {program.listPrice !== 0
          ? formatMessage(commonMessages.button.purchase)
          : formatMessage(commonMessages.button.join)}
      </Button>
    </div>
  )
}

export default ProgramPaymentButton
