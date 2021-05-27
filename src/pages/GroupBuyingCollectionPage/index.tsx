import { Icon } from '@chakra-ui/icons'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { Typography } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import { commonMessages } from '../../helpers/translation'
import { ReactComponent as GroupBuyIcon } from '../../images/group-buy.svg'
import GroupBuyingDisplayCard from './GroupBuyingDisplayCard'

const GroupBuyingCollectionPage: React.VFC = () => {
  const { formatMessage } = useIntl()

  return (
    <MemberAdminLayout>
      <Typography.Title level={3} className="mb-4">
        <Icon as={GroupBuyIcon} className="mr-3" />
        <span>{formatMessage(commonMessages.ui.groupBuying)}</span>
      </Typography.Title>

      <Tabs colorScheme="primary">
        <TabList>
          <Tab>{formatMessage(commonMessages.status.sendable)}</Tab>
          <Tab>{formatMessage(commonMessages.status.sent)}</Tab>
        </TabList>

        <TabPanels>
          <TabPanel className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <GroupBuyingDisplayCard />
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </MemberAdminLayout>
  )
}

export default GroupBuyingCollectionPage
