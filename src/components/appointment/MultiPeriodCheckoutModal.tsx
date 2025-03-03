import { gql, useQuery } from '@apollo/client'
import {
  Box,
  Button,
  Checkbox,
  Divider,
  OrderedList,
  Radio,
  RadioGroup,
  SkeletonText,
  Stack,
  useToast,
} from '@chakra-ui/react'
import axios from 'axios'
import { camelCase } from 'lodash'
import { CommonTitleMixin } from 'lodestar-app-element/src/components/common'
import ProductItem from 'lodestar-app-element/src/components/common/ProductItem'
import { BREAK_POINT } from 'lodestar-app-element/src/components/common/Responsive'
import CheckoutGroupBuyingForm, {
  StyledBlockTitle,
  StyledListItem,
} from 'lodestar-app-element/src/components/forms/CheckoutGroupBuyingForm'
import TapPayForm, { TPCreditCard } from 'lodestar-app-element/src/components/forms/TapPayForm'
import CheckoutProductReferrerInput from 'lodestar-app-element/src/components/inputs/CheckoutProductReferrerInput'
import ContactInfoInput from 'lodestar-app-element/src/components/inputs/ContactInfoInput'
import InvoiceInput, { validateInvoice } from 'lodestar-app-element/src/components/inputs/InvoiceInput'
import ShippingInput, { validateShipping } from 'lodestar-app-element/src/components/inputs/ShippingInput'
import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'
import CommonModal from 'lodestar-app-element/src/components/modals/CommonModal'
import GroupBuyingRuleModal from 'lodestar-app-element/src/components/modals/GroupBuyingRuleModal'
import { useMemberCreditCards } from 'lodestar-app-element/src/components/selectors/CreditCardSelector'
import PaymentSelector from 'lodestar-app-element/src/components/selectors/PaymentSelector'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import hasura from 'lodestar-app-element/src/hasura'
import { getTrackingCookie, notEmpty, validateContactInfo } from 'lodestar-app-element/src/helpers'
import { getConversionApiData } from 'lodestar-app-element/src/helpers/conversionApi'
import { checkoutMessages } from 'lodestar-app-element/src/helpers/translation'
import { useCheck } from 'lodestar-app-element/src/hooks/checkout'
import { useMemberValidation } from 'lodestar-app-element/src/hooks/common'
import { useCouponCollection } from 'lodestar-app-element/src/hooks/data'
import { useMember, useUpdateMemberMetadata } from 'lodestar-app-element/src/hooks/member'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import { getResourceByProductId, useTappay } from 'lodestar-app-element/src/hooks/util'
import {
  CheckProps,
  ContactInfo,
  CouponProps,
  InvoiceProps,
  PaymentProps,
  ShippingOptionIdType,
  ShippingProps,
} from 'lodestar-app-element/src/types/checkout'
import { ConversionApiContent, ConversionApiEvent } from 'lodestar-app-element/src/types/conversionApi'
import {
  anyPass,
  apply,
  ascend,
  chain,
  complement,
  converge,
  defaultTo,
  equals,
  filter,
  flip,
  head,
  identity,
  ifElse,
  includes,
  isEmpty,
  isNil,
  join,
  last,
  map,
  mergeLeft,
  path,
  pipe,
  pluck,
  prop,
  sort,
  sum,
  tap,
} from 'ramda'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import ReactPixel from 'react-facebook-pixel'
import ReactGA from 'react-ga'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { AuthModalContext } from '../../components/auth/AuthModal'
import { commonMessages } from '../../helpers/translation'
import { useEnrolledMembershipCardsWithDiscountInfo } from '../../hooks/card'
import { MembershipCardProps } from '../../types/checkout'
import { DiscountForOptimizer, DiscountUsageOptimizer, optimizerMap } from './discountOptimization'
import {
  availableDiscountGetterMap,
  discountAdaptorMapForMultiPeriod,
  optimizedResultToProductDetail,
  productAdaptorForMultiPeriod,
} from './discountUtilities'
import { useMuiltiPeriodProduct } from './muiltiPeriodDataFetcher'
import { CheckoutPeriodsModalProps, MultiPeriodProductDetail } from './MultiPeriod.type'
import DiscountSelectionCard from './MultiPeriodDiscountSelectionCard'
import appointmentMessages from './translation'

export const StyledTitle = styled.h1`
  ${CommonTitleMixin}
`
export const StyledSubTitle = styled.div`
  margin-bottom: 0.75rem;
  ${CommonTitleMixin}
`
export const StyledWarningText = styled.p`
  margin-top: 1.25rem;
  color: var(--gray-dark);
  font-size: 12px;
`
export const StyledCheckoutBlock = styled.div`
  color: var(--gray-darker);
  font-size: 14px;
  line-height: 1.71;
  letter-spacing: 0.4px;

  > div {
    margin-bottom: 0.75rem;

    > span:first-child {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
`
export const StyledCheckoutPrice = styled.div`
  color: ${props => props.theme['@primary-color']};
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 0.2px;
  text-align: right;
`

const StyledSubmitBlock = styled.div`
  @media (max-width: ${BREAK_POINT}px) {
    padding-bottom: 7rem;
  }
`

const StyledLabel = styled.span`
  font-weight: bold;
`

const StyledCheckbox = styled(Checkbox)`
  .chakra-checkbox__control {
    border: 1px solid #cdcece;
  }
`

const CheckoutProductItem: React.VFC<{
  name: string
  price: number
  currencyId?: string
  quantity?: number
  saleAmount?: number
  defaultProductId?: string
}> = ({ name, price, currencyId, quantity, saleAmount, defaultProductId }) => {
  const { formatMessage } = useIntl()
  return (
    <div className="d-flex align-items-center justify-content-between">
      <span className="flex-grow-1 mr-4">
        {name}
        {quantity && saleAmount && (
          <span>{` X${quantity} ${
            defaultProductId?.includes('MerchandiseSpec_')
              ? ''
              : `(${quantity * saleAmount} ${formatMessage(commonMessages.unit.piece)})`
          }`}</span>
        )}
      </span>

      <span className="flex-shrink-0">
        <PriceLabel listPrice={price} currencyId={currencyId} />
      </span>
    </div>
  )
}

const StyledApprovementBox = styled.div`
  padding-left: 46px;
`

const MultiPeriodCheckoutModal: React.VFC<CheckoutPeriodsModalProps> = ({
  defaultProductId,
  defaultProductDetails,
  warningText,
  isCheckOutModalOpen,
  onCheckOutModalOpen,
  onCheckOutModalClose,
  shippingMethods,
  isFieldsValidate,
  renderInvoice,
  renderTerms,
  setIsModalDisable,
  setIsOrderCheckLoading,
}) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const [isOpen, onOpen, onClose] = [isCheckOutModalOpen, onCheckOutModalOpen, onCheckOutModalClose]
  // const [checkoutProductId] = useQueryParam('checkoutProductId', StringParam)
  const { enabledModules, settings, id: appId, currencyId: appCurrencyId } = useApp()
  const { currentMemberId, isAuthenticating, authToken } = useAuth()
  const { member: currentMember } = useMember(currentMemberId || '')
  const { memberCreditCards } = useMemberCreditCards(currentMemberId || '')
  const app = useApp()

  const [productDetails, setProductDetails] = useState<Array<MultiPeriodProductDetail>>(defaultProductDetails)

  console.log('productDetails', productDetails)

  const sortProductDetailsByStartedAt: (
    productDetails: Array<MultiPeriodProductDetail>,
  ) => Array<MultiPeriodProductDetail> = sort(ascend(prop('startedAt')))

  const setProductDetailsOrderByStartedAt: (productDetails: MultiPeriodProductDetail[]) => void = pipe(
    sortProductDetailsByStartedAt,
    setProductDetails,
  )

  const sessionStorageKey = `lodestar.sharing_code.${defaultProductId}`
  const [sharingCode = window.sessionStorage.getItem(sessionStorageKey)] = useQueryParam('sharing', StringParam)
  sharingCode && window.sessionStorage.setItem(sessionStorageKey, sharingCode)

  const cachedCartInfo = useMemo<{
    shipping: ShippingProps | null
    invoice: InvoiceProps | null
    payment: PaymentProps | null
    contactInfo: ContactInfo | null
  }>(() => {
    const defaultCartInfo = {
      shipping: null,
      invoice: {
        name: currentMember?.name || '',
        phone: currentMember?.phone || '',
        email: currentMember?.email || '',
      },
      payment: null,
      contactInfo: {
        name: currentMember?.name || '',
        phone: currentMember?.phone || '',
        email: currentMember?.email || '',
      },
    }
    try {
      const cachedShipping = localStorage.getItem('kolable.cart.shipping')
      const cachedInvoice = localStorage.getItem('kolable.cart.invoice')
      const cachedPayment = localStorage.getItem('kolable.cart.payment.perpetual')
      cachedCartInfo.shipping = cachedShipping && JSON.parse(cachedShipping)
      cachedCartInfo.invoice = cachedInvoice && JSON.parse(cachedInvoice).value
      cachedCartInfo.payment = cachedPayment && JSON.parse(cachedPayment)
    } catch {}
    return defaultCartInfo
  }, [currentMember?.name, currentMember?.email, currentMember?.phone])

  // checkout
  const [productId, setProductId] = useState(defaultProductId)
  const { target: productTarget } = useMuiltiPeriodProduct({
    id: productId,
    startedAts: pluck('startedAt')(productDetails),
  })
  const { type, target } = getResourceByProductId(productId)
  const { resourceCollection } = useResourceCollection([`${appId}:${type}:${target}`])

  // tracking
  const tracking = useTracking()

  // cart information
  const memberCartInfo: {
    shipping?: ShippingProps | null
    invoice?: InvoiceProps | null
    payment?: PaymentProps | null
  } = {
    shipping: currentMember?.shipping,
    invoice: currentMember?.invoice,
    payment: currentMember?.payment,
  }

  const [shipping, setShipping] = useState<ShippingProps>({
    name: '',
    phone: '',
    address: '',
    shippingMethod: 'home-delivery',
    specification: '',
    storeId: '',
    storeName: '',
    ...memberCartInfo.shipping,
    ...cachedCartInfo.shipping,
  })
  const [invoice, setInvoice] = useState<InvoiceProps>({
    name: '',
    phone: '',
    email: currentMember?.email || '',
    ...memberCartInfo.invoice,
    ...cachedCartInfo.invoice,
  })

  const [payment, setPayment] = useState<PaymentProps | null | undefined>()
  const [isApproved, setIsApproved] = useState(localStorage.getItem('kolable.checkout.approvement') === 'true')

  // 讓「我同意」按鈕在使用者重新進入後保持一樣
  useEffect(() => {
    localStorage.setItem('kolable.checkout.approvement', JSON.stringify(isApproved))
    setIsApproved(localStorage.getItem('kolable.checkout.approvement') === 'true')
  }, [isApproved])

  useEffect(() => {
    if (currentMember) {
      setInvoice(prev => ({ ...prev, ...cachedCartInfo.invoice }))
    }
  }, [cachedCartInfo.invoice])

  const initialPayment = useMemo(
    () =>
      (productTarget?.isSubscription
        ? {
            gateway: settings['payment.subscription.default_gateway'] || 'tappay',
            method: 'credit',
          }
        : {
            gateway: settings['payment.perpetual.default_gateway'] || 'spgateway',
            method: settings['payment.perpetual.default_gateway_method'] || 'credit',
            ...memberCartInfo.payment,
            ...cachedCartInfo.payment,
          }) as PaymentProps,
    [productTarget?.isSubscription, settings, memberCartInfo.payment, cachedCartInfo.payment],
  )

  useEffect(() => {
    if (typeof productTarget?.isSubscription === 'boolean') {
      setPayment(initialPayment)
    }
  }, [productTarget?.isSubscription, initialPayment])

  const shippingRef = useRef<HTMLDivElement | null>(null)
  const invoiceRef = useRef<HTMLDivElement | null>(null)
  const referrerRef = useRef<HTMLDivElement | null>(null)
  const groupBuyingRef = useRef<HTMLDivElement | null>(null)
  const paymentMethodRef = useRef<HTMLDivElement | null>(null)
  const contactInfoRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (
      productTarget?.currencyId === 'LSC' &&
      defaultProductId !== undefined &&
      defaultProductId.includes('MerchandiseSpec_')
    ) {
      pipe(map((mergeLeft as any)({ discountId: 'Coin' })))(productDetails)
    }
  }, [productTarget, defaultProductId])

  const [groupBuying, setGroupBuying] = useState<{
    memberIds: string[]
    memberEmails: string[]
    withError: boolean
  }>({ memberIds: [], memberEmails: [], withError: false })

  const getEarliestStartedAt: (productDetails: Array<MultiPeriodProductDetail>) => Date = (pipe as any)(
    sort(ascend((prop as any)('startedAt'))),
    pluck('startedAt'),
    head,
  )
  const totalQuantity: (productDetails: Array<MultiPeriodProductDetail>) => number = (pipe as any)(
    pluck('quantity'),
    sum,
  )
  const sealNil: <T>(fn: (...args: any[]) => T) => (...args: any[]) => T | undefined = fn => ifElse(isNil, identity, fn)

  const getSafeTotalQuantity = pipe(sealNil<number>(totalQuantity), defaultTo(0))

  const shippingForSubmit = productTarget?.isPhysical
    ? shipping
    : productId.startsWith('MerchandiseSpec_')
    ? { address: currentMember?.email }
    : null

  const { totalPrice, check, orderChecking } = useCheck({
    productIds: [productId],
    discountId: productDetails[0]?.discountId ?? '',
    shipping: shippingForSubmit,
    options: {
      [productId]: {
        startedAt: sealNil(getEarliestStartedAt)(productTarget?.appointment_periods),
        from: window.location.pathname,
        sharingCode,
        groupBuyingPartnerIds: groupBuying.memberIds,
        groupBuyingPartnerEmails: groupBuying.memberEmails,
        quantity: getSafeTotalQuantity(productDetails),
      },
    },
  })

  const useChecks: (productDetail: MultiPeriodProductDetail) => {
    totalPrice: number
    check: CheckProps
    orderChecking: boolean
  } = productDetail => {
    const { totalPrice, check, orderChecking } = useCheck({
      productIds: [productId],
      discountId: productDetail?.discountId ?? '',
      shipping: shippingForSubmit,
      options: {
        [productId]: {
          startedAt: productDetail.startedAt,
          from: window.location.pathname,
          sharingCode,
          groupBuyingPartnerIds: groupBuying.memberIds,
          groupBuyingPartnerEmails: groupBuying.memberEmails,
          quantity: productDetail.quantity,
        },
      },
    })
    return { totalPrice, check, orderChecking }
  }

  const checkResults = map(useChecks)(productDetails)

  console.log('checkResults', checkResults)

  const { coupons, loadingCoupons } = useCouponCollection(currentMemberId ?? '')
  const couponsForProducts = filter(
    (pipe as any)(
      path(['couponCode', 'couponPlan', 'productIds']),
      anyPass([includes(defaultProductId), equals('AppointmentPlan'), isEmpty]),
    ),
  )(coupons) as Array<CouponProps>

  const { enrolledMembershipCardsWithDiscountOfProduct } = useEnrolledMembershipCardsWithDiscountInfo(
    currentMemberId ?? '',
    productId,
  )

  const [selectedDiscountOptimizerName, setSelectedDiscountOptimizerName] = useState<string>('customized')

  const { TPDirect } = useTappay()
  const toast = useToast()
  const [isValidating, setIsValidating] = useState(false)
  const [referrerEmail, setReferrerEmail] = useState('')
  const [tpCreditCard, setTpCreditCard] = useState<TPCreditCard | null>(null)
  const [errorContactFields, setErrorContactFields] = useState<string[]>([])
  const { memberId: referrerId, validateStatus: referrerStatus } = useMemberValidation(referrerEmail)
  const updateMemberMetadata = useUpdateMemberMetadata()
  const isCreditCardReady = Boolean(memberCreditCards.length > 0 || tpCreditCard?.canGetPrime)
  const [isCoinMerchandise, setIsCoinMerchandise] = useState(false)
  const [isCoinsEnough, setIsCoinsEnough] = useState(true)
  const { remainingCoins } = useMemberCoinsRemaining(currentMemberId || '')
  const [orderPlacing, setOrderPlacing] = useState(false)

  useEffect(() => {
    if (check.orderProducts.length === 0) {
      setIsOrderCheckLoading?.(true)
      setIsModalDisable?.(true)
    } else if (
      check.orderProducts.length === 1 &&
      check.orderProducts[0].options?.currencyId === 'LSC' &&
      check.orderProducts[0].productId.includes('MerchandiseSpec_')
    ) {
      setIsOrderCheckLoading?.(false)
      setIsCoinMerchandise(true)
      if (
        check.orderProducts[0].options?.currencyPrice !== undefined &&
        remainingCoins !== undefined &&
        productDetails !== undefined &&
        check.orderProducts[0].options.currencyPrice * getSafeTotalQuantity(productDetails) > remainingCoins
      ) {
        setIsCoinsEnough(false)
        setIsModalDisable?.(true)
      } else {
        setIsCoinsEnough(true)
        setIsModalDisable?.(false)
      }
    }
  }, [check, remainingCoins, setIsModalDisable, setIsOrderCheckLoading])

  useEffect(() => {
    if (isOpen) {
      const resource = resourceCollection.find(notEmpty)
      resource && tracking.addToCart(resource, { direct: true })
    }
  }, [isOpen])

  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)

  if (isAuthenticating) {
    setAuthModalVisible?.(true)
    return <></>
  }

  if (currentMember === null) {
    setAuthModalVisible?.(true)
    return <></>
  }

  if (productTarget === null || payment === undefined) {
    return <></>
  }

  if (loadingCoupons) return <></>

  const handleSubmit = async () => {
    !isValidating && setIsValidating(true)
    let isValidShipping = false
    let isValidInvoice = false

    if (isFieldsValidate) {
      ;({ isValidInvoice, isValidShipping } = isFieldsValidate({ invoice, shipping }))
    } else {
      isValidShipping = !productTarget.isPhysical || validateShipping(shipping)
      isValidInvoice = Number(settings['feature.invoice.disable'])
        ? true
        : Number(settings['feature.invoice_member_info_input.disable'])
        ? validateInvoice(invoice).filter(v => !['name', 'phone', 'email'].includes(v)).length === 0
        : validateInvoice(invoice).length === 0
    }

    if (totalPrice * getSafeTotalQuantity(productDetails) > 0 && payment === null) {
      paymentMethodRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    if (!isValidShipping) {
      shippingRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    } else if (
      (totalPrice * getSafeTotalQuantity(productDetails) > 0 || productTarget.discountDownPrice) &&
      !isValidInvoice
    ) {
      invoiceRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    if (referrerStatus === 'error') {
      referrerRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    if (referrerEmail && referrerStatus !== 'success') {
      if (referrerStatus === 'error') {
        referrerRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }
    if (groupBuying.withError) {
      groupBuyingRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    if (totalPrice * getSafeTotalQuantity(productDetails) <= 0 && settings['feature.contact_info.enabled'] === '1') {
      const errorFields = validateContactInfo(invoice)
      if (errorFields.length !== 0) {
        setErrorContactFields(errorFields)
        contactInfoRef.current?.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }

    if (!isCoinsEnough) {
      toast({
        title: formatMessage(checkoutMessages.message.notEnoughCoins),
        status: 'error',
        duration: 3000,
        position: 'top',
      })
      return
    }

    if (settings['tracking.fb_pixel_id']) {
      ReactPixel.track('AddToCart', {
        content_name: productTarget.title || productId,
        value: totalPrice,
        currency: 'TWD',
      })
    }

    if (
      settings['tracking.fb_conversion_api.pixel_id'] &&
      settings['tracking.fb_conversion_api.access_token'] &&
      enabledModules.fb_conversion_api
    ) {
      const contents: ConversionApiContent[] = [
        { id: productTarget.title || productId, quantity: getSafeTotalQuantity(productDetails) },
      ]
      const event: ConversionApiEvent = {
        sourceUrl: window.location.href,
        purchaseData: {
          currency: 'TWD',
          contentName: productTarget.title || productId,
          value: totalPrice,
        },
      }
      const { conversionApi } = getConversionApiData(currentMember, { contents, event })
      await conversionApi(authToken || '', 'AddToCart').catch(error => console.log(error))
    }

    if (settings['tracking.ga_id']) {
      ReactGA.plugin.execute('ec', 'addProduct', {
        id: productId,
        name: productTarget.title || productId,
        category: productId.split('_')[0] || 'Unknown',
        price: `${totalPrice}`,
        quantity: getSafeTotalQuantity(productDetails),
        currency: 'TWD',
      })
      ReactGA.plugin.execute('ec', 'setAction', 'add')
      ReactGA.ga('send', 'event', 'UX', 'click', 'add to cart')
    }

    // free subscription should bind card first
    if (
      productTarget.isSubscription &&
      totalPrice * getSafeTotalQuantity(productDetails) <= 0 &&
      memberCreditCards.length === 0
    ) {
      await new Promise((resolve, reject) => {
        const clientBackUrl = new URL(window.location.href)
        clientBackUrl.searchParams.append('checkoutProductId', productId)

        TPDirect.card.getPrime(({ status, card: { prime } }: { status: number; card: { prime: string } }) => {
          axios({
            method: 'POST',
            url: `${process.env.REACT_APP_API_BASE_ROOT}/payment/credit-cards`,
            withCredentials: true,
            data: {
              prime,
              cardHolder: {
                name: currentMember.name,
                email: currentMember.email,
                phoneNumber: currentMember.phone || '0987654321',
              },
              clientBackUrl,
            },
            headers: { authorization: `Bearer ${authToken}` },
          })
            .then(({ data: { code, result } }) => {
              if (code === 'SUCCESS') {
                resolve(result.memberCreditCardId)
              } else if (code === 'REDIRECT') {
                window.location.assign(result)
              }
              reject(code)
            })
            .catch(reject)
        })
      })
    }

    const placeOrder = async (
      discountId: string,
      paymentType: 'perpetual' | 'subscription' | 'groupBuying',
      invoice: InvoiceProps,
      options: { [ProductId: string]: any },
      payment?: PaymentProps | null,
    ) => {
      setOrderPlacing(true)
      const trackingCookie = getTrackingCookie()
      const trackingOptions = { ...trackingCookie }
      return axios
        .post<{
          code: string
          message: string
          result: {
            orderId: string
            totalAmount: number
            paymentNo: string | null
            payToken: string | null
            products: { name: string; price: number }[]
            discounts: { name: string; price: number }[]
          }
        }>(
          `${process.env.REACT_APP_API_BASE_ROOT}/order/create`,
          {
            clientBackUrl: window.location.origin,
            paymentModel: { type: paymentType, gateway: payment?.gateway, method: payment?.method },
            productIds: [productId],
            discountId,
            shipping: shippingForSubmit,
            invoice,
            options,
            tracking: trackingOptions,
          },
          {
            headers: { authorization: `Bearer ${authToken}` },
          },
        )
        .then(({ data: { code, result, message } }) => {
          if (code === 'SUCCESS') {
            ReactGA.plugin.execute('ec', 'setAction', 'checkout', { step: 4 })
            ReactGA.ga('send', 'pageview')
            return result
          } else {
            throw new Error(message)
          }
        })
        .finally(() => setOrderPlacing(false))
    }

    type placeOrderResult = {
      orderId: string
      totalAmount: number
      paymentNo: string | null
      payToken: string | null
      products: {
        name: string
        price: number
      }[]
      discounts: {
        name: string
        price: number
      }[]
    }

    const placeOrderResults: Array<placeOrderResult> = await Promise.all(
      productDetails.map(productDetail =>
        placeOrder(
          productDetail?.discountId ?? '',
          productTarget.isSubscription ? 'subscription' : 'perpetual',
          {
            ...invoice,
            referrerEmail: referrerEmail || undefined,
          },
          {
            [productId]: {
              ...check.orderProducts[0]?.options,
              startedAt: productDetail.startedAt,
              endedAt: productDetail.endedAt,
              quantity: 1,
              shipping,
            },
          },
          payment,
        ),
      ),
    )

    await updateMemberMetadata({
      variables: {
        memberId: currentMember.id,
        metadata: {
          invoice,
          shipping,
          payment,
        },
        memberPhones: invoice.phone ? [{ member_id: currentMember.id, phone: invoice.phone }] : [],
      },
    }).catch(() => {})

    const { orderId, paymentNo, payToken } = (pipe as any)(
      defaultTo([]),
      last,
      defaultTo({ orderId: undefined, paymentNo: undefined, payToken: undefined }),
    )(placeOrderResults)

    history.push(paymentNo ? `/payments/${paymentNo}?token=${payToken}` : `/orders/${orderId}?tracking=1`)
  }

  const getProductDetailsWithPrice: (
    productDetails: Array<MultiPeriodProductDetail>,
  ) => Array<MultiPeriodProductDetail & { price: number }> = mergeLeft({
    price: checkResults[0].check.orderProducts[0]?.price ?? 0,
  }) as any

  const optimizeDiscount =
    (productDetails: Array<MultiPeriodProductDetail>) =>
    (discounts: Array<{ type: string; data: Array<CouponProps | MembershipCardProps> }>) =>
    (optimizer: DiscountUsageOptimizer) => {
      const adaptedProducts = (pipe as any)(
        sortProductDetailsByStartedAt,
        map((pipe as any)(getProductDetailsWithPrice, productAdaptorForMultiPeriod)),
      )(productDetails)

      const adaptedDiscounts: Array<DiscountForOptimizer> = (chain as any)(
        pipe(
          converge(mergeLeft, [
            (converge as any)(apply, [pipe(prop('type'), flip(prop)(availableDiscountGetterMap)), prop('data')]),
            identity,
          ]),
          (converge as any)(map, [pipe(prop('type'), flip(prop)(discountAdaptorMapForMultiPeriod)), prop('data')]),
        ),
      )(discounts)

      const optimizedResult = optimizer(adaptedProducts)(adaptedDiscounts)
      optimizedResultToProductDetail(optimizedResult)(productDetails)
      return productDetails
    }

  const handleOptimizerChange =
    (productDetails: Array<MultiPeriodProductDetail>) =>
    (discounts: Array<{ type: string; data: Array<CouponProps | MembershipCardProps> }>) =>
      ifElse(
        equals('customized'),
        setSelectedDiscountOptimizerName,
        pipe(
          (tap as any)(setSelectedDiscountOptimizerName),
          flip(prop)(optimizerMap),
          optimizeDiscount(productDetails)(discounts) as any,
          setProductDetailsOrderByStartedAt,
        ),
      )

  return (
    <>
      <CommonModal
        title={<StyledTitle className="mb-4">{formatMessage(checkoutMessages.title.cart)}</StyledTitle>}
        isOpen={isOpen}
        isFullWidth
        onClose={() => {
          onClose()
          const resource = resourceCollection.filter(notEmpty).length > 0 && resourceCollection[0]
          resource && tracking.removeFromCart(resource, { quantity: getSafeTotalQuantity(productDetails) })
        }}
      >
        <div className="mb-4">
          <Stack
            direction="column"
            style={{
              padding: '2vmin',
              margin: '2vmin 0',
              borderRadius: '1vmin',
              boxShadow: '0 0 1vmin 0.5vmin rgba(0,0,0,0.1)',
            }}
          >
            <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
              {formatMessage(appointmentMessages.MultiPeriodCheckoutModal.discountMode)}
            </span>
            <Divider />
            <RadioGroup
              style={{ fontSize: '1em' }}
              defaultValue="customized"
              onChange={handleOptimizerChange(productDetails)([
                { type: 'coupon', data: couponsForProducts ?? [] },
                { type: 'membershipCard', data: enrolledMembershipCardsWithDiscountOfProduct ?? [] },
              ])}
              value={selectedDiscountOptimizerName}
            >
              <Stack direction="row" spacing="5vmin">
                <Radio value="customized">
                  {formatMessage(appointmentMessages.MultiPeriodCheckoutModal.manualSetting)}
                </Radio>
                <Radio value="greedy">
                  {formatMessage(appointmentMessages.MultiPeriodCheckoutModal.autoRecommendation)}
                </Radio>
              </Stack>
            </RadioGroup>
          </Stack>
          {map((period: MultiPeriodProductDetail) => (
            <>
              <ProductItem
                key={productId}
                id={productId}
                startedAt={period.startedAt}
                variant={
                  settings['custom.project.plan_price_style'] === 'hidden' && productId.startsWith('ProjectPlan_')
                    ? undefined
                    : 'checkout'
                }
                quantity={period.quantity}
              />
              <DiscountSelectionCard
                key={join('::')([productId, period.startedAt])}
                productId={productId}
                check={check}
                value={period?.discountId ?? ''}
                currentlyUsedDiscountIds={(pipe(map((prop as any)('discountId')), filter(complement(isNil))) as any)(
                  productDetails,
                )}
                onChange={discountId => {
                  period.discountId = discountId ?? ''
                  setSelectedDiscountOptimizerName('customized')
                  setProductDetailsOrderByStartedAt(productDetails)
                }}
              />
              <Divider style={{ margin: '2vh 0' }} />
            </>
          ))(productDetails)}
        </div>

        {settings['feature.contact_info.enabled'] === '1' && totalPrice === 0 && (
          <Box ref={contactInfoRef} mb="3">
            <ContactInfoInput value={invoice} onChange={v => setInvoice(v)} errorContactFields={errorContactFields} />
          </Box>
        )}

        {!!warningText && <StyledWarningText>{warningText}</StyledWarningText>}

        {productTarget.isPhysical && (
          <div ref={shippingRef}>
            <ShippingInput
              value={shipping}
              onChange={value => setShipping(value)}
              shippingMethods={shippingMethods}
              isValidating={isValidating}
            />
          </div>
        )}

        {enabledModules.group_buying && !!productTarget.groupBuyingPeople && productTarget.groupBuyingPeople > 1 && (
          <div ref={groupBuyingRef}>
            <StyledBlockTitle className="mb-3">{formatMessage(checkoutMessages.label.groupBuying)}</StyledBlockTitle>
            <OrderedList className="mb-4">
              <StyledListItem>{formatMessage(checkoutMessages.text.groupBuyingDescription1)}</StyledListItem>
              <StyledListItem style={{ color: 'var(--error)', fontWeight: 'bolder' }}>
                {formatMessage(checkoutMessages.text.groupBuyingDescription2, {
                  appName: app.name,
                  warning: <span>{formatMessage(checkoutMessages.text.groupBuyingDescriptionComfirmWarning)}</span>,
                })}
              </StyledListItem>
              <StyledListItem>{formatMessage(checkoutMessages.text.groupBuyingDescription3)}</StyledListItem>
              <StyledListItem>
                {formatMessage(checkoutMessages.text.groupBuyingDescription4, { modal: <GroupBuyingRuleModal /> })}
              </StyledListItem>
            </OrderedList>
            <CheckoutGroupBuyingForm
              title={productTarget.title || ''}
              partnerCount={productTarget.groupBuyingPeople - 1}
              onChange={value => setGroupBuying(value)}
            />
          </div>
        )}

        {totalPrice * getSafeTotalQuantity(productDetails) > 0 && productTarget.isSubscription === false && (
          <div className="mb-5" ref={paymentMethodRef}>
            <PaymentSelector value={payment} onChange={v => setPayment(v)} isValidating={isValidating} />
          </div>
        )}

        {totalPrice * getSafeTotalQuantity(productDetails) <= 0 && productTarget.isSubscription && (
          <>
            {memberCreditCards[0]?.cardInfo?.['last_four'] ? (
              <Box borderWidth="1px" borderRadius="lg" w="100%" p={4}>
                <span>
                  {formatMessage(checkoutMessages.label.creditLastFour)}：{memberCreditCards[0].cardInfo['last_four']}
                </span>
              </Box>
            ) : (
              <TapPayForm onUpdate={setTpCreditCard} />
            )}
          </>
        )}
        {((totalPrice > 0 && productTarget?.currencyId !== 'LSC' && productTarget.productType !== 'MerchandiseSpec') ||
          productTarget.discountDownPrice) && (
          <>
            <div ref={invoiceRef} className="mb-5">
              {renderInvoice?.({ invoice, setInvoice, isValidating }) ||
                (settings['feature.invoice.disable'] !== '1' && (
                  <InvoiceInput
                    value={invoice}
                    onChange={value => setInvoice(value)}
                    isValidating={isValidating}
                    shouldSameToShippingCheckboxDisplay={productTarget.isPhysical}
                  />
                ))}
            </div>
          </>
        )}

        {enabledModules.referrer && productTarget.currencyId !== undefined && productTarget.currencyId !== 'LSC' && (
          <div className="row mb-3" ref={referrerRef}>
            <div className="col-12">
              <StyledTitle className="mb-2">{formatMessage(commonMessages.label.referrer)}</StyledTitle>
            </div>
            <div className="col-12 col-lg-6">
              <CheckoutProductReferrerInput
                referrerId={referrerId}
                referrerStatus={referrerStatus}
                onEmailSet={email => setReferrerEmail(email)}
              />
            </div>
          </div>
        )}
        {settings['checkout.approvement'] === 'true' && (
          <div className="my-4">
            <StyledCheckbox
              className="mr-2"
              size="lg"
              colorScheme="primary"
              isChecked={isApproved}
              onChange={() => setIsApproved(prev => !prev)}
            />
            <StyledLabel>{formatMessage(checkoutMessages.label.approved)}</StyledLabel>
            <StyledApprovementBox
              className="mt-2"
              dangerouslySetInnerHTML={{ __html: settings['checkout.approvement_content'] }}
            />
          </div>
        )}
        <Divider className="mb-3" />
        {renderTerms && (
          <StyledCheckoutBlock className="mb-5">
            <div className="mb-2">{renderTerms()}</div>
          </StyledCheckoutBlock>
        )}
        {settings['custom.project.plan_price_style'] === 'hidden' &&
        productId.startsWith('ProjectPlan_') ? null : orderChecking ? (
          <SkeletonText noOfLines={4} spacing="5" />
        ) : (
          <>
            <StyledCheckoutBlock className="mb-5">
              {check.orderProducts.map(orderProduct => (
                <CheckoutProductItem
                  key={orderProduct.name}
                  name={orderProduct.name}
                  price={
                    (orderProduct.productId.includes('MerchandiseSpec_') && orderProduct.options?.currencyId === 'LSC'
                      ? orderProduct.options.currencyPrice || orderProduct.price
                      : orderProduct.price) * getSafeTotalQuantity(productDetails)
                  }
                  quantity={getSafeTotalQuantity(productDetails)}
                  saleAmount={Number(orderProduct.options?.amount || 1) / getSafeTotalQuantity(productDetails)}
                  defaultProductId={defaultProductId}
                  currencyId={orderProduct.options?.currencyId || appCurrencyId}
                />
              ))}

              {checkResults.map(result => {
                return result.check.orderDiscounts.map((orderDiscount, idx) => {
                  return (
                    <CheckoutProductItem
                      key={orderDiscount.name}
                      name={orderDiscount.name}
                      price={
                        check.orderProducts[0]?.productId.includes('MerchandiseSpec_') &&
                        check.orderProducts[0].options?.currencyId === 'LSC'
                          ? -orderDiscount.options?.coins
                          : -orderDiscount.price
                      }
                      currencyId={productTarget.currencyId}
                    />
                  )
                })
              })}
              {check.shippingOption && (
                <CheckoutProductItem
                  name={formatMessage(
                    checkoutMessages.shipping[camelCase(check.shippingOption.id) as ShippingOptionIdType],
                  )}
                  price={check.shippingOption.fee}
                />
              )}
            </StyledCheckoutBlock>
            <StyledCheckoutPrice className="mb-3">
              {!isCoinMerchandise || isCoinsEnough ? (
                <PriceLabel listPrice={(pipe(map((prop as any)('totalPrice')), sum) as any)(checkResults)} />
              ) : (
                `${settings['coin.unit'] || check.orderProducts[0].options?.currencyId} ${formatMessage(
                  checkoutMessages.message.notEnough,
                )}`
              )}
            </StyledCheckoutPrice>
          </>
        )}

        <StyledSubmitBlock className="text-right">
          <Button
            variant="outline"
            onClick={() => {
              onClose()
              const resource = resourceCollection.filter(notEmpty).length > 0 && resourceCollection[0]
              resource && tracking.removeFromCart(resource)
            }}
            className="mr-3"
          >
            {formatMessage(commonMessages.ui.cancel)}
          </Button>
          <Button
            colorScheme="primary"
            isLoading={orderPlacing}
            onClick={handleSubmit}
            disabled={
              (totalPrice === 0 && productTarget.isSubscription && !isCreditCardReady) ||
              (settings['checkout.approvement'] === 'true' && isApproved === false) ||
              !isCoinsEnough
            }
          >
            {productTarget.isSubscription
              ? formatMessage(commonMessages.button.subscribeNow)
              : formatMessage(checkoutMessages.button.cartSubmit)}
          </Button>
        </StyledSubmitBlock>
      </CommonModal>
    </>
  )
}

const useMemberCoinsRemaining = (memberId: string) => {
  const { loading, error, data } = useQuery<
    hasura.GET_MEMBER_COIN_REMAINING,
    hasura.GET_MEMBER_COIN_REMAININGVariables
  >(
    gql`
      query GET_MEMBER_COIN_REMAINING($memberId: String!) {
        coin_status(where: { member_id: { _eq: $memberId } }) {
          remaining
        }
      }
    `,
    {
      variables: { memberId },
    },
  )
  const remainingCoins = data?.coin_status.reduce((total, coin) => {
    return (total += coin.remaining)
  }, 0)
  return { remainingCoins }
}

export default MultiPeriodCheckoutModal
