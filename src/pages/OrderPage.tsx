import { useQuery } from '@apollo/react-hooks'
import { Button, Icon, Typography } from 'antd'
import gql from 'graphql-tag'
import React, { useEffect } from 'react'
import ReactPixel from 'react-facebook-pixel'
import ReactGA from 'react-ga'
import { useIntl } from 'react-intl'
import { Link, useParams } from 'react-router-dom'
import { BooleanParam, useQueryParam } from 'use-query-params'
import AdminCard from '../components/common/AdminCard'
import DefaultLayout from '../components/layout/DefaultLayout'
import { useApp } from '../containers/common/AppContext'
import { commonMessages } from '../helpers/translation'
import * as types from '../types'
import ForbiddenPage from './ForbiddenPage'
import LoadingPage from './LoadingPage'

const OrderPage: React.FC = () => {
  const { formatMessage } = useIntl()
  const { orderId } = useParams<{ orderId: string }>()
  const [withTracking] = useQueryParam('tracking', BooleanParam)
  const { settings } = useApp()
  const { loading, data } = useQuery<types.GET_ORDERS_PRODUCT, types.GET_ORDERS_PRODUCTVariables>(GET_ORDERS_PRODUCT, {
    variables: { orderId: orderId },
  })
  const order = data && data.order_log_by_pk

  // TODO: get orderId and show items

  useEffect(() => {
    if (order && withTracking) {
      const productPrice = order.order_products_aggregate?.aggregate?.sum?.price || 0
      const discountPrice = order.order_discounts_aggregate?.aggregate?.sum?.price || 0
      const shippingFee = (order.shipping && order.shipping['fee']) || 0
      settings['tracking.fb_pixel_id'] &&
        order.order_status?.status === 'SUCCESS' &&
        ReactPixel.track('Purchase', {
          value: productPrice - discountPrice - shippingFee,
          currency: 'TWD',
        })
      if (settings['tracking.ga_id'] && order.order_status?.status === 'SUCCESS') {
        ;(window as any).dataLayer = (window as any).dataLayer || []
        ;(window as any).dataLayer.push({
          transactionId: order.id,
          transactionTotal: productPrice - discountPrice - shippingFee,
          transactionShipping: shippingFee,
          transactionProducts: order.order_products.map(order_product => {
            const [productType, productId] = order_product.product_id.split('_')
            return {
              sku: productId,
              name: order_product.name,
              category: productType,
              price: `${order_product.price}`,
              quantity: `${order_product.options ? order_product.options['quantity'] || 1 : 1}`,
              currency: 'TWD',
            }
          }),
        })
        ReactGA.plugin.execute('ecommerce', 'addTransaction', {
          id: order.id,
          revenue: productPrice - discountPrice - shippingFee,
          shipping: shippingFee,
        })
        for (let order_product of order.order_products) {
          const [productType, productId] = order_product.product_id.split('_')
          ReactGA.plugin.execute('ecommerce', 'addItem', {
            id: order.id,
            sku: productId,
            name: order_product.name,
            category: productType,
            price: `${order_product.price}`,
            quantity: `${order_product.options ? order_product.options['quantity'] || 1 : 1}`,
            currency: 'TWD',
          })
          ReactGA.plugin.execute('ec', 'addProduct', {
            id: productId,
            name: order_product.name,
            category: productType,
            price: `${order_product.price}`,
            quantity: `${order_product.options ? order_product.options['quantity'] || 1 : 1}`,
            currency: 'TWD',
          })
        }
        ReactGA.plugin.execute('ec', 'setAction', 'purchase', {
          id: order.id,
          revenue: productPrice - discountPrice - shippingFee,
          shipping: shippingFee,
          coupon:
            order.order_discounts.length > 0
              ? order.order_discounts[0].type === 'Coupon'
                ? order.order_discounts[0].target
                : null
              : null,
        })
        ReactGA.plugin.execute('ecommerce', 'send', {})
        ReactGA.plugin.execute('ecommerce', 'clear', {})

        ReactGA.ga('send', 'pageview')
      }
    }
  }, [orderId, order, withTracking, settings])

  if (loading) {
    return <LoadingPage />
  }
  if (!data?.order_log_by_pk) {
    return <ForbiddenPage />
  }

  return (
    <DefaultLayout noFooter>
      <div
        className="container d-flex align-items-center justify-content-center"
        style={{ height: 'calc(100vh - 64px)' }}
      >
        <AdminCard style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem' }}>
          <div className="d-flex flex-column align-items-center justify-content-center px-sm-5">
            {data.order_log_by_pk.order_status?.status === 'SUCCESS' ? (
              <>
                <Icon
                  className="mb-5"
                  type="check-circle"
                  theme="twoTone"
                  twoToneColor="#4ed1b3"
                  style={{ fontSize: '4rem' }}
                />
                <Typography.Title level={4} className="mb-3">
                  {formatMessage(commonMessages.title.purchasedItemAvailable)}
                </Typography.Title>
                <Typography.Text className="mb-4">{formatMessage(commonMessages.content.atm)}</Typography.Text>
              </>
            ) : (
              <>
                <Icon
                  className="mb-5"
                  type="close-circle"
                  theme="twoTone"
                  twoToneColor="#ff7d62"
                  style={{ fontSize: '4rem' }}
                />
                <Typography.Title level={4} className="mb-3">
                  {formatMessage(commonMessages.title.paymentFail)}
                </Typography.Title>
                <Typography.Title level={4} className="mb-3">
                  {formatMessage(commonMessages.title.creditCardConfirm)}
                </Typography.Title>
              </>
            )}
            <Link to="/">
              <Button>{formatMessage(commonMessages.button.home)}</Button>
            </Link>
          </div>
        </AdminCard>
      </div>
    </DefaultLayout>
  )
}

export default OrderPage

const GET_ORDERS_PRODUCT = gql`
  query GET_ORDERS_PRODUCT($orderId: String!) {
    order_log_by_pk(id: $orderId) {
      id
      message
      order_status {
        status
      }
      order_discounts_aggregate {
        aggregate {
          sum {
            price
          }
        }
      }
      order_products_aggregate {
        aggregate {
          sum {
            price
          }
        }
      }
      order_products {
        id
        product_id
        name
        price
        options
      }
      order_discounts {
        type
        target
      }
      shipping
      invoice
    }
  }
`
