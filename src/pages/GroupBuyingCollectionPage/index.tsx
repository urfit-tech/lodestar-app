import { gql, useQuery } from '@apollo/client'
import { Box, Flex, Image, Skeleton, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { EmptyBlock } from 'lodestar-app-element/src/components/common'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { uniq } from 'ramda'
import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import types from '../../hasura'
import { commonMessages } from '../../helpers/translation'
import EmptyCover from '../../images/empty-cover.png'
import { ReactComponent as GroupBuyIcon } from '../../images/group-buy.svg'
import GroupBuyingDisplayCard from './GroupBuyingDisplayCard'

type groupBuyingOrderProps = {
  id: string
  parentOrderMember: {
    id: string
    email: string
  }
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
  const { loading, error, groupBuyingOrderCollection, refetch } = useGroupBuyingLogs(currentMemberId)

  const [tab, setTab] = useState('sendable')

  const tabContents: {
    key: string
    name: string
    isDisplay: (order: groupBuyingOrderProps) => boolean
    emptyText: string
  }[] = [
    {
      key: 'sendable',
      name: formatMessage(commonMessages.status.sendable),
      isDisplay: order => !order.transferredAt && order.parentOrderMember.id === order.member.id,
      emptyText: formatMessage(messages.noSendableItem),
    },
    {
      key: 'sent',
      name: formatMessage(commonMessages.status.sent),
      isDisplay: order =>
        !!order.transferredAt &&
        order.parentOrderMember.id !== order.member.id &&
        order.parentOrderMember.id === currentMemberId,
      emptyText: formatMessage(messages.noSentItem),
    },
    {
      key: 'received',
      name: formatMessage(commonMessages.status.received),
      isDisplay: order =>
        !!order.transferredAt && order.parentOrderMember.id !== order.member.id && order.member.id === currentMemberId,
      emptyText: formatMessage(messages.noReceivedItem),
    },
  ]

  return (
    <MemberAdminLayout content={{ icon: GroupBuyIcon, title: formatMessage(commonMessages.ui.groupBuying) }}>
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
                {loading || !currentMemberId ? (
                  <div className="row">
                    {Array.from(Array(9)).map((v, index) => (
                      <Box key={index} className="col-12 col-md-6 col-lg-4 mb-4">
                        <Box
                          className="p-4"
                          borderRadius="4px"
                          h="300px"
                          bg="#ffffff"
                          boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.06)"
                        >
                          <Box mb="1rem" pt={`${900 / 16}%`} position="relative">
                            <Image
                              src={EmptyCover}
                              alt="empty-cover"
                              top="0"
                              bgSize="cover"
                              bgPosition="center"
                              position="absolute"
                              w="100%"
                              h="100%"
                            />
                          </Box>
                          <Skeleton>title</Skeleton>
                          <Box mt="1rem">
                            <Skeleton h="40px">button</Skeleton>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </div>
                ) : !error ? (
                  <Flex justifyContent="center" alignItems="center" h="50vh">
                    error
                  </Flex>
                ) : displayOrders.length === 0 ? (
                  <EmptyBlock>{v.emptyText}</EmptyBlock>
                ) : (
                  <div className="row">
                    {displayOrders.map(order => (
                      <div className="col-12 col-md-6 col-lg-4 mb-4" key={order.id}>
                        <GroupBuyingDisplayCard
                          orderId={order.id}
                          imgUrl={order.coverUrl}
                          title={order.name}
                          partnerMemberIds={order.partnerMemberIds}
                          onRefetch={!order.transferredAt ? () => refetch() : null}
                          transferredAt={order.transferredAt}
                          sentByCurrentMember={!!order.transferredAt && order.parentOrderMember.id === currentMemberId}
                          memberEmail={
                            order.transferredAt &&
                            (order.parentOrderMember.id === currentMemberId
                              ? order.member.email
                              : order.member.id === currentMemberId
                              ? order.parentOrderMember.email
                              : null)
                          }
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
          parent_order_member_email
          order_id
          member_id
          member_email
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

  const groupBuyingOrderCollection: groupBuyingOrderProps[] =
    data?.order_group_buying_log.map(v => ({
      id: v.order_id || '',
      parentOrderMember: {
        id: v.parent_order_member_id || '',
        email: v.parent_order_member_email || '',
      },
      member: {
        id: v.member_id || '',
        email: v.member_email || '',
      },
      name: v.name || '',
      startedAt: v.started_at ? new Date(v.started_at) : null,
      endedAt: v.ended_at ? new Date(v.ended_at) : null,
      transferredAt: v.transferred_at ? new Date(v.transferred_at) : null,
      coverUrl: v.cover_url || '',
      partnerMemberIds: uniq(v.parent_order_log?.sub_order_logs.map(v => v.member_id) || []),
    })) || []
  console.log({ loading, error, data })
  return {
    loading,
    error,
    groupBuyingOrderCollection,
    refetch,
  }
}

export default GroupBuyingCollectionPage
