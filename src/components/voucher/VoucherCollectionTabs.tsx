import { Tabs } from 'antd'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { commonMessages } from '../../helpers/translation'
import Voucher, { VoucherProps } from './Voucher'

type VoucherCollectionTabProps = {
  vouchers: VoucherProps[]
}
const VoucherCollectionTabs: React.FC<VoucherCollectionTabProps> = ({ vouchers }) => {
  const [activeKey, setActiveKey] = useState('available')
  const { formatMessage } = useIntl()

  return (
    <Tabs activeKey={activeKey} onChange={key => setActiveKey(key)}>
      <Tabs.TabPane key="available" tab={formatMessage(commonMessages.status.available)}>
        <div className="row">
          {vouchers
            .filter(voucher => voucher.available)
            .map(voucher => (
              <div key={voucher.id} className="col-12 col-lg-6">
                <Voucher {...voucher} />
              </div>
            ))}
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane key="unavailable" tab={formatMessage(commonMessages.status.expired)}>
        <div className="row">
          {vouchers
            .filter(voucher => !voucher.available)
            .map(voucher => (
              <div key={voucher.id} className="col-12 col-lg-6">
                <Voucher {...voucher} />
              </div>
            ))}
        </div>
      </Tabs.TabPane>
    </Tabs>
  )
}

export default VoucherCollectionTabs
