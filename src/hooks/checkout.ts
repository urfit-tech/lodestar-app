import { gql, useQuery } from '@apollo/client'
import Axios from 'axios'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { notEmpty } from 'lodestar-app-element/src/helpers'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import { getResourceByProductId } from 'lodestar-app-element/src/hooks/util'
import { PaymentProps } from 'lodestar-app-element/src/types/checkout'
import { ConversionApiData } from 'lodestar-app-element/src/types/conversionApi'
import { prop, sum } from 'ramda'
import { useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import hasura from '../hasura'
import { getTrackingCookie } from '../helpers'
import {
  CheckProps,
  InvoiceProps,
  OrderDiscountProps,
  OrderProductProps,
  ShippingOptionProps,
  ShippingProps,
} from '../types/checkout'
import { MemberShopProps } from '../types/merchandise'
import { fetchCurrentGeolocation } from './util'

export const useCheck = ({
  productIds,
  discountId,
  shipping,
  options,
}: {
  productIds: string[]
  discountId: string | null
  shipping: ShippingProps | null
  options: { [ProductId: string]: any }
}) => {
  const tracking = useTracking()
  const { authToken } = useAuth()
  const { id: appId, enabledModules, settings } = useApp()
  const [check, setCheck] = useState<CheckProps>({
    orderProducts: [],
    orderDiscounts: [],
    shippingOption: null,
  })
  const [orderChecking, setOrderChecking] = useState(false)
  const [orderPlacing, setOrderPlacing] = useState(false)
  const [checkError, setCheckError] = useState<Error | null>(null)
  const { resourceCollection } = useResourceCollection(
    productIds.map(
      productId => `${appId}:${getResourceByProductId(productId).type}:${getResourceByProductId(productId).target}`,
    ),
  )

  const { coupon } = useCoupon(discountId?.split('_')[0] === 'Coupon' ? discountId?.split('_')[1] : '')

  useEffect(() => {
    setOrderChecking(true)
    Axios.post<{
      code: string
      message: string
      result: {
        orderProducts: OrderProductProps[]
        orderDiscounts: OrderDiscountProps[]
        shippingOption: ShippingOptionProps
      }
    }>(
      `${process.env.REACT_APP_API_BASE_ROOT}/payment/checkout-order`,
      {
        appId,
        productIds,
        discountId,
        shipping,
        options,
      },
      {
        headers: { authorization: `Bearer ${authToken}` },
      },
    )
      .then(({ data: { code, message, result } }) => {
        if (code === 'SUCCESS') {
          setCheck(result)
        } else {
          setCheckError(new Error(message))
        }
      })
      .catch(setCheckError)
      .finally(() => setOrderChecking(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    appId,
    authToken,
    discountId,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(productIds),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(shipping),
  ])

  const placeOrder = async (
    paymentType: 'perpetual' | 'subscription' | 'groupBuying',
    invoice: InvoiceProps,
    payment?: PaymentProps | null,
    conversionApiData?: ConversionApiData,
  ) => {
    setOrderPlacing(true)
    const { ip, country, countryCode } = await fetchCurrentGeolocation()
    const trackingCookie = getTrackingCookie()
    const trackingOptions = { ...trackingCookie }
    if (
      settings['tracking.fb_conversion_api.pixel_id'] &&
      settings['tracking.fb_conversion_api.access_token'] &&
      enabledModules.fb_conversion_api
    )
      Object.assign(trackingOptions, { fb: conversionApiData })

    ReactGA.plugin.execute('ec', 'setAction', 'checkout', { step: 4 })
    tracking.checkout(resourceCollection.filter(notEmpty), coupon)
    const {
      data: { code, message, result },
    } = await Axios.post<{
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
        productIds,
        discountId,
        shipping,
        invoice,
        geolocation: { ip: ip || '', country: country || '', countryCode: countryCode || '' },
        options,
        tracking: trackingOptions,
      },
      {
        headers: { authorization: `Bearer ${authToken}` },
      },
    )
    if (code === 'SUCCESS') {
      return result
    } else {
      throw new Error('create order failed: ' + message)
    }
  }

  const totalPrice =
    sum(check.orderProducts.map(prop('price'))) -
    sum(check.orderDiscounts.map(prop('price'))) +
    (check.shippingOption?.fee || 0)

  return {
    check,
    checkError,
    orderPlacing,
    orderChecking,
    placeOrder,
    totalPrice: Math.max(totalPrice, 0),
  }
}

export const useOrderProduct = (orderProductId: string) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_ORDER_PRODUCT, hasura.GET_ORDER_PRODUCTVariables>(
    gql`
      query GET_ORDER_PRODUCT($orderProductId: uuid!) {
        order_product_by_pk(id: $orderProductId) {
          id
          name
          description
          created_at
          product {
            id
            type
            target
          }
          order_log {
            id
            member_id
            invoice_options
          }
        }
      }
    `,
    { variables: { orderProductId } },
  )

  const orderProduct: {
    id: string
    name: string
    description: string
    createAt: Date | null
    product: {
      id: string
      type: string
      target: string
    }
    memberId: string
    invoice: any
  } =
    loading || error || !data || !data.order_product_by_pk
      ? {
          id: '',
          name: '',
          description: '',
          createAt: null,
          product: {
            id: '',
            type: '',
            target: '',
          },
          memberId: '',
          invoice: {},
        }
      : {
          id: data.order_product_by_pk.id,
          name: data.order_product_by_pk.name,
          description: data.order_product_by_pk.description || '',
          createAt: new Date(data.order_product_by_pk.created_at),
          product: data.order_product_by_pk.product,
          memberId: data.order_product_by_pk.order_log.member_id,
          invoice: data.order_product_by_pk.order_log.invoice_options,
        }

  return {
    loadingOrderProduct: loading,
    errorOrderProduct: error,
    orderProduct,
    refetchOrderProduct: refetch,
  }
}

export const useMemberShop = (id: string) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_MEMBER_SHOP, hasura.GET_MEMBER_SHOPVariables>(
    gql`
      query GET_MEMBER_SHOP($shopId: uuid!) {
        member_shop_by_pk(id: $shopId) {
          id
          title
          shipping_methods
          member {
            id
            picture_url
          }
        }
      }
    `,
    { variables: { shopId: id } },
  )

  const memberShop: MemberShopProps | null =
    loading || error || !data || !data.member_shop_by_pk
      ? null
      : {
          id: data.member_shop_by_pk.id,
          title: data.member_shop_by_pk.title,
          shippingMethods: data.member_shop_by_pk.shipping_methods,
          pictureUrl: data.member_shop_by_pk.member?.picture_url || null,
        }

  return {
    loadingMemberShop: loading,
    errorMemberShop: error,
    memberShop,
    refetchMemberShop: refetch,
  }
}

export const useCartProjectPlanCollection = (cartProjectPlanIds: string[]) => {
  const { loading, error, data } = useQuery<
    hasura.GET_CART_PROJECT_PLAN_COLLECTION,
    hasura.GET_CART_PROJECT_PLAN_COLLECTIONVariables
  >(
    gql`
      query GET_CART_PROJECT_PLAN_COLLECTION($cartProjectPlanIds: [uuid!]!) {
        project_plan(where: { id: { _in: $cartProjectPlanIds } }) {
          id
          is_physical
        }
      }
    `,
    {
      variables: {
        cartProjectPlanIds,
      },
    },
  )

  const cartProjectPlans =
    loading || error || !data
      ? []
      : data.project_plan.map(projectPlan => ({
          id: projectPlan.id,
          isPhysical: projectPlan.is_physical,
        }))

  return {
    loading,
    error,
    cartProjectPlans,
  }
}

export const usePhysicalProductCollection = (productIds: string[]) => {
  const { loading, error, data } = useQuery<hasura.GET_PHYSICAL_PRODUCTS, hasura.GET_PHYSICAL_PRODUCTSVariables>(
    gql`
      query GET_PHYSICAL_PRODUCTS($productIds: [uuid!]!) {
        project_plan_aggregate(where: { id: { _in: $productIds }, is_physical: { _eq: true } }) {
          aggregate {
            count
          }
        }
        merchandise_spec_aggregate(where: { id: { _in: $productIds }, merchandise: { is_physical: { _eq: true } } }) {
          aggregate {
            count
          }
        }
      }
    `,
    {
      variables: {
        productIds,
      },
    },
  )

  const hasPhysicalProduct =
    loading || error || !data
      ? false
      : !!data?.project_plan_aggregate?.aggregate?.count || !!data?.merchandise_spec_aggregate?.aggregate?.count

  return {
    loading,
    error,
    hasPhysicalProduct,
  }
}

export const useCoupon = (couponId: string) => {
  const { loading, error, data } = useQuery<hasura.GetCoupon, hasura.GetCouponVariables>(
    gql`
      query GetCoupon($couponId: uuid!) {
        coupon_by_pk(id: $couponId) {
          id
          coupon_code {
            id
            coupon_plan {
              id
              title
              amount
            }
          }
        }
      }
    `,
    { variables: { couponId } },
  )
  const coupon = data?.coupon_by_pk
    ? {
        id: data?.coupon_by_pk.id,
        title: data?.coupon_by_pk.coupon_code.coupon_plan.title,
        amount: data?.coupon_by_pk.coupon_code.coupon_plan.amount,
      }
    : null

  return {
    loading,
    error,
    coupon,
  }
}
