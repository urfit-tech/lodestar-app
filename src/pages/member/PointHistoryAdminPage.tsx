import { useQuery } from '@apollo/react-hooks'
import { Button, SkeletonText } from '@chakra-ui/react'
import { message, Tabs } from 'antd'
import gql from 'graphql-tag'
import moment from 'moment'
import React, { useRef, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import { useAuth } from '../../components/auth/AuthContext'
import { EmptyBlock } from '../../components/common'
import AdminCard from '../../components/common/AdminCard'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import { useApp } from '../../containers/common/AppContext'
import hasura from '../../hasura'
import { commonMessages } from '../../helpers/translation'
import { ReactComponent as PointIcon } from '../../images/point.svg'
import LoadingPage from '../LoadingPage'
import NotFoundPage from '../NotFoundPage'

const messages = defineMessages({
  currentOwnedPoints: { id: 'payment.label.currentOwnedPoints', defaultMessage: '目前擁有' },
  unitOfPoints: { id: 'payment.label.unitOfPoints', defaultMessage: '點' },
  pointHistory: { id: 'payment.label.pointHistory', defaultMessage: '已獲紀錄' },
  orderHistory: { id: 'payment.label.orderHistory', defaultMessage: '消費紀錄' },
  dueAt: { id: 'payment.text.dueAt', defaultMessage: '有效期限 {date}' },
  unlimited: { id: 'payment.label.unlimited', defaultMessage: '無限期' },
  viewMore: { id: 'payment.ui.viewMore', defaultMessage: '顯示更多' },
  noPointLog: { id: 'payment.text.noPointLog', defaultMessage: '尚無點數紀錄' },
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
const StyledLabel = styled.span<{ variant?: 'point-log' | 'order-log' }>`
  padding: 0.125rem 0.5rem;
  color: white;
  font-size: 12px;
  border-radius: 11px;
  background: ${props => (props.variant === 'point-log' ? 'var(--success)' : 'var(--warning)')};
  white-space: nowrap;
`
const StyledInactivatedItem = styled(StyledItem)`
  opacity: 0.5;
`
const StyledInactivatedLabel = styled(StyledLabel)`
  background-color: var(--gray);
`

const PointHistoryAdminPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { loading, enabledModules } = useApp()

  if (loading) {
    return <LoadingPage />
  }

  if (!enabledModules.point) {
    return <NotFoundPage />
  }

  return (
    <MemberAdminLayout content={{ icon: PointIcon, title: formatMessage(commonMessages.content.pointsAdmin) }}>
      {currentMemberId && <PointSummaryCard memberId={currentMemberId} />}
      {currentMemberId && <PointHistoryCollectionTabs memberId={currentMemberId} />}
    </MemberAdminLayout>
  )
}

const PointSummaryCard: React.VFC<{ memberId: string }> = ({ memberId }) => {
  const { formatMessage } = useIntl()
  const { settings } = useApp()
  const { ownedPoints } = usePointStatus(memberId)

  const pointUnit = settings['point.unit'] || formatMessage(messages.unitOfPoints)

  return (
    <AdminCard className="mb-4">
      <div className="mb-2">
        <StyledCardText>{formatMessage(messages.currentOwnedPoints)}</StyledCardText>
      </div>
      <div>
        <StyledNumber className="mr-2">{ownedPoints}</StyledNumber>
        <StyledCardText>{pointUnit}</StyledCardText>
      </div>
    </AdminCard>
  )
}

const PointHistoryCollectionTabs: React.VFC<{ memberId: string }> = ({ memberId }) => {
  const { formatMessage } = useIntl()
  const { settings } = useApp()
  const { loadingPointLogs, errorPointLogs, pointLogs, refetchPointLogs, fetchMorePointLogs } =
    usePointLogCollections(memberId)
  const { loadingOrderLogs, errorOrderLogs, orderLogs, refetchOrderLogs, fetchMoreOrderLogs } =
    useOrderLogWithPointsCollection(memberId)
  const [loading, setLoading] = useState(false)

  if (errorPointLogs || errorOrderLogs) {
    message.error(formatMessage(commonMessages.status.readingError))
  }

  const pointUnit = settings['point.unit'] || formatMessage(messages.unitOfPoints)

  return (
    <Tabs
      defaultActiveKey="points-log"
      onChange={() => {
        refetchPointLogs()
        refetchOrderLogs()
      }}
    >
      <Tabs.TabPane key="point-logs" tab={formatMessage(messages.pointHistory)} className="pt-2">
        {loadingPointLogs ? (
          <SkeletonText mt="1" noOfLines={4} spacing="4" />
        ) : pointLogs.length === 0 ? (
          <EmptyBlock>{formatMessage(messages.noPointLog)}</EmptyBlock>
        ) : (
          <AdminCard className="mb-5">
            {pointLogs.map(pointLog => {
              return pointLog.endedAt && pointLog.endedAt < new Date() ? (
                <StyledInactivatedItem key={pointLog.id} className="d-flex align-items-center">
                  <div className="flex-shrink-0 mr-5">{moment(pointLog.createdAt).format('YYYY/MM/DD')}</div>
                  <div className="flex-grow-1">
                    <div>{pointLog.description}</div>
                    <StyledDescription>
                      {pointLog.endedAt
                        ? formatMessage(messages.dueAt, { date: moment(pointLog.endedAt).format('YYYY/MM/DD') })
                        : formatMessage(messages.unlimited)}
                    </StyledDescription>
                  </div>
                  <div className="flex-shrink-0 ml-5">
                    <StyledInactivatedLabel variant="point-log">
                      {pointLog.points > 0 && '+'}
                      {pointLog.points} {pointUnit}
                    </StyledInactivatedLabel>
                  </div>
                </StyledInactivatedItem>
              ) : (
                <StyledItem key={pointLog.id} className="d-flex align-items-center">
                  <div className="flex-shrink-0 mr-5">{moment(pointLog.createdAt).format('YYYY/MM/DD')}</div>
                  <div className="flex-grow-1">
                    <div>{pointLog.description}</div>
                    <StyledDescription>
                      {pointLog.endedAt
                        ? formatMessage(messages.dueAt, { date: moment(pointLog.endedAt).format('YYYY/MM/DD') })
                        : formatMessage(messages.unlimited)}
                    </StyledDescription>
                  </div>
                  <div className="flex-shrink-0 ml-5">
                    <StyledLabel variant="point-log">
                      {pointLog.points > 0 && '+'}
                      {pointLog.points} {pointUnit}
                    </StyledLabel>
                  </div>
                </StyledItem>
              )
            })}

            {fetchMorePointLogs && (
              <div className="text-center mt-4">
                <Button
                  isLoading={loading}
                  onClick={() => {
                    setLoading(true)
                    fetchMorePointLogs().finally(() => setLoading(false))
                  }}
                  variant="outline"
                >
                  {formatMessage(messages.viewMore)}
                </Button>
              </div>
            )}
          </AdminCard>
        )}
      </Tabs.TabPane>

      <Tabs.TabPane key="order-log" tab={formatMessage(messages.orderHistory)} className="pt-2">
        {loadingOrderLogs ? (
          <SkeletonText mt="1" noOfLines={4} spacing="4" />
        ) : orderLogs.length === 0 ? (
          <EmptyBlock>{formatMessage(messages.noPointLog)}</EmptyBlock>
        ) : (
          <AdminCard className="mb-5">
            {orderLogs.map(orderLog => (
              <StyledItem key={orderLog.id} className="d-flex align-items-center">
                <div className="flex-shrink-0 mr-5">{moment(orderLog.createdAt).format('YYYY/MM/DD')}</div>
                <div className="flex-grow-1">{orderLog.title}</div>
                <div className="flex-shrink-0 ml-5">
                  <StyledLabel variant="order-log">
                    -{orderLog.points} {pointUnit}
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
      </Tabs.TabPane>
    </Tabs>
  )
}

const usePointStatus = (memberId: string) => {
  const { data } = useQuery<hasura.GET_POINT_STATUS>(
    gql`
      query GET_POINT_STATUS($memberId: String!) {
        point_status(where: { member_id: { _eq: $memberId } }) {
          points
        }
      }
    `,
    {
      variables: { memberId },
    },
  )

  return {
    ownedPoints: data?.point_status[0]?.points || 0,
  }
}

const usePointLogCollections = (memberId: string) => {
  const { loading, error, data, refetch, fetchMore } = useQuery<
    hasura.GET_POINT_LOG_COLLECTION,
    hasura.GET_POINT_LOG_COLLECTIONVariables
  >(
    gql`
      query GET_POINT_LOG_COLLECTION($memberId: String!, $current: timestamptz!, $offset: Int) {
        point_log(
          where: {
            member_id: { _eq: $memberId }
            _or: [{ started_at: { _lte: $current } }, { started_at: { _is_null: true } }]
          }
          order_by: { created_at: desc }
          limit: 10
          offset: $offset
        ) {
          id
          description
          created_at
          ended_at
          point
        }
      }
    `,
    {
      variables: {
        memberId,
        current: useRef(new Date()).current,
      },
    },
  )
  const [isNoMore, setIsNoMore] = useState(false)

  const pointLogs: {
    id: string
    description: string
    createdAt: Date
    endedAt: Date | null
    points: number
  }[] =
    loading || error || !data
      ? []
      : data.point_log.map(pointLog => ({
          id: pointLog.id,
          description: pointLog.description,
          createdAt: new Date(pointLog.created_at),
          endedAt: pointLog.ended_at && new Date(pointLog.ended_at),
          points: pointLog.point,
        }))

  return {
    loadingPointLogs: loading,
    errorPointLogs: error,
    pointLogs,
    refetchPointLogs: () => {
      setIsNoMore(false)
      return refetch()
    },
    fetchMorePointLogs: isNoMore
      ? undefined
      : () =>
          fetchMore({
            variables: { offset: data?.point_log.length || 0 },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) {
                return prev
              }
              if (fetchMoreResult.point_log.length < 10) {
                setIsNoMore(true)
              }
              return {
                ...prev,
                point_log: [...prev.point_log, ...fetchMoreResult.point_log],
              }
            },
          }),
  }
}

const useOrderLogWithPointsCollection = (memberId: string) => {
  const { loading, error, data, refetch, fetchMore } = useQuery<
    hasura.GET_ORDER_LOG_WITH_POINTS_COLLECTION,
    hasura.GET_ORDER_LOG_WITH_POINTS_COLLECTIONVariables
  >(
    gql`
      query GET_ORDER_LOG_WITH_POINTS_COLLECTION($memberId: String!, $offset: Int) {
        order_log(
          where: { member_id: { _eq: $memberId }, order_discounts: { type: { _eq: "Point" } } }
          order_by: { created_at: desc }
          limit: 10
          offset: $offset
        ) {
          id
          created_at
          order_discounts(where: { type: { _eq: "Point" } }, limit: 1) {
            id
            name
          }
          order_discounts_aggregate(where: { type: { _eq: "Point" } }) {
            aggregate {
              sum {
                price
              }
            }
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
    points: number
  }[] =
    loading || error || !data
      ? []
      : data.order_log.map(orderLog => ({
          id: orderLog.id,
          createdAt: new Date(orderLog.created_at),
          title: orderLog.order_discounts[0]?.name || '',
          points: orderLog.order_discounts_aggregate.aggregate?.sum?.price || 0,
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

export default PointHistoryAdminPage
