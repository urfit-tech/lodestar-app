import { useQuery } from '@apollo/react-hooks'
import { Icon } from '@chakra-ui/icons'
import { Skeleton, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { Typography } from 'antd'
import gql from 'graphql-tag'
import { isEmpty } from 'ramda'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { useAuth } from '../../components/auth/AuthContext'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import types from '../../hasura'
import { commonMessages } from '../../helpers/translation'
import { ReactComponent as GroupBuyIcon } from '../../images/group-buy.svg'
import GroupBuyingDisplayCard from './GroupBuyingDisplayCard'

type groupBuyingOrderProps = {
  id: string
  parentOrderMemberId: string
  memberId: string
  name: string
  coverUrl: string
  startedAt: Date | null
  endedAt: Date | null
  transferredAt: Date | null
}

const GroupBuyingCollectionPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { status, groupBuyingOrderCollection, refetch } = useGroupBuyingLogs(currentMemberId)

  const [tab, setTab] = useState('sendable')

  let content = null
  if (status === 'loading') {
    content = <Skeleton />
  }

  if (status === 'error') {
    content = <div>error...</div>
  }

  const tabContents: {
    key: string
    name: string
    isDisplay: (order: groupBuyingOrderProps) => boolean
  }[] = [
    {
      key: 'sendable',
      name: formatMessage(commonMessages.status.sendable),
      isDisplay: order =>
        !order.transferredAt && order.parentOrderMemberId === currentMemberId && order.memberId === currentMemberId,
    },
    {
      key: 'sent',
      name: formatMessage(commonMessages.status.sent),
      isDisplay: order =>
        !!order.transferredAt && order.parentOrderMemberId === currentMemberId && order.memberId !== currentMemberId,
    },
    {
      key: 'received',
      name: formatMessage(commonMessages.status.received),
      isDisplay: order =>
        !!order.transferredAt && order.parentOrderMemberId !== currentMemberId && order.memberId === currentMemberId,
    },
  ]

  content = (
    <Tabs colorScheme="primary">
      <TabList>
        {tabContents.map(v => (
          <Tab key={v.key} onClick={() => setTab(v.key)} isSelected={v.key === tab}>
            {v.name}
          </Tab>
        ))}
      </TabList>

      <TabPanels>
        {tabContents.map(v => (
          <TabPanel className="row">
            {groupBuyingOrderCollection.filter(v.isDisplay).map(order => (
              <div className="col-12 col-md-6 col-lg-4" key={order.id}>
                <GroupBuyingDisplayCard
                  orderId={order.id}
                  imgUrl={order.coverUrl}
                  title={order.name}
                  onRefetch={!order.transferredAt ? () => refetch() : null}
                  notTransferred={!order.transferredAt}
                />
              </div>
            ))}
            {isEmpty(groupBuyingOrderCollection.filter(v.isDisplay)) && <div>empty</div>}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  )

  return (
    <MemberAdminLayout>
      <Typography.Title level={3} className="mb-4">
        <Icon as={GroupBuyIcon} className="mr-3" />
        <span>{formatMessage(commonMessages.ui.groupBuying)}</span>
      </Typography.Title>

      {content}
    </MemberAdminLayout>
  )
}

const useGroupBuyingLogs = (memberId: string | null) => {
  const { loading, error, data, refetch } = useQuery<
    types.GET_GROUP_BUYING_ORDER,
    types.GET_GROUP_BUYING_ORDERVariables
  >(
    gql`
      query GET_GROUP_BUYING_ORDER($memberId: String) {
        order_group_buying_log(
          where: { _or: [{ parent_order_member_id: { _eq: $memberId } }, { member_id: { _eq: $memberId } }] }
        ) {
          parent_order_member_id
          order_id
          member_id
          started_at
          ended_at
          transferred_at
          name
          cover_url
        }
      }
    `,
    {
      variables: {
        memberId,
      },
    },
  )

  const status: 'loading' | 'error' | 'completed' = !memberId || loading ? 'loading' : error ? 'error' : 'completed'

  const groupBuyingOrderCollection: groupBuyingOrderProps[] =
    memberId && data
      ? data.order_group_buying_log.map(v => ({
          id: v.order_id || '',
          parentOrderMemberId: v.parent_order_member_id || '',
          memberId: v.member_id || '',
          name: v.name || '',
          startedAt: v.started_at ? new Date(v.started_at) : null,
          endedAt: v.ended_at ? new Date(v.ended_at) : null,
          transferredAt: v.transferred_at ? new Date(v.transferred_at) : null,
          coverUrl: v.cover_url || '',
        }))
      : []

  return {
    status,
    groupBuyingOrderCollection,
    refetch,
  }
}

export default GroupBuyingCollectionPage
