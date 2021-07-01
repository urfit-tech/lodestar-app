import { Tag } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'
import { saleMessages } from '../../helpers/translation'

const OrderStatusTag: React.FC<{
  status: string
}> = ({ status }) => {
  const { formatMessage } = useIntl()

  switch (status) {
    case 'SUCCESS':
      return <Tag color="#4ed1b3">{formatMessage(saleMessages.status.completed)}</Tag>
    case 'UNPAID':
    case 'PARTIAL_PAID':
      return <Tag color="#ffbe1e">{formatMessage(saleMessages.status.unpaid)}</Tag>
    case 'REFUND':
      return <Tag color="#9b9b9b">{formatMessage(saleMessages.status.refunded)}</Tag>
    case 'EXPIRED':
      return <Tag color="#ff7d62">{formatMessage(saleMessages.status.expired)}</Tag>
    case 'DELETED':
      return <Tag color="#72A6C1">{formatMessage(saleMessages.status.deleted)}</Tag>
    default:
      return <Tag color="#ff7d62">{formatMessage(saleMessages.status.fail)}</Tag>
  }
}

export default OrderStatusTag
