import { TrackingInstance, useTracking } from 'lodestar-app-element/src/hooks/tracking'
import { useEffect } from 'react'
import { StringParam, useQueryParam } from 'use-query-params'

export const Detail: React.FC<{ type: string; id: string }> = ({ type, id }) => {
  const tracking = useTracking()
  const [pageFrom] = useQueryParam('pageFrom', StringParam)

  useEffect(() => {
    tracking.detail({ type, id } as TrackingInstance, { collection: pageFrom || undefined })
  }, [id, pageFrom, tracking, type])

  return <></>
}
