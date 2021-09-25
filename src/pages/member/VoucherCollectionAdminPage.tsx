import { SkeletonText } from '@chakra-ui/react'
import React from 'react'
import { useIntl } from 'react-intl'
import DefaultLayout from '../../components/layout/DefaultLayout'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import { useApp } from '../../containers/common/AppContext'
import VoucherCollectionBlock from '../../containers/voucher/VoucherCollectionBlock'
import { commonMessages } from '../../helpers/translation'
import { ReactComponent as GiftIcon } from '../../images/gift.svg'
import ForbiddenPage from '../ForbiddenPage'

const VoucherCollectionAdminPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const app = useApp()

  if (app.loading) {
    return (
      <DefaultLayout>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </DefaultLayout>
    )
  }

  if (!app.loading && !app.enabledModules.voucher) {
    return <ForbiddenPage />
  }

  return (
    <MemberAdminLayout content={{ icon: GiftIcon, title: formatMessage(commonMessages.content.voucher) }}>
      <VoucherCollectionBlock />
    </MemberAdminLayout>
  )
}

export default VoucherCollectionAdminPage
