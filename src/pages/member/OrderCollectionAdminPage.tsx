import { Typography } from 'antd'
import React from 'react'
import Icon from 'react-inlinesvg'
import { useIntl } from 'react-intl'
import { useAuth } from '../../components/auth/AuthContext'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import OrderCollectionAdminCard from '../../components/sale/OrderCollectionAdminCard'
import { commonMessages } from '../../helpers/translation'
import ClipboardListIcon from '../../images/clipboard-list.svg'

const OrderCollectionAdminPage = () => {
  const { currentMemberId } = useAuth()
  const { formatMessage } = useIntl()

  return (
    <MemberAdminLayout>
      <Typography.Title level={3} className="mb-4">
        <Icon src={ClipboardListIcon} className="mr-3" />
        <span>{formatMessage(commonMessages.content.orderHistory)}</span>
      </Typography.Title>

      {currentMemberId && <OrderCollectionAdminCard memberId={currentMemberId} />}
    </MemberAdminLayout>
  )
}

export default OrderCollectionAdminPage
