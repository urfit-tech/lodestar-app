import { Icon } from '@chakra-ui/icons'
import { Skeleton, Typography } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'
import DefaultLayout from '../../components/layout/DefaultLayout'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import { useApp } from '../../containers/common/AppContext'
import VoucherCollectionBlock from '../../containers/voucher/VoucherCollectionBlock'
import { commonMessages } from '../../helpers/translation'
import { ReactComponent as GiftIcon } from '../../images/gift.svg'
import NotFoundPage from '../NotFoundPage'

const VoucherCollectionAdminPage: React.FC = () => {
  const { formatMessage } = useIntl()
  const { loading, enabledModules } = useApp()

  if (loading) {
    return (
      <DefaultLayout>
        <Skeleton active />
      </DefaultLayout>
    )
  }

  if (!enabledModules.voucher) {
    return <NotFoundPage />
  }

  return (
    <MemberAdminLayout>
      <Typography.Title level={3} className="mb-4">
        <Icon as={GiftIcon} className="mr-3" />
        <span>{formatMessage(commonMessages.content.voucher)}</span>
      </Typography.Title>

      <VoucherCollectionBlock />
    </MemberAdminLayout>
  )
}

export default VoucherCollectionAdminPage
