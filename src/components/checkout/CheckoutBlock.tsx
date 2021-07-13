import { Icon, Input, SkeletonText } from '@chakra-ui/react'
import { Form, message, Typography } from 'antd'
import { prop, sum } from 'ramda'
import React, { useContext, useRef, useState } from 'react'
import ReactPixel from 'react-facebook-pixel'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../../components/auth/AuthContext'
import CartProductTableCard from '../../components/checkout/CartProductTableCard'
import CheckoutCard from '../../components/checkout/CheckoutCard'
import DiscountSelectionCard from '../../components/checkout/DiscountSelectionCard'
import InvoiceInput, { InvoiceProps, validateInvoice } from '../../components/checkout/InvoiceInput'
import ShippingInput, {
  csvShippingMethods,
  ShippingProps,
  validateShipping,
} from '../../components/checkout/ShippingInput'
import AdminCard from '../../components/common/AdminCard'
import DefaultLayout from '../../components/layout/DefaultLayout'
import { useApp } from '../../containers/common/AppContext'
import CartContext from '../../contexts/CartContext'
import { rgba } from '../../helpers'
import { checkoutMessages, commonMessages } from '../../helpers/translation'
import { useCheck, useMemberShop, usePhysicalProductCollection } from '../../hooks/checkout'
import { useMemberValidation } from '../../hooks/common'
import { useUpdateMemberMetadata } from '../../hooks/member'
import { CartProductProps } from '../../types/checkout'
import { MemberProps } from '../../types/member'
import { AuthModalContext } from '../auth/AuthModal'
import { CommonTitleMixin } from '../common'
import PaymentSelector, { PaymentMethodType, PaymentProps } from './PaymentSelector'

const StyledTitle = styled.div`
  ${CommonTitleMixin}
`
const StyledInputWrapper = styled.div`
  && {
    input:hover,
    input:focus {
      border: 1px solid ${props => props.theme['@primary-color']};
    }
    input:focus {
      box-shadow: 0 0 0 2px ${props => rgba(props.theme['@primary-color'], 0.2)};
    }
  }
`

const CheckoutBlock: React.VFC<{
  member: MemberProps | null
  shopId: string
  cartProducts: CartProductProps[]
}> = ({ member, shopId, cartProducts }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { isAuthenticating, isAuthenticated, currentMemberId } = useAuth()
  const { settings, enabledModules } = useApp()
  const { setVisible } = useContext(AuthModalContext)
  const { removeCartProducts } = useContext(CartContext)
  const { memberShop } = useMemberShop(shopId)
  const updateMemberMetadata = useUpdateMemberMetadata()

  const cartProductIds = cartProducts.map(v => v.productId.split('_')[1])
  const { hasPhysicalProduct } = usePhysicalProductCollection(cartProductIds)

  // payment information
  const cachedPaymentInfor: {
    shipping: ShippingProps
    invoice: InvoiceProps
    payment: PaymentProps
  } = {
    shipping: {
      name: '',
      phone: '',
      address: '',
      shippingMethod: 'home-delivery',
      specification: '',
      storeId: '',
      storeName: '',
    },
    invoice: {
      name: '',
      phone: '',
      email: member?.email || '',
    },
    payment: {
      gateway: settings['payment.perpetual.default_gateway'] || 'spgateway',
      method: (settings['payment.perpetual.default_gateway_method'] as PaymentMethodType) || 'credit',
    },
  }
  try {
    const cachedShipping = localStorage.getItem('kolable.cart.shipping')
    const cachedInvoice = localStorage.getItem('kolable.cart.invoice')
    const cachedPayment = localStorage.getItem('kolable.cart.payment')

    cachedPaymentInfor.shipping = cachedShipping
      ? (JSON.parse(cachedShipping) as ShippingProps)
      : {
          ...cachedPaymentInfor.shipping,
          ...member?.metadata?.shipping,
        }

    cachedPaymentInfor.invoice = cachedInvoice
      ? (JSON.parse(cachedInvoice).value as InvoiceProps)
      : {
          ...cachedPaymentInfor.invoice,
          ...member?.metadata?.invoice,
        }
    cachedPaymentInfor.payment = cachedPayment
      ? (JSON.parse(cachedPayment) as PaymentProps)
      : {
          ...cachedPaymentInfor.payment,
          ...member?.metadata?.payment,
        }
  } catch {}

  const shippingRef = useRef<HTMLDivElement | null>(null)
  const invoiceRef = useRef<HTMLDivElement | null>(null)
  const referrerRef = useRef<HTMLDivElement | null>(null)

  const [shipping, setShipping] = useState<ShippingProps>(cachedPaymentInfor.shipping)
  const [invoice, setInvoice] = useState<InvoiceProps>(cachedPaymentInfor.invoice)
  const [payment, setPayment] = useState<PaymentProps>(cachedPaymentInfor.payment)
  const [isValidating, setIsValidating] = useState(false)
  const [referrerEmail, setReferrerEmail] = useState('')

  const { memberId: referrerId, validateStatus } = useMemberValidation(referrerEmail)

  // checkout
  const [discountId, setDiscountId] = useState<string | null>(null)

  const { check, orderChecking, placeOrder, orderPlacing } = useCheck({
    productIds: cartProducts.map(cartProduct => cartProduct.productId),
    discountId,
    shipping: hasPhysicalProduct ? shipping : null,
    options: cartProducts.reduce<{ [ProductId: string]: any }>(
      (accumulator, currentValue) => ({
        ...accumulator,
        [currentValue.productId]: currentValue.options,
      }),
      {},
    ),
  })

  if (isAuthenticating) {
    return (
      <DefaultLayout>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </DefaultLayout>
    )
  }

  const handleCheckout = async () => {
    if (!isAuthenticated || !member) {
      setVisible?.(true)
      return
    }

    if (discountId && discountId !== 'None' && !discountId.split('_')[1]) {
      message.error(formatMessage(checkoutMessages.message.noCoupon))
      return
    }

    !isValidating && setIsValidating(true)
    const isValidShipping = !hasPhysicalProduct || validateShipping(shipping)
    const isValidInvoice = validateInvoice(invoice).length === 0

    if (
      hasPhysicalProduct &&
      memberShop &&
      memberShop.shippingMethods.find(shippingMethod => shippingMethod.id === shipping.shippingMethod) === undefined
    ) {
      shippingRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    if (
      csvShippingMethods.find(shippingMethod => shippingMethod === shipping.shippingMethod) &&
      shipping.storeId === ''
    ) {
      shippingRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    if (!isValidShipping) {
      shippingRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    } else if (!isValidInvoice) {
      invoiceRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    if (referrerEmail && !validateStatus) {
      return
    }
    if (validateStatus === 'error') {
      referrerRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    // tracking add payment info event
    if (settings['tracking.fb_pixel_id']) {
      ReactPixel.track('AddPaymentInfo', {
        value: check ? sum(check.orderProducts.map(prop('price'))) - sum(check.orderDiscounts.map(prop('price'))) : 0,
        currency: 'TWD',
      })
    }
    console.log('1. payment', payment)
    const taskId = await placeOrder(
      'perpetual',
      {
        ...invoice,
        referrerEmail: referrerEmail || undefined,
      },
      payment,
    )

    await updateMemberMetadata({
      variables: {
        memberId: member.id,
        metadata: {
          ...member.metadata,
          invoice,
          shipping: hasPhysicalProduct ? shipping : undefined,
          payment,
        },
        memberPhones: invoice.phone ? [{ member_id: member.id, phone: invoice.phone }] : [],
      },
    }).catch(() => {})

    await removeCartProducts?.(cartProducts.map(cartProduct => cartProduct.productId))
    history.push(`/tasks/order/${taskId}`)
  }

  return (
    <div className="container py-5">
      <Typography.Title level={3} className="mb-4">
        <Icon as={AiOutlineShoppingCart} />
        <span className="ml-2">{formatMessage(checkoutMessages.title.cart)}</span>
      </Typography.Title>

      <CartProductTableCard className="mb-3" shopId={shopId} cartProducts={cartProducts} />

      {hasPhysicalProduct && (
        <div ref={shippingRef} className="mb-3">
          <AdminCard>
            <ShippingInput
              value={shipping}
              shippingMethods={memberShop?.shippingMethods}
              onChange={value => setShipping(value)}
              isValidating={isValidating}
            />
          </AdminCard>
        </div>
      )}

      <div className="mb-3">
        <AdminCard>
          <PaymentSelector value={payment} onChange={v => setPayment(v)} />
        </AdminCard>
      </div>

      <div ref={invoiceRef} className="mb-3">
        <AdminCard>
          <InvoiceInput
            value={invoice}
            onChange={value => setInvoice(value)}
            isValidating={isValidating}
            shouldSameToShippingCheckboxDisplay={hasPhysicalProduct}
          />
        </AdminCard>
      </div>

      {cartProducts.length !== 0 && (
        <AdminCard className="mb-3">
          <div className="mb-3">
            <DiscountSelectionCard check={check} value={discountId} onChange={setDiscountId} />
          </div>
          {enabledModules.referrer && (
            <div className="row" ref={referrerRef}>
              <div className="col-12">
                <StyledTitle className="mb-2">{formatMessage(commonMessages.label.referrer)}</StyledTitle>
              </div>
              <div className="col-12 col-lg-6">
                <Form.Item
                  validateStatus={validateStatus}
                  hasFeedback
                  help={
                    validateStatus === 'error'
                      ? referrerId === currentMemberId
                        ? formatMessage(commonMessages.text.selfReferringIsNotAllowed)
                        : formatMessage(commonMessages.text.notFoundMemberEmail)
                      : undefined
                  }
                >
                  <StyledInputWrapper>
                    <Input
                      variant="outline"
                      placeholder={formatMessage(commonMessages.form.placeholder.referrerEmail)}
                      onBlur={e => setReferrerEmail(e.target.value)}
                    />
                  </StyledInputWrapper>
                </Form.Item>
              </div>
            </div>
          )}
        </AdminCard>
      )}

      <div className="mb-3">
        <CheckoutCard
          check={check}
          cartProducts={cartProducts}
          discountId={discountId}
          invoice={invoice}
          shipping={hasPhysicalProduct ? shipping : null}
          loading={orderChecking || orderPlacing}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  )
}

export default CheckoutBlock
