import { TrackingInstance, useTracking } from 'lodestar-app-element/src/hooks/tracking'
import { getResourceByProductId } from 'lodestar-app-element/src/hooks/util'
import { equals } from 'ramda'
import React, { useEffect } from 'react'
import { StringParam, useQueryParam } from 'use-query-params'

export const Detail: React.FC<{ type: string; id: string }> = ({ type, id }) => {
  const tracking = useTracking()
  const [pageFrom] = useQueryParam('pageFrom', StringParam)

  useEffect(() => {
    tracking.detail({ type, id } as TrackingInstance, { collection: pageFrom || undefined })
  }, [id, pageFrom, tracking, type])

  return <></>
}

export const Checkout: React.FC<{ productIds: string[]; onCheckout?: () => void }> = React.memo(
  ({ productIds, onCheckout }) => {
    const tracking = useTracking()
    useEffect(() => {
      tracking.checkout(productIds.map(productId => getResourceByProductId(productId))).finally(() => onCheckout?.())
    }, [onCheckout, productIds, tracking])
    return <></>
  },
  (prevProps, nextProps) => equals(prevProps.productIds, nextProps.productIds),
)

export const Purchase: React.FC<{ orderId: string }> = ({ orderId }) => {
  const tracking = useTracking()
  useEffect(() => {
    tracking.purchase(orderId)
  }, [orderId, tracking])

  return <></>
}
