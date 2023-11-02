import { Button, Icon } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { handleError } from 'lodestar-app-element/src/helpers'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import React, { useContext } from 'react'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import CoinCheckoutModal from '../../../components/checkout/CoinCheckoutModal'
import CartContext from '../../../contexts/CartContext'
import { notEmpty } from '../../../helpers'
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

const ProgramPlanPaymentButton: React.VFC<{
  programPlan: ProgramPlan & {
    isSubscription: boolean
    groupBuyingPeople: number
  }
}> = ({ programPlan }, isPublished) => {
  const tracking = useTracking()
  const { formatMessage } = useIntl()
  const { addCartProduct, isProductInCart } = useContext(CartContext)
  const { settings, id: appId } = useApp()
  const sessionStorageKey = `lodestar.sharing_code.ProgramPlan_${programPlan.id}`
  const [sharingCode = window.sessionStorage.getItem(sessionStorageKey)] = useQueryParam('sharing', StringParam)
  sharingCode && window.sessionStorage.setItem(sessionStorageKey, sharingCode)
  const history = useHistory()
  const { resourceCollection } = useResourceCollection([`${appId}:program_plan:${programPlan.id}`])
  const isOnSale = (programPlan.soldAt?.getTime() || 0) > Date.now()

  const handleAddCart = () => {
    return addCartProduct?.('ProgramPlan', programPlan.id, {
      from: window.location.pathname,
      sharingCode,
    }).catch(handleError)
  }

  return (
    <>
      {isProductInCart?.('ProgramPlan', programPlan.id) ? (
        <Button
          colorScheme="primary"
          isFullWidth
          isDisabled={!programPlan.publishedAt}
          onClick={() => history.push(`/cart`)}
        >
          {formatMessage(commonMessages.button.cart)}
        </Button>
      ) : (
        <div className="d-flex flex-column">
          {!Number(settings['feature.cart.disable']) && programPlan.currency.id !== 'LSC' && (
            <StyleButton
              className="mr-2"
              variant="outline"
              colorScheme="primary"
              isFullWidth
              isMultiline
              isDisabled={!programPlan.publishedAt}
              onClick={() => {
                resourceCollection[0] && tracking.addToCart(resourceCollection[0])
                handleAddCart()
              }}
            >
              <Icon as={AiOutlineShoppingCart} />
              <span className="ml-2">{formatMessage(commonMessages.button.addCart)}</span>
            </StyleButton>
          )}

          {!programPlan.isSubscription && programPlan.currency.id === 'LSC' ? (
            <CoinCheckoutModal
              productId={'ProgramPlan_' + programPlan.id}
              currencyId={programPlan.currency.id}
              amount={isOnSale && programPlan.salePrice ? programPlan.salePrice : programPlan.listPrice}
            />
          ) : (
            <Button
              colorScheme="primary"
              isFullWidth
              disabled={!programPlan.publishedAt}
              onClick={() => {
                const resource = resourceCollection.find(notEmpty)
                resource && tracking.addToCart(resource, { direct: true })
                handleAddCart()?.then(() => {
                  history.push('/cart?direct=true', { productUrn: resource?.urn })
                })
              }}
            >
              {programPlan.listPrice === 0
                ? formatMessage(commonMessages.button.join)
                : formatMessage(commonMessages.ui.purchase)}
            </Button>
          )}
        </div>
      )}
    </>
  )
}

export default ProgramPlanPaymentButton
