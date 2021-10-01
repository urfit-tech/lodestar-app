import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { useIntl } from 'react-intl'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import OrderCollectionAdminCard from '../../components/sale/OrderCollectionAdminCard'
import { commonMessages } from '../../helpers/translation'
import { ReactComponent as ClipboardListIcon } from '../../images/clipboard-list.svg'

const OrderCollectionAdminPage: React.FC = () => {
  const { currentMemberId } = useAuth()
  const { formatMessage } = useIntl()

  return (
    <MemberAdminLayout content={{ icon: ClipboardListIcon, title: formatMessage(commonMessages.content.orderHistory) }}>
      {currentMemberId && <OrderCollectionAdminCard memberId={currentMemberId} />}
    </MemberAdminLayout>
  )
}

export default OrderCollectionAdminPage
