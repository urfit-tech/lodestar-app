import React from 'react'
import { usePublishedPodcastPlans } from '../../hooks/podcast'
import PodcastPlanSelector from '../podcast/PodcastPlanSelector'
import CheckoutProductModal, { CheckoutProductModalProps } from './CheckoutProductModal'

const CheckoutPodcastPlanModal: React.FC<
  {
    creatorId: string
  } & CheckoutProductModalProps
> = ({ creatorId, renderTrigger, ...modalProps }) => {
  const { loadingPodcastPlans, publishedPodcastPlans } = usePublishedPodcastPlans(creatorId)

  if (loadingPodcastPlans) {
    return null
  }

  if (!publishedPodcastPlans[0]) {
    return <>{renderTrigger({ setVisible: () => {} })}</>
  }

  return (
    <CheckoutProductModal
      renderTrigger={renderTrigger}
      renderProductSelector={({ productId, onProductChange }) => (
        <PodcastPlanSelector
          podcastPlans={publishedPodcastPlans}
          value={productId.split('_')[1]}
          onChange={podcastPlanId => onProductChange(`PodcastPlan_${podcastPlanId}`)}
        />
      )}
      defaultProductId={`PodcastPlan_${publishedPodcastPlans[0].id}`}
      {...modalProps}
    />
  )
}

export default CheckoutPodcastPlanModal
