import CheckoutProductModal, {
  CheckoutProductModalProps,
} from 'lodestar-app-element/src/components/modals/CheckoutProductModal'
import React from 'react'
import { usePublishedPodcastPlans } from '../../hooks/podcast'
import PodcastPlanSelector from '../podcast/PodcastPlanSelector'

const CheckoutPodcastPlanModal: React.VFC<
  {
    creatorId: string
  } & Pick<CheckoutProductModalProps, 'renderTrigger'>
> = ({ creatorId, renderTrigger }) => {
  const { loadingPodcastPlans, publishedPodcastPlans } = usePublishedPodcastPlans(creatorId)

  if (loadingPodcastPlans) {
    return null
  }

  if (!publishedPodcastPlans[0]) {
    return <>{renderTrigger({})}</>
  }

  return (
    <CheckoutProductModal
      defaultProductId={`PodcastPlan_${publishedPodcastPlans[0].id}`}
      renderProductSelector={({ productId, onProductChange }) => (
        <PodcastPlanSelector
          podcastPlans={publishedPodcastPlans}
          value={productId.split('_')[1]}
          onChange={podcastPlanId => onProductChange(`PodcastPlan_${podcastPlanId}`)}
        />
      )}
      renderTrigger={renderTrigger}
    />
  )
}

export default CheckoutPodcastPlanModal
