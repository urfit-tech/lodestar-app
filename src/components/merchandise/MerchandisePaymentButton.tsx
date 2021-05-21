import { Button, Icon } from '@chakra-ui/react'
import React, { useContext } from 'react'
import ReactPixel from 'react-facebook-pixel'
import ReactGA from 'react-ga'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import CheckoutProductModal from '../../components/checkout/CheckoutProductModal'
import { useApp } from '../../containers/common/AppContext'
import CartContext from '../../contexts/CartContext'
import { commonMessages } from '../../helpers/translation'
import { useMember } from '../../hooks/member'
import { ReactComponent as CartIcon } from '../../images/cart.svg'
import { MerchandiseProps, MerchandiseSpecProps } from '../../types/merchandise'
import { useAuth } from '../auth/AuthContext'
import { AuthModalContext } from '../auth/AuthModal'

const MerchandisePaymentButton: React.FC<{
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

  return merchandise.isCustomized ? (
    <>
      {merchandise.specs.map(spec =>
        spec.id === merchandiseSpec.id ? (
          <CustomizedMerchandisePaymentBlock
            key={spec.id}
            merchandise={merchandise}
            merchandiseSpec={merchandiseSpec}
          />
        ) : null,
      )}
    </>
  ) : (
    <GeneralMerchandisePaymentBlock merchandise={merchandise} merchandiseSpec={merchandiseSpec} quantity={quantity} />
  )
}

const GeneralMerchandisePaymentBlock: React.FC<{
  merchandise: MerchandiseProps
  merchandiseSpec: MerchandiseSpecProps
  quantity: number
}> = ({ merchandise, merchandiseSpec, quantity }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { getCartProduct, addCartProduct } = useContext(CartContext)
  const { settings } = useApp()

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
      <div className="flex-shrink-0">
        <Button
          className="d-flex align-items-center mr-2"
          variant="outline"
          isDisabled={merchandise.isLimited && (quantity === 0 || quantity > remainQuantity)}
          onClick={() => quantity && handleClick()}
        >
          <Icon as={CartIcon} />
        </Button>
      </div>

      <div className="flex-grow-1">
        <Button
          colorScheme="primary"
          isFullWidth
          isDisabled={merchandise.isLimited && (quantity === 0 || quantity > remainQuantity)}
          onClick={() => quantity && handleClick().then(() => history.push('/cart'))}
        >
          {formatMessage(commonMessages.button.purchase)}
        </Button>
      </div>
    </div>
  )
}

const CustomizedMerchandisePaymentBlock: React.FC<{
  merchandise: MerchandiseProps
  merchandiseSpec: MerchandiseSpecProps
}> = ({ merchandise, merchandiseSpec }) => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { setVisible: setAuthModal } = useContext(AuthModalContext)
  const { member } = useMember(currentMemberId || '')

  if (merchandise.isLimited && !merchandiseSpec.buyableQuantity) {
    return (
      <Button isFullWidth isDisabled>
        {formatMessage(commonMessages.button.soldOut)}
      </Button>
    )
  }

  return (
    <CheckoutProductModal
      renderTrigger={({ setVisible }) => (
        <Button
          colorScheme="primary"
          isFullWidth
          onClick={() => (!currentMemberId ? setAuthModal?.(true) : setVisible())}
        >
          {formatMessage(commonMessages.button.purchase)}
        </Button>
      )}
      paymentType="perpetual"
      defaultProductId={`MerchandiseSpec_${merchandiseSpec.id}`}
      isProductPhysical={merchandise.isPhysical}
      member={member}
      shippingMethods={merchandise.memberShop?.shippingMethods}
    />
  )
}

export default MerchandisePaymentButton
