import { useQuery } from '@apollo/react-hooks'
import { Skeleton } from 'antd'
import gql from 'graphql-tag'
import moment from 'moment-timezone'
import React from 'react'
import Icon from 'react-inlinesvg'
import { defineMessages, useIntl } from 'react-intl'
import styled, { css } from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import { productMessages, saleMessages } from '../../helpers/translation'
import { useOrderLogsWithMerchandiseSpec } from '../../hooks/merchandise'
import CalendarOIcon from '../../images/calendar-alt-o.svg'
import types from '../../types'
import { OrderLogWithMerchandiseSpecProps } from '../../types/merchandise'
import AdminCard from '../common/AdminCard'
import MerchandiseOrderContactModal from './MerchandiseOrderContactModal'
import MerchandiseShippingInfoModal from './MerchandiseShippingInfoModal'
import MerchandiseSpecItem from './MerchandiseSpecItem'

const messages = defineMessages({
  purchase: { id: 'product.merchandise.text.purchase', defaultMessage: '購買' },
  seller: { id: 'product.merchandise.ui.seller', defaultMessage: '賣家通知' },
  shipped: { id: 'product.merchandise.status.shipped', defaultMessage: '已出貨' },
  shipping: { id: 'product.merchandise.status.shipping', defaultMessage: '待出貨' },
})

const StyledOrderTitle = styled.h3`
  color: var(--gray-darker);
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.8px;
`
const StyledPurchaseDate = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
`
const StyledSpecification = styled.div`
  color: var(--gray-darker);
  font-size: 16px;
  letter-spacing: 0.2px;
`
const StyledTag = styled.span<{ active?: boolean }>`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  letter-spacing: 0.6px;
  white-space: nowrap;

  ${props =>
    props.active
      ? css`
          background-color: ${props.theme['@primary-color']};
          color: #fff;
        `
      : css`
          border: solid 1px var(--gray);
          background-color: #fff;
          color: var(--gray-dark);
        `}
`
const StyledDeliveryMessage = styled.div`
  background-color: var(--gray-lighter);

  h4.seller {
    font-weight: bold;
    letter-spacing: 0.2px;
    color: var(--gray-darker);
  }

  .delivered-at {
    color: var(--gray-dark);
    font-size: 14px;
    letter-spacing: 0.4px;
  }

  .deliver-message {
    color: var(--gray-darker);
    line-height: 1.5;
    letter-spacing: 0.2px;
    text-align: justify;
    white-space: pre-line;
  }
`

const MerchandiseOrderCollectionBlock: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const { formatMessage } = useIntl()
  const { loadingOrderLogs, errorOrderLogs, orderLogs } = useOrderLogsWithMerchandiseSpec(memberId)

  if (loadingOrderLogs) {
    return (
      <div className="container pt-4">
        <Skeleton active />
      </div>
    )
  }

  if (errorOrderLogs || !orderLogs.length) {
    return <div className="container pt-4">{formatMessage(productMessages.merchandise.content.noMerchandiseOrder)}</div>
  }

  return (
    <div className="container pt-4">
      {orderLogs.map(orderLog => (
        <MerchandiseOrderCard key={orderLog.id} orderLog={orderLog} />
      ))}
    </div>
  )
}

const MerchandiseOrderCard: React.FC<{
  orderLog: OrderLogWithMerchandiseSpecProps
}> = ({ orderLog }) => {
  const { formatMessage } = useIntl()
  const { enabledModules } = useApp()
  const { loadingMerchandiseTypes, errorMerchandiseTypes, merchandiseTypes } = useMerchandiseType(
    orderLog.orderProducts.map(orderProduct => orderProduct.merchandiseSpecId),
  )

  if (loadingMerchandiseTypes || errorMerchandiseTypes) {
    return null
  }

  const isAllGeneralVirtual = merchandiseTypes.every(v => !v.isPhysical && !v.isCustomized)

  return (
    <AdminCard key={orderLog.id} className="mb-4">
      <div className="d-lg-flex justify-content-between">
        <div>
          <StyledOrderTitle className="d-flex align-items-center mb-2">
            <span>{`${formatMessage(saleMessages.column.title.orderNo)} ${orderLog.id}`}</span>

            {isAllGeneralVirtual || (orderLog.deliveredAt && orderLog.deliverMessage) ? (
              <StyledTag className="ml-2">{formatMessage(messages.shipped)}</StyledTag>
            ) : (
              <StyledTag className="ml-2" active>
                {formatMessage(messages.shipping)}
              </StyledTag>
            )}
          </StyledOrderTitle>

          {orderLog.createdAt && (
            <StyledPurchaseDate className="mb-4 d-flex align-items-center">
              <Icon src={CalendarOIcon} className="mr-2" />
              {`${moment(orderLog.createdAt).format('YYYY-MM-DD hh:mm')} ${formatMessage(messages.purchase)}`}
            </StyledPurchaseDate>
          )}

          {orderLog?.shipping?.specification && (
            <StyledSpecification className="mb-2">{orderLog.shipping.specification}</StyledSpecification>
          )}
        </div>

        <div>
          {enabledModules.order_contact && <MerchandiseOrderContactModal orderId={orderLog.id} />}
          {orderLog.shipping && (
            <MerchandiseShippingInfoModal shipping={orderLog.shipping} invoice={orderLog.invoice} />
          )}
        </div>
      </div>

      {orderLog.orderProducts.map(v => (
        <MerchandiseSpecItem
          key={v.id}
          merchandiseSpecId={v.merchandiseSpecId}
          quantity={v.quantity}
          orderProductId={v.id}
          orderProductFilenames={v.filenames}
        />
      ))}

      {orderLog.deliveredAt && (
        <StyledDeliveryMessage className="mt-4 p-4">
          <div className="d-flex justify-content-between">
            <h4 className="seller">{formatMessage(messages.seller)}</h4>
            <span className="delivered-at">{moment(orderLog.deliveredAt).format('YYYY-MM-DD HH:mm')}</span>
          </div>

          <div className="deliver-message">{orderLog.deliverMessage}</div>
        </StyledDeliveryMessage>
      )}
    </AdminCard>
  )
}

const useMerchandiseType = (merchandiseSpecIds: string[]) => {
  const { loading, error, data, refetch } = useQuery<
    types.GET_MERCHANDISE_TYPE_COLLECTION,
    types.GET_MERCHANDISE_TYPE_COLLECTIONVariables
  >(
    gql`
      query GET_MERCHANDISE_TYPE_COLLECTION($merchandiseSpecIds: [uuid!]!) {
        merchandise_spec(where: { id: { _in: $merchandiseSpecIds } }) {
          id
          merchandise {
            id
            is_physical
            is_customized
          }
        }
      }
    `,
    { variables: { merchandiseSpecIds } },
  )

  const merchandiseTypes: {
    id: string
    isPhysical: boolean
    isCustomized: boolean
  }[] =
    data?.merchandise_spec.map(v => ({
      id: v.merchandise.id,
      isPhysical: v.merchandise.is_physical,
      isCustomized: v.merchandise.is_customized,
    })) || []

  return {
    loadingMerchandiseTypes: loading,
    errorMerchandiseTypes: error,
    merchandiseTypes,
    refetchMerchandiseTypes: refetch,
  }
}

export default MerchandiseOrderCollectionBlock
