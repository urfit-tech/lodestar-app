import { Skeleton } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
import DefaultLayout from '../components/layout/DefaultLayout'
import { commonMessages } from '../helpers/translation'
import { useOrderProduct } from '../hooks/checkout'
import ActivityTicketPage from './ActivityTicketPage'

const OrderProductPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { orderProductId } = useParams<{ orderProductId: string }>()
  const { loadingOrderProduct, errorOrderProduct, orderProduct } = useOrderProduct(orderProductId)

  if (loadingOrderProduct) {
    return (
      <DefaultLayout noFooter>
        <Skeleton active />
      </DefaultLayout>
    )
  }

  if (errorOrderProduct || !orderProduct) {
    return (
      <DefaultLayout noFooter>
        <div>{formatMessage(commonMessages.status.readingError)}</div>
      </DefaultLayout>
    )
  }

  if (orderProduct.product.type === 'ActivityTicket') {
    return (
      <ActivityTicketPage
        orderProductId={orderProductId}
        activityTicketId={orderProduct.product.target}
        memberId={orderProduct.memberId}
        invoice={orderProduct.invoice}
      />
    )
  }

  return <DefaultLayout noFooter>this is an order product page of: {orderProductId}</DefaultLayout>
}

export default OrderProductPage
