import { useQuery } from '@apollo/react-hooks'
import { Skeleton, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import gql from 'graphql-tag'
import { uniq } from 'ramda'
import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import { useAuth } from '../../components/auth/AuthContext'
import { EmptyBlock } from '../../components/common'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import types from '../../hasura'
import { commonMessages } from '../../helpers/translation'
import { ReactComponent as GroupBuyIcon } from '../../images/group-buy.svg'
import GroupBuyingDisplayCard from './GroupBuyingDisplayCard'

type groupBuyingOrderProps = {
  id: string
  parentOrderMemberId: string
  member: {
    id: string
    email: string
  }
  name: string
  coverUrl: string
  partnerMemberIds: string[]
  startedAt: Date | null
  endedAt: Date | null
  transferredAt: Date | null
}

export const StyledTabList = styled(TabList)`
  && {
    padding-bottom: 1px;
    border-bottom: 1px solid var(--gray);
  }
`

export const StyledTabPanel = styled(TabPanel)`
  && {
    padding: 24px 0;
  }
`

const messages = defineMessages({
  noReceivedItem: { id: 'groupBuying.text.noReceivedItem', defaultMessage: '目前未收到任何項目' },
  noSentItem: { id: 'groupBuying.text.noSentItem', defaultMessage: '尚未發送過任何項目' },
  noSendableItem: { id: 'groupBuying.text.noSendableItem', defaultMessage: '尚無任何可發送的項目' },
})

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
    emptyText: string
  }[] = [
    {
      key: 'sendable',
      name: formatMessage(commonMessages.status.sendable),
      isDisplay: order =>
        !order.transferredAt && order.parentOrderMemberId === currentMemberId && order.member.id === currentMemberId,
      emptyText: formatMessage(messages.noSendableItem),
    },
    {
      key: 'sent',
      name: formatMessage(commonMessages.status.sent),
      isDisplay: order =>
        !!order.transferredAt && order.parentOrderMemberId === currentMemberId && order.member.id !== currentMemberId,
      emptyText: formatMessage(messages.noSentItem),
    },
    {
      key: 'received',
      name: formatMessage(commonMessages.status.received),
      isDisplay: order =>
        !!order.transferredAt && order.parentOrderMemberId !== currentMemberId && order.member.id === currentMemberId,
      emptyText: formatMessage(messages.noReceivedItem),
    },
  ]

  content = (
    <Tabs colorScheme="primary">
      <StyledTabList>
        {tabContents.map(v => (
          <Tab key={v.key} onClick={() => setTab(v.key)} isSelected={v.key === tab}>
            {v.name}
          </Tab>
        ))}
      </StyledTabList>

      <TabPanels>
        {tabContents.map(v => {
          const displayOrders = groupBuyingOrderCollection.filter(v.isDisplay)

          return (
            <StyledTabPanel>
              {!displayOrders.length ? (
                <EmptyBlock>{v.emptyText}</EmptyBlock>
              ) : (
                <div className="row">
                  {displayOrders.map(v => (
                    <div className="col-12 col-md-6 col-lg-4 mb-4" key={v.id}>
                      <GroupBuyingDisplayCard
                        orderId={v.id}
                        imgUrl={v.coverUrl}
                        title={v.name}
                        partnerMemberIds={v.partnerMemberIds}
                        onRefetch={!v.transferredAt ? () => refetch() : null}
                        transferredAt={v.transferredAt}
                        memberEmail={v.member.email}
                      />
                    </div>
                  ))}
                </div>
              )}
            </StyledTabPanel>
          )
        })}
      </TabPanels>
    </Tabs>
  )

  return (
    <MemberAdminLayout content={{ icon: GroupBuyIcon, title: formatMessage(commonMessages.ui.groupBuying) }}>
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
          email
          started_at
          ended_at
          transferred_at
          name
          cover_url
          parent_order_log {
            sub_order_logs {
              member_id
            }
          }
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
          member: {
            id: v.member_id || '',
            email: v.email || '',
          },
          name: v.name || '',
          startedAt: v.started_at ? new Date(v.started_at) : null,
          endedAt: v.ended_at ? new Date(v.ended_at) : null,
          transferredAt: v.transferred_at ? new Date(v.transferred_at) : null,
          coverUrl: v.cover_url || '',
          partnerMemberIds: uniq(v.parent_order_log?.sub_order_logs.map(v => v.member_id) || []),
        }))
      : []

  return {
    status,
    groupBuyingOrderCollection,
    refetch,
  }
}

export default GroupBuyingCollectionPage
