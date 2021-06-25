import { SkeletonText } from '@chakra-ui/react'
import React from 'react'
import { useIntl } from 'react-intl'
import DefaultLayout from '../../components/layout/DefaultLayout'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import { useApp } from '../../containers/common/AppContext'
import VoucherCollectionBlock from '../../containers/voucher/VoucherCollectionBlock'
import { commonMessages } from '../../helpers/translation'
import { ReactComponent as GiftIcon } from '../../images/gift.svg'
import NotFoundPage from '../NotFoundPage'

const VoucherCollectionAdminPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { loading, enabledModules } = useApp()

  if (loading) {
    return (
      <DefaultLayout>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </DefaultLayout>
    )
  }

  if (!enabledModules.voucher) {
    return <NotFoundPage />
  }

  return (
    <MemberAdminLayout content={{ icon: GiftIcon, title: formatMessage(commonMessages.content.voucher) }}>
      <VoucherCollectionBlock />
    </MemberAdminLayout>
  )
}

export default VoucherCollectionAdminPage
