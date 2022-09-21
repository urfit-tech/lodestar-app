import { Box, Checkbox, Icon, Input, OrderedList, SkeletonText, useToast } from '@chakra-ui/react'
import { defineMessage } from '@formatjs/intl'
import { Form, message, Typography } from 'antd'
import { CommonTitleMixin } from 'lodestar-app-element/src/components/common/'
import CheckoutGroupBuyingForm, {
  StyledBlockTitle,
  StyledListItem,
} from 'lodestar-app-element/src/components/forms/CheckoutGroupBuyingForm'
import ContactInfoInput from 'lodestar-app-element/src/components/inputs/ContactInfoInput'
import InvoiceInput, { validateInvoice } from 'lodestar-app-element/src/components/inputs/InvoiceInput'
import PaymentSelector from 'lodestar-app-element/src/components/selectors/PaymentSelector'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { validateContactInfo } from 'lodestar-app-element/src/helpers'
import { PaymentProps } from 'lodestar-app-element/src/types/checkout'
import { prop, sum } from 'ramda'
import React, { useContext, useEffect, useRef, useState } from 'react'
import ReactPixel from 'react-facebook-pixel'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import CartProductTableCard, { useProductInventory } from '../../components/checkout/CartProductTableCard'
import CheckoutCard from '../../components/checkout/CheckoutCard'
import DiscountSelectionCard from '../../components/checkout/DiscountSelectionCard'
import ShippingInput, { csvShippingMethods, validateShipping } from '../../components/checkout/ShippingInput'
import AdminCard from '../../components/common/AdminCard'
import DefaultLayout from '../../components/layout/DefaultLayout'
import CartContext from '../../contexts/CartContext'
import { rgba } from '../../helpers'
import { checkoutMessages, commonMessages } from '../../helpers/translation'
import { useCheck, useMemberShop, usePhysicalProductCollection } from '../../hooks/checkout'
import { useMemberValidation } from '../../hooks/common'
import { useUpdateMemberMetadata } from '../../hooks/member'
import { CartProductProps, InvoiceProps, ShippingProps } from '../../types/checkout'
import { MemberProps } from '../../types/member'
import { AuthModalContext } from '../auth/AuthModal'
import GroupBuyingRuleModal from './CheckoutGroupBuyingForm/GroupBuyingRuleModal'

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

const StyledApprovementBox = styled.div`
  padding-left: 46px;
`

const StyledLabel = styled.span`
  font-weight: bold;
`

const StyledCheckbox = styled(Checkbox)`
  .chakra-checkbox__control {
    border: 1px solid #cdcece;
  }
`

const CheckoutBlock: React.VFC<{
  member: MemberProps | null
  shopId: string
  cartProducts: CartProductProps[]
  isFieldsValidate?: (fieldsValue: { invoice: InvoiceProps; shipping: ShippingProps }) => {
    isValidInvoice: boolean
    isValidShipping: boolean
  }
  renderInvoice?: (props: {
    invoice: InvoiceProps
    setInvoice: React.Dispatch<React.SetStateAction<InvoiceProps>>
    isValidating: boolean
  }) => React.ReactNode
  renderTerms?: () => React.ReactNode
}> = ({ member, shopId, cartProducts, isFieldsValidate, renderInvoice, renderTerms }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { isAuthenticating, isAuthenticated, currentMemberId } = useAuth()
  const { settings, enabledModules } = useApp()
  const { setVisible } = useContext(AuthModalContext)
  const { removeCartProducts } = useContext(CartContext)
  const { memberShop } = useMemberShop(shopId)
  const [isApproved, setIsApproved] = useState(settings['checkout.approvement'] !== 'true')
  useEffect(() => {
    setIsApproved(settings['checkout.approvement'] !== 'true')
  }, [settings])

  const updateMemberMetadata = useUpdateMemberMetadata()
  const toast = useToast()

  const cartProductIds = cartProducts.map(v => v.productId.split('_')[1])
  const { hasPhysicalProduct } = usePhysicalProductCollection(cartProductIds)
  const {
    loading: loadingCartProductsWithInventory,
    cartProductsWithInventory,
    refetch: refetchCartProductsWithInventory,
  } = useProductInventory(cartProducts)

  // payment information
  const cachedPaymentInfo: {
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
      name: member?.name || '',
      phone: '',
      email: member?.email || '',
    },
    payment: {
      gateway: settings['payment.perpetual.default_gateway'] || 'spgateway',
      method: settings['payment.perpetual.default_gateway_method'] || 'credit',
    } as PaymentProps,
  }
  try {
    const cachedShipping = localStorage.getItem('kolable.cart.shipping')
    const cachedInvoice = localStorage.getItem('kolable.cart.invoice')
    const cachedPayment = localStorage.getItem('kolable.cart.payment.perpetual')

    cachedPaymentInfo.shipping = cachedShipping
      ? (JSON.parse(cachedShipping) as ShippingProps)
      : {
          ...cachedPaymentInfo.shipping,
          ...member?.shipping,
        }

    cachedPaymentInfo.invoice = cachedInvoice
      ? (JSON.parse(cachedInvoice).value as InvoiceProps)
      : {
          ...cachedPaymentInfo.invoice,
          ...member?.invoice,
        }
    cachedPaymentInfo.payment = cachedPayment
      ? (JSON.parse(cachedPayment) as PaymentProps)
      : {
          ...cachedPaymentInfo.payment,
          ...member?.payment,
        }
  } catch {}

  const contactInfoRef = useRef<HTMLDivElement | null>(null)
  const cartRef = useRef<HTMLDivElement | null>(null)
  const shippingRef = useRef<HTMLDivElement | null>(null)
  const invoiceRef = useRef<HTMLDivElement | null>(null)
  const referrerRef = useRef<HTMLDivElement | null>(null)
  const paymentMethodRef = useRef<HTMLDivElement | null>(null)
  const groupBuyingRef = useRef<HTMLDivElement | null>(null)

  const [shipping, setShipping] = useState<ShippingProps>(cachedPaymentInfo.shipping)
  const [invoice, setInvoice] = useState<InvoiceProps>(cachedPaymentInfo.invoice)
  const [payment, setPayment] = useState<PaymentProps | null>(null)
  const [errorContactFields, setErrorContactFields] = useState<string[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const [referrerEmail, setReferrerEmail] = useState('')
  const [groupBuying, setGroupBuying] = useState<{
    [productId: string]: {
      memberIds: string[]
      withError: boolean
    }
  }>({})
  const [isGiftPlanDeliverable, setIsGiftPlanDeliverable] = useState(false)

  const { memberId: referrerId, validateStatus } = useMemberValidation(referrerEmail)

  // checkout
  const [discountId, setDiscountId] = useState<string | null>(null)

  const { check, orderChecking, placeOrder, orderPlacing, totalPrice } = useCheck({
    productIds: cartProducts.map(cartProduct => cartProduct.productId),
    discountId,
    shipping: isGiftPlanDeliverable ? { ...shipping, shippingMethod: undefined } : hasPhysicalProduct ? shipping : null,
    options: cartProducts.reduce<{ [ProductId: string]: any }>(
      (accumulator, currentValue) => ({
        ...accumulator,
        [currentValue.productId]: {
          ...currentValue.options,
          ...(groupBuying[currentValue.productId]
            ? {
                groupBuyingPartnerIds: groupBuying[currentValue.productId].memberIds,
              }
            : {}),
        },
      }),
      {},
    ),
  })

  useEffect(() => {
    let isDeliverable = false
    check.orderProducts.forEach(orderProduct => {
      orderProduct.options?.productGiftPlan?.giftPlan?.gifts?.forEach(gift => {
        if (gift.isDeliverable) {
          isDeliverable = true
        }
      })
    })
    setIsGiftPlanDeliverable(isDeliverable)
  }, [check])

  if (isAuthenticating) {
    return (
      <DefaultLayout>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </DefaultLayout>
    )
  }

  const handleCheckoutAsync = async () => {
    if (!isAuthenticated || !member) {
      setVisible?.(true)
      return
    }

    if (discountId && discountId !== 'None' && !discountId.split('_')[1]) {
      message.error(formatMessage(checkoutMessages.message.noCoupon))
      return
    }

    !isValidating && setIsValidating(true)

    if (settings['feature.contact_info.enabled'] === '1' && totalPrice === 0) {
      const errorFields = validateContactInfo(invoice)
      if (errorFields.length !== 0) {
        setErrorContactFields(errorFields)
        contactInfoRef.current?.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }

    let isValidShipping = false
    let isValidInvoice = false
    if (isFieldsValidate) {
      ;({ isValidInvoice, isValidShipping } = isFieldsValidate({ invoice, shipping }))
    } else {
      isValidShipping = (!hasPhysicalProduct && !isGiftPlanDeliverable) || validateShipping(shipping)
      isValidInvoice = Number(settings['feature.invoice.disable'])
        ? true
        : Number(settings['feature.invoice_member_info_input.disable'])
        ? validateInvoice(invoice).filter(v => !['name', 'phone', 'email'].includes(v)).length === 0
        : validateInvoice(invoice).length === 0
    }

    refetchCartProductsWithInventory()
    if (
      !loadingCartProductsWithInventory &&
      cartProductsWithInventory.some(cartProduct => cartProduct.buyableQuantity === 0)
    ) {
      cartRef.current?.scrollIntoView({ behavior: 'smooth' })
      toast({
        title: formatMessage(checkoutMessages.event.removeSoldOutProduct),
        status: 'error',
        duration: 3000,
        isClosable: false,
        position: 'top',
      })
      return
    }

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
    } else if (totalPrice > 0 && !isValidInvoice) {
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
    if (Object.values(groupBuying).some(groupBuy => groupBuy.withError)) {
      groupBuyingRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    if (totalPrice > 0 && payment === null) {
      paymentMethodRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    // tracking add payment info event
    if (settings['tracking.fb_pixel_id']) {
      ReactPixel.track('AddPaymentInfo', {
        value: check ? sum(check.orderProducts.map(prop('price'))) - sum(check.orderDiscounts.map(prop('price'))) : 0,
        currency: 'TWD',
        contents: check.orderProducts.map(orderProduct => ({
          id: orderProduct.productId,
          name: orderProduct.name,
          quantity: orderProduct.options?.quantity || 1,
        })),
      })
    }

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
          invoice,
          shipping: hasPhysicalProduct || isGiftPlanDeliverable ? shipping : member.shipping,
          payment,
        },
        memberPhones: invoice.phone ? [{ member_id: member.id, phone: invoice.phone }] : [],
      },
    }).catch(() => {})

    await removeCartProducts?.(cartProducts.map(cartProduct => cartProduct.productId))
    history.push(`/tasks/order/${taskId}`)
  }

  const groupBuyingEnabledVerify = (cartProduct: CartProductProps) => {
    if (cartProduct.productId.includes('ActivityTicket')) {
      return enabledModules.group_buying_ticket && cartProduct.options?.quantity > 1
    }
    return false
  }

  return (
    <div className="container py-5">
      <Typography.Title level={3} className="mb-4">
        <Icon as={AiOutlineShoppingCart} />
        <span className="ml-2">{formatMessage(checkoutMessages.title.cart)}</span>
      </Typography.Title>
      <div ref={cartRef}>
        <CartProductTableCard className="mb-3" shopId={shopId} cartProducts={cartProducts} />
      </div>
      {cartProducts.some(groupBuyingEnabledVerify) && (
        <AdminCard className="mb-3">
          <div ref={groupBuyingRef}>
            <StyledBlockTitle className="mb-3">{formatMessage(checkoutMessages.label.groupBuying)}</StyledBlockTitle>
            <OrderedList className="mb-4">
              <StyledListItem>{formatMessage(checkoutMessages.text.groupBuyingDescription1)}</StyledListItem>
              <StyledListItem>{formatMessage(checkoutMessages.text.groupBuyingDescription2)}</StyledListItem>
              <StyledListItem>
                {formatMessage(checkoutMessages.text.groupBuyingDescription3, { modal: <GroupBuyingRuleModal /> })}
              </StyledListItem>
            </OrderedList>
            {cartProducts.map(
              cartProduct =>
                groupBuyingEnabledVerify(cartProduct) && (
                  <CheckoutGroupBuyingForm
                    productId={cartProduct.productId}
                    partnerCount={cartProduct.options?.quantity ? cartProduct.options.quantity - 1 : 1}
                    onChange={value =>
                      setGroupBuying(groupBuy => ({
                        ...groupBuy,
                        [cartProduct.productId]: value,
                      }))
                    }
                  />
                ),
            )}
          </div>
        </AdminCard>
      )}

      {!orderPlacing && !orderChecking && totalPrice === 0 && settings['feature.contact_info.enabled'] === '1' && (
        <Box ref={contactInfoRef} mb="3">
          <AdminCard>
            <ContactInfoInput value={invoice} onChange={v => setInvoice(v)} errorContactFields={errorContactFields} />
          </AdminCard>
        </Box>
      )}

      {(hasPhysicalProduct || isGiftPlanDeliverable) && (
        <div ref={shippingRef} className="mb-3">
          <AdminCard>
            <ShippingInput
              value={shipping}
              shippingMethods={memberShop?.shippingMethods}
              onChange={value => setShipping(value)}
              isValidating={isValidating}
              isGiftPlanDeliverable={isGiftPlanDeliverable}
            />
          </AdminCard>
        </div>
      )}
      {totalPrice > 0 && (
        <>
          <div className="mb-3">
            <AdminCard>
              <div ref={paymentMethodRef}>
                <PaymentSelector
                  value={payment}
                  onChange={v => setPayment(v as PaymentProps | null)}
                  isValidating={isValidating}
                />
              </div>
            </AdminCard>
          </div>

          <div ref={invoiceRef} className="mb-3">
            {renderInvoice?.({ invoice, setInvoice, isValidating }) ||
              (settings['feature.invoice.disable'] !== '1' && (
                <AdminCard>
                  <InvoiceInput
                    value={invoice}
                    onChange={value => setInvoice(value)}
                    isValidating={isValidating}
                    shouldSameToShippingCheckboxDisplay={hasPhysicalProduct}
                  />
                </AdminCard>
              ))}
          </div>
        </>
      )}

      {cartProducts.length > 0 && totalPrice > 0 && !enabledModules.referrer && (
        <AdminCard className="mb-3">
          <DiscountSelectionCard check={check} value={discountId} onChange={setDiscountId} />
        </AdminCard>
      )}
      {cartProducts.length > 0 && totalPrice === 0 && enabledModules.referrer && (
        <AdminCard className="mb-3">
          <div className="row" ref={referrerRef}>
            <div className="col-12">
              <StyledTitle className="mb-2">{formatMessage(commonMessages.label.referrer)}</StyledTitle>
            </div>
            <div className="col-12 col-lg-6">
              <Form.Item
                validateStatus={settings['payment.referrer.type'] === 'any' ? undefined : validateStatus}
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
                    onBlur={e => setReferrerEmail(e.target.value.trim())}
                  />
                </StyledInputWrapper>
              </Form.Item>
            </div>
          </div>
        </AdminCard>
      )}

      {cartProducts.length > 0 && totalPrice > 0 && enabledModules.referrer && (
        <AdminCard className="mb-3">
          <div className="mb-3">
            <DiscountSelectionCard check={check} value={discountId} onChange={setDiscountId} />
          </div>

          <div className="row" ref={referrerRef}>
            <div className="col-12">
              <StyledTitle className="mb-2">{formatMessage(commonMessages.label.referrer)}</StyledTitle>
            </div>
            <div className="col-12 col-lg-6">
              <Form.Item
                validateStatus={settings['payment.referrer.type'] === 'any' ? undefined : validateStatus}
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
                    onBlur={e => setReferrerEmail(e.target.value.trim())}
                  />
                </StyledInputWrapper>
              </Form.Item>
            </div>
          </div>
        </AdminCard>
      )}
      {settings['checkout.approvement'] === 'true' && (
        <AdminCard className="mb-3">
          <StyledCheckbox
            className="mr-2"
            size="lg"
            colorScheme="primary"
            isChecked={isApproved}
            onChange={() => setIsApproved(prev => !prev)}
          />
          <StyledLabel>
            {formatMessage(defineMessage({ id: 'checkoutMessages.ui.approved', defaultMessage: '我同意' }))}
          </StyledLabel>
          <StyledApprovementBox
            className="mt-2"
            dangerouslySetInnerHTML={{ __html: settings['checkout.approvement_content'] }}
          />
        </AdminCard>
      )}
      {renderTerms && (
        <div className="mb-3">
          <AdminCard>{renderTerms()}</AdminCard>
        </div>
      )}
      <div className="mb-3">
        <CheckoutCard
          isDisabled={isApproved === false}
          check={check}
          cartProducts={cartProducts}
          discountId={discountId}
          invoice={invoice}
          shipping={hasPhysicalProduct ? shipping : null}
          loading={orderChecking || orderPlacing}
          onCheckout={handleCheckoutAsync}
        />
      </div>
    </div>
  )
}

export default CheckoutBlock
