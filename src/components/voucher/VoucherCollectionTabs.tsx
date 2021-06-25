import { Tab, TabPanels, Tabs } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { commonMessages } from '../../helpers/translation'
import { StyledTabList, StyledTabPanel } from '../../pages/GroupBuyingCollectionPage'
import Voucher, { VoucherProps } from './Voucher'

const VoucherCollectionTabs: React.VFC<{ vouchers: VoucherProps[] }> = ({ vouchers }) => {
  const [activeKey, setActiveKey] = useState('available')
  const { formatMessage } = useIntl()

  const tabContents: {
    key: string
    name: string
    isDisplay: (order: VoucherProps) => boolean
  }[] = [
    {
      key: 'available',
      name: formatMessage(commonMessages.status.available),
      isDisplay: voucher => !!voucher.available,
    },
    {
      key: 'unavailable',
      name: formatMessage(commonMessages.status.expired),
      isDisplay: voucher => !voucher.available,
    },
  ]

  return (
    <Tabs colorScheme="primary">
      <StyledTabList>
        {tabContents.map(v => (
          <Tab key={v.key} onClick={() => setActiveKey(v.key)} isSelected={v.key === activeKey}>
            {v.name}
          </Tab>
        ))}
      </StyledTabList>

      <TabPanels>
        {tabContents.map(v => (
          <StyledTabPanel className="row">
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
