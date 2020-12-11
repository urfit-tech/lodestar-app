import { Icon } from '@chakra-ui/icons'
import { Button, message } from 'antd'
import React, { useContext } from 'react'
import ReactGA from 'react-ga'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import CheckoutProductModal from '../../containers/checkout/CheckoutProductModal'
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
      <Button block disabled>
        {formatMessage(commonMessages.button.unreleased)}
      </Button>
    )
  }

  if (merchandise.endedAt && merchandise.endedAt.getTime() < Date.now()) {
    return (
      <Button block disabled>
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

  if (!addCartProduct) {
    return null
  }

  const inCartQuantity: number = getCartProduct?.(`MerchandiseSpec_${merchandiseSpec.id}`)?.options?.quantity || 0
  const remainQuantity = (merchandiseSpec.buyableQuantity || 0) - inCartQuantity

  if (!merchandise.isPhysical && inCartQuantity) {
    return (
      <Button type="primary" block onClick={() => history.push('/cart')}>
        {formatMessage(commonMessages.button.cart)}
      </Button>
    )
  }

  const handleClick = async () => {
    await addCartProduct('MerchandiseSpec', merchandiseSpec.id, { quantity: merchandise.isPhysical ? quantity : 1 })
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
    message.success(formatMessage(commonMessages.text.addToCartSuccessfully))
  }

  return (
    <div className="d-flex">
      <div className="flex-shrink-0">
        <Button
          className="d-flex align-items-center mr-2"
          disabled={merchandise.isLimited && (quantity === 0 || quantity > remainQuantity)}
          onClick={() => quantity && handleClick()}
        >
          <Icon as={CartIcon} />
        </Button>
      </div>

      <div className="flex-grow-1">
        <Button
          type="primary"
          block
          disabled={merchandise.isLimited && (quantity === 0 || quantity > remainQuantity)}
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
      <Button block disabled>
        {formatMessage(commonMessages.button.soldOut)}
      </Button>
    )
  }

  return (
    <CheckoutProductModal
      renderTrigger={({ setVisible }) => (
        <Button type="primary" block onClick={() => (!currentMemberId ? setAuthModal?.(true) : setVisible())}>
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
