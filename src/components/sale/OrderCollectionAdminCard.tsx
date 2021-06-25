import { useQuery } from '@apollo/react-hooks'
import { SkeletonText } from '@chakra-ui/react'
import { Button, message, Table, Tooltip } from 'antd'
import { CardProps } from 'antd/lib/card'
import { ColumnProps } from 'antd/lib/table'
import axios from 'axios'
import gql from 'graphql-tag'
import moment from 'moment'
import { prop, sum } from 'ramda'
import React from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import hasura from '../../hasura'
import { dateFormatter, dateRangeFormatter, handleError } from '../../helpers'
import { codeMessages, commonMessages, saleMessages } from '../../helpers/translation'
import { OrderDiscountProps } from '../../types/checkout'
import { ShippingMethodType } from '../../types/merchandise'
import { ProductType } from '../../types/product'
import { useAuth } from '../auth/AuthContext'
import AdminCard from '../common/AdminCard'
import PriceLabel from '../common/PriceLabel'
import ProductTypeLabel from '../common/ProductTypeLabel'
import ShippingMethodLabel from '../common/ShippingMethodLabel'
import OrderStatusTag from './OrderStatusTag'

const StyledContainer = styled.div`
  overflow: auto;

  .ant-table {
    .ant-table-thead,
    .ant-table-row {
      white-space: nowrap;
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
  } | null
  orderProducts: {
    id: string
    name: string
    price: number
    startedAt: Date | null
    endedAt: Date | null
    product: {
      id: string
      type: string
    }
    quantity: number
    currencyId: string
  }[]
  orderDiscounts: OrderDiscountProps[]
  key: string
  totalPrice: number
}

const OrderCollectionAdminCard: React.VFC<
  CardProps & {
    memberId: string
  }
> = ({ memberId, ...props }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { authToken, apiHost } = useAuth()
  const { loading, error, orderLogs } = useOrderLogCollection(memberId)
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
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text.split('-')[0]}</span>
        </Tooltip>
      ),
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
        {record.orderProducts.map(orderProduct => (
          <OrderProductRow key={orderProduct.id} className="d-table-row">
            <OrderProductCell className="pr-4">
              {orderProduct.product.type ? (
                <ProductTypeLabel productType={orderProduct.product.type as ProductType} />
              ) : (
                <>{formatMessage(commonMessages.unknown.type)}</>
              )}
            </OrderProductCell>
            <OrderProductCell className="pr-4" grow>
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
            </OrderProductCell>
            <OrderProductCell className="text-right">
              <PriceLabel currencyId={orderProduct.currencyId} listPrice={orderProduct.price} />
            </OrderProductCell>
          </OrderProductRow>
        ))}
      </OrderProductTable>

      <div className="row">
        <div className="col-3 d-flex align-items-end">
          {record.status !== 'SUCCESS' && record.status !== 'REFUND' && record.status !== 'EXPIRED' && (
            <Button
              onClick={() =>
                axios
                  .post(
                    `https://${apiHost}/tasks/payment/`,
                    { orderId: record.id },
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
              }
              className="mr-2"
            >
              {formatMessage(commonMessages.ui.repay)}
            </Button>
          )}
        </div>
        <div className="col-9">
          {record.shipping?.id && (
            <div className="row text-right">
              <div className="col-9">
                <ShippingMethodLabel shippingMethodId={record.shipping?.id} />
              </div>
              <div className="col-3">
                <PriceLabel listPrice={record.shipping.fee} />
              </div>
            </div>
          )}
          {record.orderDiscounts.map(orderDiscount => (
            <div key={orderDiscount.name} className="row text-right">
              <div className="col-9">{orderDiscount.name}</div>
              <div className="col-3">
                <PriceLabel listPrice={-orderDiscount.price} />
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
  const { loading, error, data } = useQuery<hasura.GET_MEMBER_ORDERS, hasura.GET_MEMBER_ORDERSVariables>(
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
      orderProducts: orderLog.order_products
        .sort((a, b) => (a.options?.position || 0) - (b.options?.position || 0))
        .map(orderProduct => ({
          id: orderProduct.id,
          name: orderProduct.name,
          price: orderProduct.price,
          startedAt: orderProduct.started_at,
          endedAt: orderProduct.ended_at,
          product: {
            id: orderProduct.product.id,
            type: orderProduct.product.type,
          },
          quantity: orderProduct.options?.quantity,
          currencyId: orderProduct.currency_id,
        })),
      orderDiscounts: orderLog.order_discounts.map(orderDiscount => ({
        id: orderDiscount.id,
        name: orderDiscount.name,
        type: orderDiscount.type,
        target: orderDiscount.target,
        description: orderDiscount.description,
        price: orderDiscount.price,
        options: orderDiscount.options,
      })),
    })) || []

  return {
    loading,
    error,
    orderLogs,
  }
}

export default OrderCollectionAdminCard
