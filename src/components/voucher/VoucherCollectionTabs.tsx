import { Tab, TabPanels, Tabs } from '@chakra-ui/react'
import React from 'react'
import { useIntl } from 'react-intl'
import { usersMessages } from '../../helpers/translation'
import { StyledTabList, StyledTabPanel } from '../../pages/GroupBuyingCollectionPage'
import Voucher, { VoucherProps } from './Voucher'

const VoucherCollectionTabs: React.VFC<{ vouchers: VoucherProps[] }> = ({ vouchers }) => {
  const { formatMessage } = useIntl()

  const tabContents: {
    key: string
    name: string
    isDisplay: (order: VoucherProps) => boolean
  }[] = [
    {
      key: 'available',
      name: formatMessage(usersMessages.tab.available),
      isDisplay: voucher => voucher.available,
    },
    {
      key: 'notYet',
      name: formatMessage(usersMessages.tab.notYet),
      isDisplay: voucher =>
        (voucher.startedAt && voucher.startedAt.getTime() > Date.now() && !voucher.status.used) || false,
    },
    {
      key: 'unavailable',
      name: formatMessage(usersMessages.tab.expired),
      isDisplay: voucher => (voucher.endedAt && voucher.endedAt.getTime() < Date.now()) || false,
    },
    {
      key: 'used',
      name: formatMessage(usersMessages.tab.used),
      isDisplay: voucher => voucher.status.used || false,
    },
  ]

  return (
    <Tabs colorScheme="primary">
      <StyledTabList>
        {tabContents.map(v => (
          <Tab key={v.key}>{v.name}</Tab>
        ))}
      </StyledTabList>

      <TabPanels>
        {tabContents.map(v => (
          <StyledTabPanel className="row" key={v.key}>
            {vouchers.filter(v.isDisplay).map(voucher => (
              <div key={voucher.id} className="col-12 col-lg-6">
                <Voucher {...voucher} />
              </div>
            ))}
          </StyledTabPanel>
        ))}
      </TabPanels>
    </Tabs>
  )
}

export default VoucherCollectionTabs
