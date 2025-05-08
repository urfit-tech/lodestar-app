import { gql, useQuery } from '@apollo/client'
import { LockIcon } from '@chakra-ui/icons'
import { Button, SkeletonText } from '@chakra-ui/react'
import { message, Table, Tooltip } from 'antd'
import { CardProps } from 'antd/lib/card'
import { ColumnProps } from 'antd/lib/table'
import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'
import ProductTypeLabel from 'lodestar-app-element/src/components/labels/ProductTypeLabel'
import TokenTypeLabel from 'lodestar-app-element/src/components/labels/TokenTypeLabel'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAppTheme } from 'lodestar-app-element/src/contexts/AppThemeContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment'
import { prop, sum } from 'ramda'
import React from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import hasura from '../../hasura'
import { dateFormatter, dateRangeFormatter } from '../../helpers'
import { commonMessages, saleMessages } from '../../helpers/translation'
import {
  OpenPageMethod,
  OrderPaymentStrategyContext,
  PaymentMode,
} from '../../services/orderPayment/OrderPaymentStrategy'
import { OrderDiscountProps } from '../../types/checkout'
import { ShippingMethodType } from '../../types/merchandise'
import { ProductType } from '../../types/product'
import AdminCard from '../common/AdminCard'
import ShippingMethodLabel from '../common/ShippingMethodLabel'
import OrderRequestRefundModal from './OrderRequestRefundModal'
import OrderStatusTag from './OrderStatusTag'

const StyledContainer = styled.div`
  overflow: auto;

  .ant-table {
    .ant-table-thead,
    .ant-table-row {
      white-space: nowrap;
    }
    .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
      background: #eee !important;
    }
  }
`
const StyledDate = styled.span`
  color: #9b9b9b;
`
const OrderProductTable = styled.div`
  display: table;
  width: 100%;
`
const OrderProductCell = styled.div<{ grow?: boolean }>`
  display: table-cell;
  padding: 1.5rem 0;
  border-bottom: 1px solid #e8e8e8;
  ${props => (props.grow ? 'width: 100%;' : '')}
`
const OrderProductRow = styled.div`
  display: table-row;
  overflow: hidden;
  white-space: nowrap;

  &:first-child > ${OrderProductCell} {
    padding-top: 0;
  }
`

type OrderRow = {
  id: string
  createdAt: Date
  status: string
  shipping: {
    id: ShippingMethodType
    fee: number
    days: number
    enabled: boolean
    shippingMethod: ShippingMethodType
  } | null
  orderProducts: {
    id: string
    name: string
    price: number
    startedAt: Date | null
    endedAt: Date | null
    product: {
      id: string
      type: ProductType
    }
    quantity: number
    currencyId: string
    deliveredAt: Date | null
    options: { [key: string]: any } | null
  }[]
  orderDiscounts: OrderDiscountProps[]
  paymentLogs: { no: string; status: string; options?: { index: number; price: number }; invoiceGatewayId?: string }[]
  key: string
  totalPrice: number
  options: { installmentPlans?: { index: number; price: number }[] }
}

const OrderCollectionAdminCard: React.FC<
  CardProps & {
    memberId: string
  }
> = ({ memberId, ...props }) => {
  const theme = useAppTheme()
  const { settings, enabledModules, id: appId } = useApp()
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { authToken } = useAuth()
  const { loading, error, orderLogs, refetch } = useOrderLogCollection(memberId)
  if (loading || error) {
    return (
      <AdminCard>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </AdminCard>
    )
  }

  const columns: ColumnProps<any>[] = [
    {
      title: formatMessage(saleMessages.column.title.orderNo),
      dataIndex: 'id',
      key: 'id',
      width: '100px',
      render: (text: string) => {
        const uuidRegexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
        const orderNo = uuidRegexExp.test(text) ? text.split('-')[0] : text
        return (
          <Tooltip title={orderNo}>
            <span>{orderNo}</span>
          </Tooltip>
        )
      },
    },
    {
      title: formatMessage(saleMessages.column.title.purchaseDate),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '200px',
      render: text => <StyledDate>{dateFormatter(text)}</StyledDate>,
    },
    {
      title: formatMessage(saleMessages.column.title.totalPrice),
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      align: 'right',
      render: text => <PriceLabel listPrice={Math.max(text, 0)} />,
    },
    {
      title: formatMessage(saleMessages.column.title.orderStatus),
      dataIndex: 'status',
      key: 'status',
      width: '100px',
      render: (status: string) => <OrderStatusTag status={status} />,
    },
  ]

  const expandedRow = (record: OrderRow) => (
    <div className="pr-3">
      <OrderProductTable className="mb-4">
        {record.orderProducts
          .filter(orderProduct => orderProduct.product.type !== 'Token')
          .map((orderProduct, index) => (
            <OrderProductRow key={orderProduct.id} className="d-table-row">
              <OrderProductCell className="pr-4">
                {settings['payment.v2'] === '1' ? (
                  `#${index + 1}`
                ) : orderProduct.product.type ? (
                  <ProductTypeLabel productType={orderProduct.product.type} />
                ) : (
                  <>{formatMessage(commonMessages.unknown.type)}</>
                )}
              </OrderProductCell>
              <OrderProductCell className="pr-4" grow>
                <div className="d-flex align-items-center">
                  {!orderProduct.deliveredAt && <LockIcon className="mr-1" />}
                  {orderProduct.name}
                  {orderProduct.endedAt && orderProduct.product.type !== 'AppointmentPlan' && (
                    <span className="ml-2">
                      ({moment(orderProduct.endedAt).format('YYYY-MM-DD HH:mm')}{' '}
                      {formatMessage(commonMessages.term.expiredAt)})
                    </span>
                  )}
                  {orderProduct.startedAt && orderProduct.endedAt && orderProduct.product.type === 'AppointmentPlan' && (
                    <span>
                      (
                      {dateRangeFormatter({
                        startedAt: orderProduct.startedAt,
                        endedAt: orderProduct.endedAt,
                        dateFormat: 'YYYY-MM-DD',
                      })}
                      )
                    </span>
                  )}
                  {orderProduct.quantity && <span>{` X${orderProduct.quantity} `}</span>}
                </div>
              </OrderProductCell>
              <OrderProductCell className="text-right">
                {orderProduct.price === 0 && Boolean(settings['hide_zero_price.enabled']) ? null : (
                  <PriceLabel
                    currencyId={
                      orderProduct.product.type === 'MerchandiseSpec' && orderProduct.options?.currencyId === 'LSC'
                        ? 'LSC'
                        : orderProduct.currencyId
                    }
                    listPrice={
                      orderProduct.product.type === 'MerchandiseSpec' && orderProduct.options?.currencyId === 'LSC'
                        ? orderProduct.options.currencyPrice
                        : orderProduct.price
                    }
                  />
                )}
              </OrderProductCell>
            </OrderProductRow>
          ))}
        {record.orderProducts
          .filter(orderProduct => orderProduct.product.type === 'Token')
          .map((orderProduct, index) => {
            return (
              <OrderProductRow key={`Token_${orderProduct.id}`} className="d-table-row">
                <OrderProductCell className="pr-4">
                  {settings['payment.v2'] === '1' ? (
                    `#${
                      record.orderProducts.filter(orderProduct => orderProduct.product.type !== 'Token').length +
                      index +
                      1
                    }`
                  ) : (
                    <TokenTypeLabel tokenType="GiftPlan" />
                  )}{' '}
                </OrderProductCell>
                <OrderProductCell className="pr-4" grow>
                  <div className="d-flex align-items-center">
                    {!orderProduct.deliveredAt && <LockIcon className="mr-1" />}
                    {orderProduct.name}
                  </div>
                </OrderProductCell>
                <OrderProductCell className="text-right">
                  {orderProduct.price === 0 && Boolean(settings['hide_zero_price.enabled']) ? null : (
                    <PriceLabel currencyId={orderProduct.options?.currencyId} listPrice={orderProduct.price} />
                  )}
                </OrderProductCell>
              </OrderProductRow>
            )
          })}
      </OrderProductTable>

      <div className="row">
        <div className="col-3 d-flex align-items-end">
          {settings['payment.v2'] === '1' &&
            record.options?.installmentPlans &&
            record.options?.installmentPlans.length > 0 &&
            record.paymentLogs
              .filter(p => p.status === 'UNPAID')
              .sort((a, b) => (a.options?.index || 0) - (b.options?.index || 0))
              .map(p => (
                <Button
                  variant="outline"
                  _hover={{
                    color: theme.colors.primary[500],
                    borderColor: theme.colors.primary[500],
                  }}
                  onClick={() => history.push(`/tasks/payment/${p.no}`)}
                  className="mr-2"
                >
                  {p.options?.index}期付款
                </Button>
              ))}
          {['UNPAID', 'PARTIAL_PAID', 'FAILED'].includes(record.status) && (
            <Button
              variant="outline"
              _hover={{
                color: theme.colors.primary[500],
                borderColor: theme.colors.primary[500],
              }}
              onClick={async () => {
                const mode = enabledModules.split_payment_mode ? PaymentMode.Split : PaymentMode.Default
                const result = await OrderPaymentStrategyContext.execute(mode, {
                  orderLogId: record.id,
                  appId,
                  authToken,
                  invoiceGatewayId: record.paymentLogs[0].invoiceGatewayId,
                  clientBackUrl: window.location.origin,
                })

                if (!result.success) {
                  message.error(result.message)
                  return
                }

                switch (result.openPageMethod) {
                  case OpenPageMethod.HISTORY_PUSH:
                    history.push(result.paymentUrl || '')
                    break
                  case OpenPageMethod.OPEN_WINDOW:
                    window.location.replace(result.paymentUrl || '')
                    break
                }
              }}
              className="mr-2"
            >
              {formatMessage(commonMessages.ui.repay)}
            </Button>
          )}
          {settings['order.apply_refund.enabled'] === '1' && record.status === 'SUCCESS' && (
            <OrderRequestRefundModal
              orderId={record.id}
              orderProducts={record.orderProducts}
              orderDiscounts={record.orderDiscounts}
              totalPrice={record.totalPrice}
              onRefetch={refetch}
            />
          )}
        </div>
        <div className="col-9">
          {record.shipping?.id || record.shipping?.shippingMethod ? (
            <div className="row text-right">
              <div className="col-9">
                <ShippingMethodLabel shippingMethodId={record.shipping?.id || record.shipping?.shippingMethod} />
              </div>
              <div className="col-3">
                <PriceLabel listPrice={record.shipping?.fee ? record.shipping.fee : 0} />
              </div>
            </div>
          ) : null}
          {record.orderDiscounts.map(orderDiscount => (
            <div key={orderDiscount.name} className="row text-right">
              <div className="col-9">{orderDiscount.name}</div>
              <div className="col-3">
                <PriceLabel
                  currencyId={orderDiscount.type === 'Coin' ? 'LSC' : undefined}
                  listPrice={
                    record.orderProducts.length === 1 &&
                    record.orderProducts[0].product.type === 'MerchandiseSpec' &&
                    record.orderProducts[0].options !== null &&
                    record.orderProducts[0].options.currencyId === 'LSC' &&
                    orderDiscount.options !== null
                      ? -orderDiscount.options.coins
                      : -orderDiscount.price
                  }
                />
              </div>
            </div>
          ))}
          <div className="row text-right">
            <div className="col-9">{formatMessage(saleMessages.contents.totalAmount)}</div>
            <div className="col-3">
              <PriceLabel listPrice={record.totalPrice} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <AdminCard {...props}>
      <StyledContainer>
        <Table loading={loading} dataSource={orderLogs} columns={columns} expandedRowRender={expandedRow} />
      </StyledContainer>
    </AdminCard>
  )
}

const useOrderLogCollection = (memberId: string) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_MEMBER_ORDERS, hasura.GET_MEMBER_ORDERSVariables>(
    gql`
      query GET_MEMBER_ORDERS($memberId: String!) {
        order_log(
          order_by: { created_at: desc }
          where: { member_id: { _eq: $memberId }, parent_order_id: { _is_null: true } }
        ) {
          id
          created_at
          status
          shipping
          options
          order_products {
            id
            name
            price
            started_at
            ended_at
            product {
              id
              type
            }
            options
            currency_id
            delivered_at
          }
          order_discounts {
            id
            name
            description
            price
            type
            target
            options
          }
          payment_logs {
            no
            options
            status
            invoice_gateway_id
          }
        }
      }
    `,
    { variables: { memberId } },
  )

  const orderLogs: OrderRow[] =
    data?.order_log.map(orderLog => ({
      id: orderLog.id,
      key: orderLog.id,
      createdAt: orderLog.created_at,
      status: orderLog.status || 'UNKNOWN',
      totalPrice:
        sum(orderLog.order_products.map(prop('price'))) -
        sum(orderLog.order_discounts.map(prop('price'))) +
        (orderLog.shipping?.fee || 0),
      shipping: orderLog.shipping,
      options: orderLog.options,
      orderProducts: [...orderLog.order_products]
        .sort((a, b) => (a.options?.position || 0) - (b.options?.position || 0))
        .map(orderProduct => ({
          id: orderProduct.id,
          name: orderProduct.name,
          price: orderProduct.price,
          startedAt: orderProduct.started_at,
          endedAt: orderProduct.ended_at,
          product: {
            id: orderProduct.product.id,
            type: orderProduct.product.type as ProductType,
          },
          quantity: orderProduct.options?.quantity,
          currencyId: orderProduct.currency_id,
          deliveredAt: orderProduct.delivered_at,
          options: orderProduct.options,
        })),
      orderDiscounts: orderLog.order_discounts.map(orderDiscount => ({
        id: orderDiscount.id,
        name: orderDiscount.name,
        type: orderDiscount.type,
        target: orderDiscount.target,
        description: orderDiscount.description || '',
        price: orderDiscount.price,
        options: orderDiscount.options,
      })),
      paymentLogs: orderLog.payment_logs.map(paymentLog => ({
        no: paymentLog.no,
        status: paymentLog.status || 'UNKNOWN',
        options: paymentLog.options,
        invoiceGatewayId: paymentLog.invoice_gateway_id,
      })),
    })) || []

  return {
    loading,
    error,
    orderLogs,
    refetch,
  }
}

export default OrderCollectionAdminCard
