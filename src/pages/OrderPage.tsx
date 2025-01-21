import { gql, useQuery } from '@apollo/client'
import { Button, Icon, message, Typography } from 'antd'
import axios from 'axios'
import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { handleError, notEmpty } from 'lodestar-app-element/src/helpers'
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
import { codeMessages, commonMessages } from '../helpers/translation'
import LoadingPage from './LoadingPage'
import NotFoundPage from './NotFoundPage'

export const messages = defineMessages({
  orderSuccessHint: {
    id: 'common.text.orderSuccessHint',
    defaultMessage: '若你選擇「{method}」需於付款完成後，等待{waitingDays} 個工作日才會開通。',
  },
  orderTracking: { id: 'common.text.orderTracking', defaultMessage: '訂單查詢' },
  deposit: {
    id: 'orderPage.label.deposit',
    defaultMessage: '訂金',
  },
  finalPayment: {
    id: 'orderPage.label.finalPayment',
    defaultMessage: '尾款',
  },
  installment: {
    id: 'orderPage.label.installment',
    defaultMessage: '{index}期',
  },
  paid: {
    id: 'orderPage.status.paid',
    defaultMessage: '已付款',
  },
  unpaid: {
    id: 'orderPage.status.unpaid',
    defaultMessage: '未付款',
  },
})

const OrderPage: CustomVFC<{}, { order: hasura.PH_GET_ORDERS_PRODUCT['order_log_by_pk'] }> = ({ render }) => {
  const { formatMessage } = useIntl()
  const { orderId } = useParams<{ orderId: string }>()
  const location = useLocation()
  const history = useHistory()
  const [withTracking] = useQueryParam('tracking', BooleanParam)
  const [errorCode] = useQueryParam('code', StringParam)
  const { settings, id: appId, loading: isAppLoading, enabledModules } = useApp()
  const { currentMemberId, isAuthenticating, authToken } = useAuth()
  const { loading: isOrderLoading, data } = useQuery<
    hasura.PH_GET_ORDERS_PRODUCT,
    hasura.PH_GET_ORDERS_PRODUCTVariables
  >(PH_GET_ORDERS_PRODUCT, { variables: { orderId: orderId } })
  const order = data?.order_log_by_pk

  const { resourceCollection: productResourceCollection, loading: productResourceCollectionLoading } =
    useResourceCollection(
      order?.order_products.map(v => {
        const { type, target } = getResourceByProductId(v.product_id)
        return `${appId}:${type}:${target}`
      }) || [],
    )
  const [metaLoaded, setMetaLoaded] = useState<boolean>(false)

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
              waitingDays: '3-5',
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
                  {errorCode === 'E_SYNC_PAYMENT' || errorCode === 'E_ADD_SYNC_JOB' ? (
                    <>
                      <Typography.Text>{formatMessage(commonMessages.content.busyProcessing)}</Typography.Text>
                      <Typography.Text>{formatMessage(commonMessages.content.busyCheck)}</Typography.Text>
                      <Typography.Text>{formatMessage(commonMessages.content.busyContact)}</Typography.Text>
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
              ) : order.status === 'SUCCESS' ||
                (!!order.options?.installmentPlans &&
                  order.payment_logs.filter(p => p.status === 'SUCCESS').length > 0) ? (
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
                  {!!order.options?.installmentPlans &&
                    order.options?.installmentPlans.map((plan: { price: number; index: number }) => (
                      <div key={plan.index} className="mb-2">
                        <b>
                          {plan.index === 0 && order.options?.installmentPlans.length === 2
                            ? formatMessage(messages.deposit)
                            : plan.index === 1 && order.options?.installmentPlans.length === 2
                            ? formatMessage(messages.finalPayment)
                            : formatMessage(messages.installment, { index: plan.index + 1 })}
                        </b>
                        ：
                        {order.payment_logs.filter(p => p.price === plan.price)[0].status === 'SUCCESS'
                          ? formatMessage(messages.paid)
                          : formatMessage(messages.unpaid)}
                      </div>
                    ))}
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
                    <Button
                      style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                      onClick={param => {
                        const mode = enabledModules.split_payment_mode ? 'split' : 'single'
                        switch (mode) {
                          case 'split':
                            axios
                              .get(`${process.env.REACT_APP_API_BASE_ROOT}/order/${orderId}/multi-payment/url`, {
                                params: {
                                  appId: appId,
                                },
                                headers: {
                                  authorization: `Bearer ${authToken}`,
                                },
                              })
                              .then(
                                ({
                                  data: {
                                    code,
                                    result: { paymentUrl },
                                  },
                                }) => {
                                  if (code === 'SUCCESS') {
                                    window.open(paymentUrl, '_blank')
                                  } else {
                                    message.error(formatMessage(codeMessages[code as keyof typeof codeMessages]))
                                  }
                                },
                              )
                              .catch(handleError)
                            break
                          default:
                            axios
                              .post(
                                `${process.env.REACT_APP_API_BASE_ROOT}/tasks/payment/`,
                                {
                                  orderId: orderId,
                                  clientBackUrl: window.location.origin,
                                  invoiceGatewayId: order.payment_logs[0]?.invoice_gateway_id,
                                },
                                { headers: { authorization: `Bearer ${authToken}` } },
                              )
                              .then(({ data: { code, result } }) => {
                                if (code === 'SUCCESS') {
                                  history.push(`/tasks/payment/${result.id}`)
                                } else {
                                  message.error(formatMessage(codeMessages[code as keyof typeof codeMessages]))
                                }
                              })
                              .catch(handleError)
                            break
                        }
                      }}
                    >
                      <div>{formatMessage(commonMessages.ui.repay)}</div>
                      <Icon type="down" />
                    </Button>
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

const PH_GET_ORDERS_PRODUCT = gql`
  query PH_GET_ORDERS_PRODUCT($orderId: String!) {
    order_log_by_pk(id: $orderId) {
      id
      message
      status
      payment_model
      custom_id
      options
      payment_logs {
        no
        status
        price
        invoice_gateway_id
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
        name
        price
      }
      shipping
      invoice_options
    }
  }
`

export default OrderPage
