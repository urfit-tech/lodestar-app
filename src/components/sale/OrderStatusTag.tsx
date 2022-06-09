import { Tag } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'
import { useCustomRenderer } from '../../contexts/CustomRendererContext'
import { saleMessages } from '../../helpers/translation'

const OrderStatusTag: React.FC<{
  status: string
}> = ({ status }) => {
  const { renderOrderStatusTag } = useCustomRenderer()
  const { formatMessage } = useIntl()

  let statusTag = <Tag color="#ff7d62">{formatMessage(saleMessages.status.fail)}</Tag>
  switch (status) {
    case 'UNPAID':
      statusTag = <Tag color="#ffbe1e">{formatMessage(saleMessages.status.unpaid)}</Tag>
      break
    case 'EXPIRED':
      statusTag = <Tag color="#ec9e8f">{formatMessage(saleMessages.status.expired)}</Tag>
      break
    case 'PARTIAL_PAID':
      statusTag = <Tag color="#8fd5b5">{formatMessage(saleMessages.status.partialPaid)}</Tag>
      break
    case 'SUCCESS':
      statusTag = <Tag color="#4ed1b3">{formatMessage(saleMessages.status.completed)}</Tag>
      break
    case 'PARTIAL_REFUND':
      statusTag = <Tag color="#cdcdcd">{formatMessage(saleMessages.status.partialRefund)}</Tag>
      break
    case 'REFUND':
      statusTag = <Tag color="#9b9b9b">{formatMessage(saleMessages.status.refunded)}</Tag>
      break
    case 'DELETED':
      statusTag = <Tag color="#72a7c1">{formatMessage(saleMessages.status.deleted)}</Tag>
      break
    case 'PAYING':
      statusTag = <Tag color="#ffbe1e">{formatMessage(saleMessages.status.paying)}</Tag>
      break
    case 'REFUNDING':
      statusTag = <Tag color="#cdcdcd">{formatMessage(saleMessages.status.refunding)}</Tag>
      break
    case 'PARTIAL_EXPIRED':
      statusTag = <Tag color="#cdcdcd">{formatMessage(saleMessages.status.partialExpired)}</Tag>
      break
    case 'UNKNOWN':
      statusTag = <Tag color="#cdcdcd">{formatMessage(saleMessages.status.unknown)}</Tag>
      break
  }

  return renderOrderStatusTag?.({ status, defaultStatusTag: statusTag }) || statusTag
}

export default OrderStatusTag
