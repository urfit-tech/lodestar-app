import { Tag } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'
import { saleMessages } from '../../helpers/translation'

const OrderStatusTag: React.FC<{
  status: string
}> = ({ status }) => {
  const { formatMessage } = useIntl()

  switch (status) {
    case 'UNPAID':
      return <Tag color="#ffbe1e">{formatMessage(saleMessages.status.unpaid)}</Tag>
    case 'EXPIRED':
      return <Tag color="#ec9e8f">{formatMessage(saleMessages.status.expired)}</Tag>
    case 'PARTIAL_PAID':
      return <Tag color="#8fd5b5">{formatMessage(saleMessages.status.partialPaid)}</Tag>
    case 'SUCCESS':
      return <Tag color="#4ed1b3">{formatMessage(saleMessages.status.completed)}</Tag>
    case 'PARTIAL_REFUND':
      return <Tag color="#cdcdcd">{formatMessage(saleMessages.status.partialRefund)}</Tag>
    case 'REFUND':
      return <Tag color="#9b9b9b">{formatMessage(saleMessages.status.refunded)}</Tag>
    case 'DELETED':
      return <Tag color="#72a7c1">{formatMessage(saleMessages.status.deleted)}</Tag>
    default:
      return <Tag color="#ff7d62">{formatMessage(saleMessages.status.fail)}</Tag>
  }
}

export default OrderStatusTag
