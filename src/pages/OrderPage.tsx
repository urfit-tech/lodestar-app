import { useQuery } from '@apollo/react-hooks'
import { Button, Icon, Typography } from 'antd'
import axios from 'axios'
import gql from 'graphql-tag'
import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { notEmpty } from 'lodestar-app-element/src/helpers'
import { checkoutMessages } from 'lodestar-app-element/src/helpers/translation'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import { getResourceByProductId } from 'lodestar-app-element/src/hooks/util'
import { useEffect, useState } from 'react'
import ReactPixel from 'react-facebook-pixel'
import { defineMessages, useIntl } from 'react-intl'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'
import AdminCard from '../components/common/AdminCard'
import PageHelmet from '../components/common/PageHelmet'
import DefaultLayout from '../components/layout/DefaultLayout'
import hasura from '../hasura'
import { commonMessages } from '../helpers/translation'
import LoadingPage from './LoadingPage'
import NotFoundPage from './NotFoundPage'

const messages = defineMessages({
  orderSuccessHint: {
    id: 'common.text.orderSuccessHint',
    defaultMessage: '若你選擇「{method}」需於付款完成後，{waitingDays} 個工作日才會開通。',
  },
  orderTracking: { id: 'common.text.orderTracking', defaultMessage: '訂單查詢' },
})

const OrderPage: CustomVFC<{}, { order: hasura.GET_ORDERS_PRODUCT['order_log_by_pk'] }> = ({ render }) => {
  const { formatMessage } = useIntl()
  const { orderId } = useParams<{ orderId: string }>()
  const location = useLocation()
  const history = useHistory()
  const [withTracking] = useQueryParam('tracking', BooleanParam)
  const [errorCode] = useQueryParam('code', StringParam)
  const { settings, id: appId, loading: isAppLoading } = useApp()
  const { currentMemberId, isAuthenticating, authToken } = useAuth()
  const { loading: isOrderLoading, data } = useQuery<hasura.GET_ORDERS_PRODUCT, hasura.GET_ORDERS_PRODUCTVariables>(
    GET_ORDERS_PRODUCT,
    { variables: { orderId: orderId } },
  )
  const { data: paymentData } = useQuery<hasura.GET_PAYMENT_LOG, hasura.GET_PAYMENT_LOGVariables>(GET_PAYMENT_LOG, {
    variables: { orderId },
  })
  const order = data?.order_log_by_pk
  const payments = paymentData?.payment_log

  const { resourceCollection: productResourceCollection, loading: productResourceCollectionLoading } =
    useResourceCollection(
      order?.order_products.map(v => {
        const { type, target } = getResourceByProductId(v.product_id)
        return `${appId}:${type}:${target}`
      }) || [],
    )
  const [metaLoaded, setMetaLoaded] = useState<boolean>(false)

  useEffect(() => {
    if (authToken && payments && payments.length > 0) {
      const requests = payments.map(payment => {
        return axios.post<{ code: string; message: string; result: any }>(
          `${process.env.REACT_APP_API_BASE_ROOT}/tasks/sync-payment/`,
          { paymentNo: payment.no, customNo: payment.custom_no, paymentOptions: payment.options },
          { headers: { authorization: `Bearer ${authToken}` } },
        )
      })
      axios
        .all(requests)
        .then(
          axios.spread((...responses) => {
            const errors = responses.reduce<string[]>((accu, curr) => {
              if (curr.data.code !== 'SUCCESS') accu.push(`${curr.data.code}: ${curr.data.message}`)
              return accu
            }, [])
            if (errors.length > 0) return Promise.reject(new Error(errors.join(', ')))
            process.env.NODE_ENV === 'development' && console.log('successfully add delayed sync job')
          }),
        )
        .catch(error => process.env.NODE_ENV === 'development' && console.error(error))
    }
  }, [authToken, payments])

  useEffect(() => {
    if (order && order.status === 'SUCCESS' && withTracking) {
      const productPrice = order.order_products_aggregate?.aggregate?.sum?.price || 0
      const discountPrice = order.order_discounts_aggregate?.aggregate?.sum?.price || 0
      const shippingFee = (order.shipping && order.shipping['fee']) || 0
      if (settings['tracking.fb_pixel_id']) {
        ReactPixel.track('Purchase', {
          value: productPrice - discountPrice - shippingFee,
          currency: 'TWD',
          content_type: order.order_products.length > 1 ? 'product_group' : 'product',
          contents: order.order_products.map(order_product => {
            const [productType, productId] = order_product.product_id.split('_')
            return {
              id: productId,
              content_type: productType,
              content_name: order_product.name,
              quantity: order_product.options ? order_product.options['quantity'] || 1 : 1,
              price: order_product.price,
            }
          }),
        })
      }
    }
  }, [order, settings, withTracking])

  if (isAppLoading || isOrderLoading || isAuthenticating || productResourceCollectionLoading) {
    return <LoadingPage />
  }
  if (!order) {
    return <NotFoundPage />
  }

  const orderSuccessHintFormat = (paymentMethod?: string) => {
    switch (paymentMethod) {
      case 'vacc':
        return (
          <Typography.Text className="mb-4">
            {formatMessage(messages.orderSuccessHint, {
              method: formatMessage(checkoutMessages.label.vacc),
              waitingDays: '1-2',
            })}
          </Typography.Text>
        )
      case 'cvs':
        return (
          <Typography.Text className="mb-4">
            {formatMessage(messages.orderSuccessHint, {
              method: formatMessage(checkoutMessages.label.cvs),
              waitingDays: '1-2',
            })}
          </Typography.Text>
        )
      case 'barcode':
        return (
          <Typography.Text className="mb-4">
            {formatMessage(messages.orderSuccessHint, {
              method: formatMessage(checkoutMessages.label.barcode),
              waitingDays: '等待 3-5',
            })}
          </Typography.Text>
        )
    }
  }

  return (
    render?.({ order }) || (
      <DefaultLayout noFooter>
        <PageHelmet onLoaded={() => setMetaLoaded(true)} />
        {order.status === 'SUCCESS' && withTracking && metaLoaded && (
          <Tracking.Purchase
            orderId={order.id}
            products={productResourceCollection.filter(notEmpty).map((resource, idx) => ({
              ...resource,
              quantity: Number(order.order_products[idx].options?.quantity) || 1,
            }))}
            discounts={order.order_discounts.map(v => ({ name: v.name, price: v.price }))}
            onTracked={() => history.replace(location.pathname)}
          />
        )}
        <div
          className="container d-flex align-items-center justify-content-center"
          style={{ height: 'calc(100vh - 64px)' }}
        >
          <AdminCard style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem' }}>
            <div className="d-flex flex-column align-items-center justify-content-center px-sm-5">
              {errorCode ? (
                <>
                  <Icon
                    className="mb-5"
                    type="warning"
                    theme="twoTone"
                    twoToneColor="#ffbe1e"
                    style={{ fontSize: '4rem' }}
                  />
                  <Typography.Title level={4}>{formatMessage(commonMessages.title.systemBusy)}</Typography.Title>
                  {errorCode === 'E_SYNC_PAYMENT' ? (
                    <>
                      <Typography.Text>{formatMessage(commonMessages.content.busy)}</Typography.Text>
                      <Typography.Text>{formatMessage(commonMessages.content.busyProcessing)}</Typography.Text>
                      <Typography.Text>{formatMessage(commonMessages.content.busyCheck)}</Typography.Text>
                      <Typography.Text>{formatMessage(commonMessages.content.busyContact)}</Typography.Text>
                    </>
                  ) : errorCode === 'E_ADD_SYNC_JOB' ? (
                    <>
                      <Typography.Text>{formatMessage(commonMessages.content.busy)}</Typography.Text>
                      <Typography.Text>{formatMessage(commonMessages.content.busySyncJob)}</Typography.Text>
                    </>
                  ) : (
                    <>
                      <Typography.Text>{formatMessage(commonMessages.content.busyOther)}</Typography.Text>
                      <Typography.Text>
                        {formatMessage(commonMessages.content.busyError, { errorCode })}
                      </Typography.Text>
                    </>
                  )}
                  <Link to="/settings/orders" className="ml-sm-2 mt-4">
                    <Button>{formatMessage(messages.orderTracking)}</Button>
                  </Link>
                </>
              ) : !order.status ? (
                <>
                  <Icon
                    className="mb-5"
                    type="check-circle"
                    theme="twoTone"
                    twoToneColor="#4ed1b3"
                    style={{ fontSize: '4rem' }}
                  />
                  <Typography.Title level={4} className="mb-3">
                    {formatMessage(commonMessages.title.purchasedItemPreparing)}
                  </Typography.Title>
                  <Typography.Text className="mb-4">{formatMessage(commonMessages.content.prepare)}</Typography.Text>
                  <Link to="/">
                    <Button>{formatMessage(commonMessages.button.home)}</Button>
                  </Link>
                </>
              ) : order.status === 'SUCCESS' ? (
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
                  {orderSuccessHintFormat(order.payment_model?.method)}
                  <div className="d-flex justify-content-center flex-column flex-sm-row mt-2">
                    <Link to={`/members/${currentMemberId}`} className="mb-3 mb-sm-0 mr-sm-2">
                      <Button>{formatMessage(commonMessages.button.myPage)}</Button>
                    </Link>
                    <Link to="/settings/orders" className="ml-sm-2">
                      <Button>{formatMessage(messages.orderTracking)}</Button>
                    </Link>
                  </div>
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
                  <div className="d-flex justify-content-center flex-column flex-sm-row mt-2">
                    <Link to="/" className="mb-3 mb-sm-0 mr-sm-2">
                      <Button>{formatMessage(commonMessages.button.home)}</Button>
                    </Link>
                    <Link to="/settings/orders" className="ml-sm-2">
                      <Button>{formatMessage(commonMessages.ui.repay)}</Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </AdminCard>
        </div>
      </DefaultLayout>
    )
  )
}

const GET_ORDERS_PRODUCT = gql`
  query GET_ORDERS_PRODUCT($orderId: String!) {
    order_log_by_pk(id: $orderId) {
      id
      message
      status
      payment_model
      custom_id
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
        name
        price
      }
      shipping
      invoice
    }
  }
`

const GET_PAYMENT_LOG = gql`
  query GET_PAYMENT_LOG($orderId: String) {
    payment_log(where: { order_id: { _eq: $orderId } }) {
      no
      custom_no
      options
    }
  }
`

export default OrderPage
