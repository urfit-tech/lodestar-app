import { useQuery } from '@apollo/react-hooks'
import { Button, SkeletonText, Tab, TabPanels, Tabs } from '@chakra-ui/react'
import { message } from 'antd'
import gql from 'graphql-tag'
import { EmptyBlock } from 'lodestar-app-element/src/components/common'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment'
import { sum } from 'ramda'
import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import AdminCard from '../../components/common/AdminCard'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import hasura from '../../hasura'
import { commonMessages } from '../../helpers/translation'
import { ReactComponent as CoinIcon } from '../../images/coin.svg'
import { StyledTabList, StyledTabPanel } from '../GroupBuyingCollectionPage'

const messages = defineMessages({
  currentOwnedCoins: { id: 'payment.label.currentOwnedCoins', defaultMessage: '目前擁有' },
  unitOfCoins: { id: 'payment.label.unitOfCoins', defaultMessage: '點' },
  coinHistory: { id: 'payment.label.coinHistory', defaultMessage: '已獲紀錄' },
  orderHistory: { id: 'payment.label.orderHistory', defaultMessage: '消費紀錄' },
  dueAt: { id: 'payment.text.dueAt', defaultMessage: '有效期限 {date}' },
  unlimited: { id: 'payment.label.unlimited', defaultMessage: '無限期' },
  viewMore: { id: 'payment.ui.viewMore', defaultMessage: '顯示更多' },
  noCoinLog: { id: 'payment.text.noCoinLog', defaultMessage: '尚無代幣紀錄' },
  noOrderLog: { id: 'payment.text.noOrderLog', default: '尚無消費紀錄' },
})

const StyledCardText = styled.span`
  color: var(--gray-darker);
  font-size: 14px;
  letter-spacing: 0.8px;
`
const StyledNumber = styled.span`
  color: var(--gray-darker);
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 0.23px;
`
const StyledItem = styled.div`
  padding: 0.75rem 0;
  border-bottom: 1px solid #efefef;
  > div:first-child {
    width: 6rem;
  }
`
const StyledDescription = styled.div`
  color: var(--gray-dark);
  font-size: 12px;
`
const StyledLabel = styled.span<{ variant?: 'coin-log' | 'order-log' }>`
  padding: 0.125rem 0.5rem;
  color: white;
  font-size: 12px;
  border-radius: 11px;
  background: ${props => (props.variant === 'coin-log' ? 'var(--success)' : 'var(--warning)')};
  white-space: nowrap;
`
const StyledInactivatedItem = styled(StyledItem)`
  opacity: 0.5;
`
const StyledInactivatedLabel = styled(StyledLabel)`
  background-color: var(--gray);
`

const CoinHistoryAdminPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()

  return (
    <MemberAdminLayout content={{ icon: CoinIcon, title: formatMessage(commonMessages.content.coinsAdmin) }}>
      {currentMemberId && <CoinSummaryCard memberId={currentMemberId} />}
      {currentMemberId && <CoinHistoryCollectionTabs memberId={currentMemberId} />}
    </MemberAdminLayout>
  )
}

const CoinSummaryCard: React.VFC<{
  memberId: string
}> = ({ memberId }) => {
  const { formatMessage } = useIntl()
  const { ownedCoins } = useCoinStatus(memberId)
  const { settings } = useApp()
  const coinUnit = settings['coin.unit'] || formatMessage(messages.unitOfCoins)
  return (
    <AdminCard className="mb-4">
      <div className="mb-2">
        <StyledCardText>{formatMessage(messages.currentOwnedCoins)}</StyledCardText>
      </div>
      <div>
        <StyledNumber className="mr-2">{ownedCoins}</StyledNumber>
        <StyledCardText>{coinUnit}</StyledCardText>
      </div>
    </AdminCard>
  )
}

const CoinHistoryCollectionTabs: React.VFC<{
  memberId: string
}> = ({ memberId }) => {
  const { formatMessage } = useIntl()
  const { settings } = useApp()
  const coinUnit = settings['coin.unit'] || formatMessage(messages.unitOfCoins)
  const { loadingCoinLogs, errorCoinLogs, coinLogs, refetchCoinLogs, fetchMoreCoinLogs } = useCoinLogCollections({
    memberId,
    current: moment().startOf('minute').toDate(),
  })
  const { loadingOrderLogs, errorOrderLogs, orderLogs, refetchOrderLogs, fetchMoreOrderLogs } =
    useOrderLogWithCoinsCollection(memberId)
  const [loading, setLoading] = useState(false)
  const [activeKey, setActiveKey] = useState('coin-logs')

  if (errorCoinLogs || errorOrderLogs) {
    message.error(formatMessage(commonMessages.status.readingError))
  }

  return (
    <Tabs
      colorScheme="primary"
      onChange={() => {
        refetchCoinLogs()
        refetchOrderLogs()
      }}
    >
      <StyledTabList>
        <Tab onClick={() => setActiveKey('coin-logs')} className="pt-2" isSelected={'coin-logs' === activeKey}>
          {formatMessage(messages.coinHistory)}
        </Tab>
        <Tab onClick={() => setActiveKey('order-log')} className="pt-2" isSelected={'order-log' === activeKey}>
          {formatMessage(messages.orderHistory)}
        </Tab>
      </StyledTabList>

      <TabPanels>
        <StyledTabPanel>
          {loadingCoinLogs ? (
            <SkeletonText mt="1" noOfLines={4} spacing="4" />
          ) : coinLogs.length === 0 ? (
            <EmptyBlock>{formatMessage(messages.noCoinLog)}</EmptyBlock>
          ) : (
            <AdminCard className="mb-5">
              {coinLogs.map(coinLog => {
                return coinLog.endedAt && coinLog.endedAt < new Date() ? (
                  <StyledInactivatedItem key={coinLog.id} className="d-flex align-items-center">
                    <div className="flex-shrink-0 mr-5">{moment(coinLog.publishedAt).format('YYYY/MM/DD')}</div>
                    <div className="flex-grow-1">
                      <div>{coinLog.title}</div>
                      <StyledDescription>
                        {coinLog.endedAt
                          ? formatMessage(messages.dueAt, { date: moment(coinLog.endedAt).format('YYYY/MM/DD') })
                          : formatMessage(messages.unlimited)}
                      </StyledDescription>
                    </div>
                    <div className="flex-shrink-0 ml-5">
                      <StyledInactivatedLabel variant="coin-log">
                        {coinLog.amount > 0 && '+'}
                        {coinLog.amount} {coinUnit}
                      </StyledInactivatedLabel>
                    </div>
                  </StyledInactivatedItem>
                ) : (
                  <StyledItem key={coinLog.id} className="d-flex align-items-center">
                    <div className="flex-shrink-0 mr-5">{moment(coinLog.publishedAt).format('YYYY/MM/DD')}</div>
                    <div className="flex-grow-1">
                      <div>{coinLog.title}</div>
                      <StyledDescription>
                        {coinLog.endedAt
                          ? formatMessage(messages.dueAt, { date: moment(coinLog.endedAt).format('YYYY/MM/DD') })
                          : formatMessage(messages.unlimited)}
                      </StyledDescription>
                    </div>
                    <div className="flex-shrink-0 ml-5">
                      <StyledLabel variant="coin-log">
                        {coinLog.amount > 0 && '+'}
                        {coinLog.amount} {coinUnit}
                      </StyledLabel>
                    </div>
                  </StyledItem>
                )
              })}

              {fetchMoreCoinLogs && (
                <div className="text-center mt-4">
                  <Button
                    variant="outline"
                    isLoading={loading}
                    onClick={() => {
                      setLoading(true)
                      fetchMoreCoinLogs().finally(() => setLoading(false))
                    }}
                  >
                    {formatMessage(messages.viewMore)}
                  </Button>
                </div>
              )}
            </AdminCard>
          )}
        </StyledTabPanel>

        <StyledTabPanel>
          {loadingOrderLogs ? (
            <SkeletonText mt="1" noOfLines={4} spacing="4" />
          ) : orderLogs.length === 0 ? (
            <EmptyBlock>{formatMessage(messages.noCoinLog)}</EmptyBlock>
          ) : (
            <AdminCard className="mb-5">
              {orderLogs.map(orderLog => (
                <StyledItem key={orderLog.id} className="d-flex align-items-center">
                  <div className="flex-shrink-0 mr-5">{moment(orderLog.createdAt).format('YYYY/MM/DD')}</div>
                  <div className="flex-grow-1">{orderLog.title}</div>
                  <div className="flex-shrink-0 ml-5">
                    <StyledLabel variant="order-log">
                      -{orderLog.amount} {coinUnit}
                    </StyledLabel>
                  </div>
                </StyledItem>
              ))}

              {fetchMoreOrderLogs && (
                <div className="text-center mt-4">
                  <Button
                    loading={loading}
                    onClick={() => {
                      setLoading(true)
                      fetchMoreOrderLogs().finally(() => setLoading(false))
                    }}
                  >
                    {formatMessage(messages.viewMore)}
                  </Button>
                </div>
              )}
            </AdminCard>
          )}
        </StyledTabPanel>
      </TabPanels>
    </Tabs>
  )
}

const useCoinStatus = (memberId: string) => {
  const { data } = useQuery<hasura.GET_COIN_STATUS>(
    gql`
      query GET_COIN_STATUS($memberId: String!) {
        coin_status(where: { member_id: { _eq: $memberId } }) {
          remaining
        }
      }
    `,
    {
      variables: { memberId },
    },
  )
  return {
    ownedCoins: sum(data?.coin_status.map(v => v.remaining || 0) || []),
  }
}

const useCoinLogCollections = ({ memberId, current }: { memberId: string; current: Date }) => {
  const { loading, error, data, refetch, fetchMore } = useQuery<
    hasura.GET_COIN_LOG_COLLECTION,
    hasura.GET_COIN_LOG_COLLECTIONVariables
  >(
    gql`
      query GET_COIN_LOG_COLLECTION($memberId: String!, $current: timestamptz!, $offset: Int) {
        coin_log(
          where: {
            member_id: { _eq: $memberId }
            _or: [{ started_at: { _lte: $current } }, { started_at: { _is_null: true } }]
          }
          limit: 10
          offset: $offset
        ) {
          id
          title
          description
          created_at
          started_at
          ended_at
          amount
        }
      }
    `,
    {
      variables: {
        memberId,
        current,
      },
    },
  )
  const [isNoMore, setIsNoMore] = useState(false)

  const coinLogs: {
    id: string
    title: string
    description: string
    createdAt: Date
    publishedAt: Date
    endedAt: Date | null
    amount: number
  }[] =
    loading || error || !data
      ? []
      : data.coin_log.map(coinLog => ({
          id: coinLog.id,
          title: coinLog.title,
          description: coinLog.description,
          createdAt: new Date(coinLog.created_at),
          publishedAt: coinLog.started_at ? new Date(coinLog.started_at) : new Date(new Date(coinLog.created_at)),
          endedAt: coinLog.ended_at && new Date(coinLog.ended_at),
          amount: coinLog.amount,
        }))

  return {
    loadingCoinLogs: loading,
    errorCoinLogs: error,
    coinLogs: coinLogs.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()),
    refetchCoinLogs: () => {
      setIsNoMore(false)
      return refetch()
    },
    fetchMoreCoinLogs: isNoMore
      ? undefined
      : () =>
          fetchMore({
            variables: { offset: data?.coin_log.length || 0 },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) {
                return prev
              }
              if (fetchMoreResult.coin_log.length < 10) {
                setIsNoMore(true)
              }
              return {
                ...prev,
                coin_log: [...prev.coin_log, ...fetchMoreResult.coin_log],
              }
            },
          }),
  }
}

const useOrderLogWithCoinsCollection = (memberId: string) => {
  const { loading, error, data, refetch, fetchMore } = useQuery<
    hasura.GET_ORDER_LOG_WITH_COINS_COLLECTION,
    hasura.GET_ORDER_LOG_WITH_COINS_COLLECTIONVariables
  >(
    gql`
      query GET_ORDER_LOG_WITH_COINS_COLLECTION($memberId: String!, $offset: Int) {
        order_log(
          where: {
            member_id: { _eq: $memberId }
            status: { _eq: "SUCCESS" }
            order_discounts: { type: { _eq: "Coin" } }
          }
          order_by: { created_at: desc }
          limit: 10
          offset: $offset
        ) {
          id
          created_at
          order_discounts(where: { type: { _eq: "Coin" } }) {
            id
            name
            options
          }
        }
      }
    `,
    { variables: { memberId } },
  )
  const [isNoMore, setIsNoMore] = useState(false)

  const orderLogs: {
    id: string
    createdAt: Date
    title: string
    amount: number
  }[] =
    loading || error || !data
      ? []
      : data.order_log.map(orderLog => ({
          id: orderLog.id,
          createdAt: new Date(orderLog.created_at),
          title: orderLog.order_discounts[0]?.name || '',
          amount: sum(orderLog.order_discounts.map(v => v.options.coins || 0)),
        }))

  return {
    loadingOrderLogs: loading,
    errorOrderLogs: error,
    orderLogs,
    refetchOrderLogs: () => {
      setIsNoMore(false)
      return refetch()
    },
    fetchMoreOrderLogs: isNoMore
      ? undefined
      : () =>
          fetchMore({
            variables: { offset: data?.order_log.length || 0 },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) {
                return prev
              }
              if (fetchMoreResult.order_log.length < 10) {
                setIsNoMore(true)
              }
              return {
                ...prev,
                order_log: [...prev.order_log, ...fetchMoreResult.order_log],
              }
            },
          }),
  }
}

export default CoinHistoryAdminPage
