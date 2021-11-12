import { Button, Icon } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { handleError } from 'lodestar-app-element/src/helpers'
import React, { useContext } from 'react'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import CartContext from '../../../contexts/CartContext'
import { commonMessages } from '../../../helpers/translation'
import { ProgramPlan } from '../../../types/program'

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

const ProgramPlanPaymentButton: React.VFC<{ programPlan: ProgramPlan }> = ({ programPlan }) => {
  const { formatMessage } = useIntl()
  const { addCartProduct, isProductInCart } = useContext(CartContext)
  const { settings } = useApp()
  const sessionStorageKey = `lodestar.sharing_code.ProgramPlan_${programPlan.id}`
  const [sharingCode = window.sessionStorage.getItem(sessionStorageKey)] = useQueryParam('sharing', StringParam)
  sharingCode && window.sessionStorage.setItem(sessionStorageKey, sharingCode)
  const history = useHistory()

  const handleAddCart = () => {
    return addCartProduct?.('ProgramPlan', programPlan.id, {
      from: window.location.pathname,
      sharingCode,
    }).catch(handleError)
  }

  return (
    <>
      {isProductInCart?.('ProgramPlan', programPlan.id) ? (
        <Button colorScheme="primary" isFullWidth onClick={() => history.push(`/cart`)}>
          {formatMessage(commonMessages.button.cart)}
        </Button>
      ) : (
        <div className="d-flex flex-column">
          {!settings['feature.cart.disable'] && (
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
            {programPlan.listPrice === 0
              ? formatMessage(commonMessages.button.join)
              : formatMessage(commonMessages.ui.purchase)}
          </Button>
        </div>
      )}
    </>
  )
}

export default ProgramPlanPaymentButton
