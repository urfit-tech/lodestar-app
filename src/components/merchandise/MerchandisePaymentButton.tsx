import { Button, Icon } from '@chakra-ui/react'
import CheckoutProductModal from 'lodestar-app-element/src/components/modals/CheckoutProductModal'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { notEmpty } from 'lodestar-app-element/src/helpers'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import React, { useContext, useState } from 'react'
import ReactPixel from 'react-facebook-pixel'
import ReactGA from 'react-ga'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import CartContext from '../../contexts/CartContext'
import { commonMessages } from '../../helpers/translation'
import { ReactComponent as CartIcon } from '../../images/cart.svg'
import { MerchandiseProps, MerchandiseSpecProps } from '../../types/merchandise'
import { AuthModalContext } from '../auth/AuthModal'

const MerchandisePaymentButton: React.VFC<{
  merchandise: MerchandiseProps
  merchandiseSpec: MerchandiseSpecProps
  quantity: number
}> = ({ merchandise, merchandiseSpec, quantity }) => {
  const { formatMessage } = useIntl()

  if (merchandise.startedAt && Date.now() < merchandise.startedAt.getTime()) {
    return (
      <Button isFullWidth isDisabled>
        {formatMessage(commonMessages.button.unreleased)}
      </Button>
    )
  }

  if (merchandise.endedAt && merchandise.endedAt.getTime() < Date.now()) {
    return (
      <Button isFullWidth isDisabled>
        {formatMessage(commonMessages.button.soldOut)}
      </Button>
    )
  }

  return merchandise.isCustomized || merchandise.currencyId === 'LSC' ? (
    <>
      {merchandise.specs.map(spec =>
        spec.id === merchandiseSpec.id ? (
          <CustomizedMerchandisePaymentBlock
            key={spec.id}
            merchandise={merchandise}
            merchandiseSpec={merchandiseSpec}
            quantity={quantity}
          />
        ) : null,
      )}
    </>
  ) : (
    <GeneralMerchandisePaymentBlock merchandise={merchandise} merchandiseSpec={merchandiseSpec} quantity={quantity} />
  )
}

const GeneralMerchandisePaymentBlock: React.VFC<{
  merchandise: MerchandiseProps
  merchandiseSpec: MerchandiseSpecProps
  quantity: number
}> = ({ merchandise, merchandiseSpec, quantity }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { getCartProduct, addCartProduct, isProductInCart } = useContext(CartContext)
  const { settings, id: appId } = useApp()
  const tracking = useTracking()
  const { resourceCollection } = useResourceCollection([`${appId}:merchandise_spec:${merchandiseSpec.id}`])

  const inCartQuantity: number = getCartProduct?.(`MerchandiseSpec_${merchandiseSpec.id}`)?.options?.quantity || 0
  const remainQuantity = (merchandiseSpec.buyableQuantity || 0) - inCartQuantity

  if (!merchandise.isPhysical && inCartQuantity) {
    return (
      <Button colorScheme="primary" isFullWidth onClick={() => history.push('/cart')}>
        {formatMessage(commonMessages.button.cart)}
      </Button>
    )
  }

  const handleClick = async () => {
    if (settings['tracking.fb_pixel_id']) {
      ReactPixel.track('AddToCart', {
        content_name: `${merchandise.title} - ${merchandiseSpec.title}`,
        value: merchandiseSpec.listPrice,
        currency: 'TWD',
      })
    }

    if (settings['tracking.ga_id']) {
      ReactGA.plugin.execute('ec', 'addProduct', {
        id: merchandiseSpec.id,
        name: `${merchandise.title} - ${merchandiseSpec.title}`,
        category: 'MerchandiseSpec',
        price: `${merchandiseSpec.listPrice}`,
        quantity: `${merchandise.isPhysical ? quantity : 1}`,
        currency: 'TWD',
      })
      ReactGA.plugin.execute('ec', 'setAction', 'add')
      ReactGA.ga('send', 'event', 'UX', 'click', 'add to cart')
    }

    return await addCartProduct?.('MerchandiseSpec', merchandiseSpec.id, {
      quantity: merchandise.isPhysical ? quantity : 1,
    }).catch(() => {})
  }

  return (
    <div className="d-flex">
      {merchandise.currencyId !== 'LSC' && (
        <div className="flex-shrink-0">
          <Button
            className="d-flex align-items-center mr-2"
            variant="outline"
            isDisabled={merchandise.isLimited && (quantity === 0 || quantity > remainQuantity)}
            onClick={() => {
              const resource = resourceCollection.find(notEmpty)
              if (quantity) {
                if (resource) tracking.addToCart(resource, { quantity })
                handleClick()
              }
            }}
          >
            <Icon as={CartIcon} />
          </Button>
        </div>
      )}

      <div className="flex-grow-1">
        <Button
          colorScheme="primary"
          isFullWidth
          isDisabled={merchandise.isLimited && (quantity === 0 || quantity > remainQuantity)}
          onClick={() => {
            const resource = resourceCollection.find(notEmpty)
            if (quantity) {
              if (resource && !isProductInCart?.('MerchandiseSpec', merchandiseSpec.id)) {
                tracking.addToCart(resource, { direct: true, quantity })
              }
              handleClick().then(() => history.push('/cart'))
            }
          }}
        >
          {formatMessage(commonMessages.ui.purchase)}
        </Button>
      </div>
    </div>
  )
}

const CustomizedMerchandisePaymentBlock: React.VFC<{
  merchandise: MerchandiseProps
  merchandiseSpec: MerchandiseSpecProps
  quantity: number
}> = ({ merchandise, merchandiseSpec, quantity }) => {
  const { formatMessage } = useIntl()
  const { isAuthenticated } = useAuth()
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const [isPaymentButtonDisable, setIsPaymentButtonDisable] = useState(true)
  const { id: appId } = useApp()
  const tracking = useTracking()

  const { resourceCollection } = useResourceCollection([`${appId}:merchandise_spec:${merchandiseSpec.id}`])

  if (merchandise.isLimited && !merchandiseSpec.buyableQuantity) {
    return (
      <Button isFullWidth isDisabled>
        {formatMessage(commonMessages.button.soldOut)}
      </Button>
    )
  }

  return (
    <CheckoutProductModal
      renderTrigger={({ isLoading, onOpen }) => (
        <Button
          colorScheme="primary"
          isFullWidth
          isDisabled={(isAuthenticated && isLoading) || isPaymentButtonDisable}
          onClick={() => {
            isAuthenticated ? onOpen?.() : setAuthModalVisible?.(true)
            const resource = resourceCollection.find(notEmpty)
            resource && tracking.addToCart(resource, { direct: true, quantity })
          }}
        >
          {formatMessage(commonMessages.ui.purchase)}
        </Button>
      )}
      defaultProductId={`MerchandiseSpec_${merchandiseSpec.id}`}
      shippingMethods={merchandise.memberShop?.shippingMethods}
      productQuantity={quantity}
      setIsPaymentButtonDisable={setIsPaymentButtonDisable}
    />
  )
}

export default MerchandisePaymentButton
