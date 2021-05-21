import { Button, Divider } from '@chakra-ui/react'
import { Form, Input, Skeleton } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { ModalProps } from 'antd/lib/modal'
import { camelCase } from 'lodash'
import React, { useRef, useState } from 'react'
import ReactPixel from 'react-facebook-pixel'
import ReactGA from 'react-ga'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { StringParam, useQueryParam } from 'use-query-params'
import { useAuth } from '../../components/auth/AuthContext'
import DiscountSelectionCard from '../../components/checkout/DiscountSelectionCard'
import InvoiceInput, { InvoiceProps, validateInvoice } from '../../components/checkout/InvoiceInput'
import ShippingInput, { ShippingProps, validateShipping } from '../../components/checkout/ShippingInput'
import PriceLabel from '../../components/common/PriceLabel'
import ProductItem from '../../components/common/ProductItem'
import { checkoutMessages, commonMessages } from '../../helpers/translation'
import { useCheck } from '../../hooks/checkout'
import { useReferrer, useSimpleProduct } from '../../hooks/common'
import { useUpdateMemberMetadata } from '../../hooks/member'
import { shippingOptionIdProps } from '../../types/checkout'
import { MemberProps } from '../../types/member'
import { ShippingMethodProps } from '../../types/merchandise'
import { useApp } from '../common/AppContext'
import {
  StyledCheckoutBlock,
  StyledCheckoutPrice,
  StyledModal,
  StyledTitle,
  StyledWarningText,
  StyledWrapper,
} from './CheckoutProductModal.styled'

const CheckoutProductItem: React.VFC<{
  name: string
  price: number
}> = ({ name, price }) => {
  const { currencyId: appCurrencyId } = useApp()

  return (
    <div className="d-flex align-items-center justify-content-between">
      <span className="flex-grow-1 mr-4">{name}</span>
      <span className="flex-shrink-0">
        <PriceLabel listPrice={price} currencyId={appCurrencyId} />
      </span>
    </div>
  )
}

export type CheckoutProductModalProps = FormComponentProps &
  ModalProps & {
    renderTrigger: React.VFC<{
      setVisible: () => void
    }>
    renderProductSelector?: (options: {
      productId: string
      onProductChange: (productId: string) => void
    }) => JSX.Element
    paymentType: 'perpetual' | 'subscription'
    defaultProductId?: string
    isProductPhysical?: boolean
    warningText?: string
    startedAt?: Date
    member: MemberProps | null
    shippingMethods?: ShippingMethodProps[]
  }
const CheckoutProductModal: React.FC<CheckoutProductModalProps> = ({
  form,
  renderTrigger,
  renderProductSelector,
  paymentType,
  defaultProductId,
  isProductPhysical,
  warningText,
  startedAt,
  member,
  shippingMethods,
  ...modalProps
}) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const [sharingCode] = useQueryParam('sharing', StringParam)
  const { currentMemberId } = useAuth()
  const { enabledModules, settings } = useApp()
  const updateMemberMetadata = useUpdateMemberMetadata()

  const [visible, setVisible] = useState(false)

  // payment information
  const cachedPaymentInfor: {
    shipping: ShippingProps
    invoice: InvoiceProps
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
  }

  try {
    const cachedShipping = localStorage.getItem('kolable.cart.shipping')
    const cachedInvoice = localStorage.getItem('kolable.cart.invoice')

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
  } catch {}

  const shippingRef = useRef<HTMLDivElement | null>(null)
  const invoiceRef = useRef<HTMLDivElement | null>(null)
  const referrerRef = useRef<HTMLDivElement | null>(null)

  const [shipping, setShipping] = useState<ShippingProps>(cachedPaymentInfor.shipping)
  const [invoice, setInvoice] = useState<InvoiceProps>(cachedPaymentInfor.invoice)
  const [isValidating, setIsValidating] = useState(false)
  const [referrerEmail, setReferrerEmail] = useState('')

  const { loadingReferrerId, referrerId } = useReferrer(referrerEmail)
  const referrerStatus: 'success' | 'error' | 'validating' | undefined = !referrerEmail
    ? undefined
    : loadingReferrerId
    ? 'validating'
    : !referrerId || referrerId === currentMemberId
    ? 'error'
    : 'success'

  // checkout
  const [productId, setProductId] = useState<string>(defaultProductId || '')
  const { target } = useSimpleProduct({ id: productId, startedAt })

  const { check, orderPlacing, orderChecking, placeOrder, totalPrice } = useCheck(
    [productId],
    form.getFieldValue('discountId'),
    isProductPhysical ? shipping : productId.startsWith('MerchandiseSpec_') ? { address: member?.email } : null,
    {
      [productId]: {
        startedAt,
        from: window.location.pathname,
        sharingCode,
      },
    },
  )

  const handleSubmit = () => {
    form.validateFieldsAndScroll(async errors => {
      if (errors || !member) {
        return
      }

      !isValidating && setIsValidating(true)
      const isValidShipping = !isProductPhysical || validateShipping(shipping)
      const isValidInvoice = validateInvoice(invoice).length === 0

      if (!isValidShipping) {
        shippingRef.current?.scrollIntoView({ behavior: 'smooth' })
        return
      } else if (!isValidInvoice) {
        invoiceRef.current?.scrollIntoView({ behavior: 'smooth' })
        return
      }
      if (referrerEmail && referrerStatus !== 'success') {
        if (referrerStatus === 'error') {
          referrerRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
        return
      }

      if (settings['tracking.fb_pixel_id']) {
        ReactPixel.track('AddToCart', {
          value: totalPrice,
          currency: 'TWD',
        })
      }

      if (settings['tracking.ga_id']) {
        ReactGA.plugin.execute('ec', 'addProduct', {
          id: productId,
          name: target?.title || productId,
          category: productId.split('_')[0] || 'Unknown',
          price: `${totalPrice}`,
          quantity: '1',
          currency: 'TWD',
        })
        ReactGA.plugin.execute('ec', 'setAction', 'add')
        ReactGA.ga('send', 'event', 'UX', 'click', 'add to cart')
      }

      const taskId = await placeOrder(paymentType, {
        ...invoice,
        referrerEmail: referrerEmail || undefined,
      })

      await updateMemberMetadata({
        variables: {
          memberId: member.id,
          metadata: {
            ...member.metadata,
            invoice,
            shipping: isProductPhysical ? shipping : undefined,
          },
        },
      })
      history.push(`/tasks/order/${taskId}`)
    })
  }

  return (
    <>
      {renderTrigger({ setVisible: () => setVisible(true) })}

      <StyledModal
        title={null}
        footer={null}
        width="100%"
        visible={visible}
        onCancel={() => setVisible(false)}
        {...modalProps}
      >
        <StyledTitle className="mb-4">{formatMessage(checkoutMessages.title.cart)}</StyledTitle>

        <StyledWrapper>
          <div className="mb-5">
            <ProductItem
              id={productId}
              startedAt={startedAt}
              variant={
                settings['custom.project.plan_price_style'] === 'hidden' && productId.startsWith('ProjectPlan_')
                  ? undefined
                  : 'checkout'
              }
            />
          </div>

          <Form
            onSubmit={e => {
              e.preventDefault()
              handleSubmit()
            }}
          >
            {renderProductSelector && (
              <div className="mb-5">
                {renderProductSelector({ productId, onProductChange: productId => setProductId(productId) })}
              </div>
            )}

            {!!warningText && <StyledWarningText>{warningText}</StyledWarningText>}

            {isProductPhysical && (
              <div ref={shippingRef}>
                <ShippingInput
                  value={shipping}
                  onChange={value => setShipping(value)}
                  shippingMethods={shippingMethods}
                  isValidating={isValidating}
                />
              </div>
            )}

            <div ref={invoiceRef} className="mb-5">
              <InvoiceInput
                value={invoice}
                onChange={value => setInvoice(value)}
                isValidating={isValidating}
                shouldSameToShippingCheckboxDisplay={isProductPhysical}
              />
            </div>

            <div className="mb-3">{form.getFieldDecorator('discountId')(<DiscountSelectionCard check={check} />)}</div>

            {enabledModules.referrer && (
              <div className="row" ref={referrerRef}>
                <div className="col-12">
                  <StyledTitle className="mb-2">{formatMessage(commonMessages.label.referrer)}</StyledTitle>
                </div>
                <div className="col-12 col-lg-6">
                  <Form.Item
                    validateStatus={referrerStatus}
                    hasFeedback
                    help={
                      referrerStatus === 'error'
                        ? referrerId === currentMemberId
                          ? formatMessage(commonMessages.text.selfReferringIsNotAllowed)
                          : formatMessage(commonMessages.text.notFoundReferrerEmail)
                        : undefined
                    }
                  >
                    <Input
                      placeholder={formatMessage(commonMessages.form.placeholder.referrerEmail)}
                      onBlur={e => setReferrerEmail(e.target.value)}
                    />
                  </Form.Item>
                </div>
              </div>
            )}

            <Divider className="mb-3" />

            {settings['custom.project.plan_price_style'] === 'hidden' &&
            productId.startsWith('ProjectPlan_') ? null : orderChecking ? (
              <Skeleton active />
            ) : (
              <>
                <StyledCheckoutBlock className="mb-5">
                  {check.orderProducts.map(orderProduct => (
                    <CheckoutProductItem key={orderProduct.name} name={orderProduct.name} price={orderProduct.price} />
                  ))}

                  {check.orderDiscounts.map(orderDiscount => (
                    <CheckoutProductItem
                      key={orderDiscount.name}
                      name={orderDiscount.name}
                      price={orderDiscount.price}
                    />
                  ))}

                  {check.shippingOption && (
                    <CheckoutProductItem
                      name={formatMessage(
                        checkoutMessages.shipping[camelCase(check.shippingOption.id) as shippingOptionIdProps],
                      )}
                      price={check.shippingOption.fee}
                    />
                  )}
                </StyledCheckoutBlock>
                <StyledCheckoutPrice className="mb-3">
                  <PriceLabel listPrice={totalPrice} />
                </StyledCheckoutPrice>
              </>
            )}

            <div className="text-right">
              <Button variant="outline" onClick={() => setVisible(false)} className="mr-3">
                {formatMessage(commonMessages.ui.cancel)}
              </Button>
              <Button colorScheme="primary" loading={orderPlacing} htmlType="submit">
                {paymentType === 'subscription'
                  ? formatMessage(checkoutMessages.button.cartSubmit)
                  : formatMessage(commonMessages.button.purchase)}
              </Button>
            </div>
          </Form>
        </StyledWrapper>
      </StyledModal>
    </>
  )
}

export default Form.create<CheckoutProductModalProps>()(CheckoutProductModal)
