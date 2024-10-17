import { SkeletonText } from '@chakra-ui/react'
import React from 'react'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
import DefaultLayout from '../components/layout/DefaultLayout'
import { commonMessages } from '../helpers/translation'
import { useOrderProduct } from '../hooks/checkout'
import ActivityTicketPage from './ActivityTicketPage'
import pageMessages from './translation'

const OrderProductPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { orderProductId } = useParams<{ orderProductId: string }>()
  const { loadingOrderProduct, errorOrderProduct, orderProduct } = useOrderProduct(orderProductId)

  if (loadingOrderProduct) {
    return (
      <DefaultLayout noFooter>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
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

  return (
    <DefaultLayout noFooter>
      {formatMessage(pageMessages.OrderProductPage.orderProductPageContent, { orderProductId: orderProductId })}
    </DefaultLayout>
  )
}

export default OrderProductPage
