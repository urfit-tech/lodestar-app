import { Icon } from '@chakra-ui/react'
import CheckoutProductModal from 'lodestar-app-element/src/components/modals/CheckoutProductModal'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { handleError, notEmpty } from 'lodestar-app-element/src/helpers'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import React, { useContext } from 'react'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { AuthModalContext } from '../../../../components/auth/AuthModal'
import CoinCheckoutModal from '../../../../components/checkout/CoinCheckoutModal'
import CartContext from '../../../../contexts/CartContext'
import { camelCaseToSnake } from '../../../../helpers'
import { commonMessages } from '../../../../helpers/translation'
import { ProductType } from '../../../../types/product'
import { SecondaryCartButton, SecondaryEnrollButton } from '../SecondaryCTAButton'

const StyledSecondaryCartButton = styled(SecondaryCartButton)<{ line?: 'multiline' }>`
  span {
    display: none;
  }

  ${props =>
    props.line === 'multiline' &&
    css`
      order: 1;
      margin-top: 0.75rem;

      span {
        display: inline;
      }
    `}
`

const SecondaryPaymentButton: React.VFC<{
  type: ProductType
  target: string
  price: number
  currencyId?: string
  isSubscription?: boolean
  quantity?: number
  isPublished?: boolean
}> = ({ type, target, price, isSubscription, currencyId, quantity, isPublished }) => {
  const tracking = useTracking()
  const { isAuthenticated } = useAuth()
  const { formatMessage } = useIntl()
  const { addCartProduct, isProductInCart } = useContext(CartContext)
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const { settings, id: appId } = useApp()
  const sessionStorageKey = `lodestar.sharing_code.${type}_${target}`
  const [sharingCode = window.sessionStorage.getItem(sessionStorageKey)] = useQueryParam('sharing', StringParam)
  sharingCode && window.sessionStorage.setItem(sessionStorageKey, sharingCode)
  const history = useHistory()
  const { resourceCollection } = useResourceCollection([`${appId}:${camelCaseToSnake(type)}:${target}`])

  const handleAddCart = () => {
    return addCartProduct?.(type, target, {
      quantity,
      from: window.location.pathname,
      sharingCode,
    }).catch(handleError)
  }

  return (
    <>
      {isProductInCart?.(type, target) ? (
        <SecondaryEnrollButton colorScheme="primary" isFullWidth onClick={() => history.push(`/cart`)}>
          {formatMessage(commonMessages.button.cart)}
        </SecondaryEnrollButton>
      ) : isSubscription ? (
        <CheckoutProductModal
          defaultProductId={`${type}_${target}`}
          renderTrigger={({ isLoading, onOpen }) => (
            <StyledSecondaryCartButton
              isFullWidth
              isDisabled={isLoading || !isPublished}
              onClick={() => {
                isAuthenticated ? onOpen?.() : setAuthModalVisible?.(true)
                const resource = resourceCollection.find(notEmpty)
                resource && tracking.addToCart(resource, { direct: true })
              }}
            >
              {formatMessage(commonMessages.button.subscribeNow)}
            </StyledSecondaryCartButton>
          )}
        />
      ) : currencyId === 'LSC' ? (
        <CoinCheckoutModal productId={type + '_' + target} currencyId={currencyId} amount={price} />
      ) : (
        <div className="d-flex flex-column">
          {!Number(settings['feature.cart.disable']) && (
            <StyledSecondaryCartButton
              className="mr-2"
              line="multiline"
              isDisabled={!isPublished}
              onClick={() => {
                resourceCollection[0] && tracking.addToCart(resourceCollection[0])
                handleAddCart()
              }}
            >
              <Icon as={AiOutlineShoppingCart} />
              <span className="ml-2">{formatMessage(commonMessages.button.addCart)}</span>
            </StyledSecondaryCartButton>
          )}
          <SecondaryEnrollButton
            isDisabled={!isPublished}
            onClick={() => {
              const resource = resourceCollection.find(notEmpty)
              resource && tracking.addToCart(resource, { direct: true })
              handleAddCart()?.then(() => {
                history.push('/cart?direct=true', { productUrn: resource?.urn })
              })
            }}
          >
            {price === 0 ? formatMessage(commonMessages.button.join) : formatMessage(commonMessages.ui.purchase)}
          </SecondaryEnrollButton>
        </div>
      )}
    </>
  )
}

export default SecondaryPaymentButton
