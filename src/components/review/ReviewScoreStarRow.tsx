import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useAdaptedReviewable, useReviewAggregate } from 'lodestar-app-element/src/hooks/review'
import { FC } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { reviewMessages } from '../../helpers/translation'
import StarRating from '../common/StarRating'

const StyledReviewRating = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
  text-align: justify;
`

const ReviewScoreStarRow: FC<{ path: string; appId: string }> = ({ path, appId }) => {
  const { formatMessage } = useIntl()
  const { enabledModules, settings } = useApp()
  const { currentUserRole } = useAuth()
  const { data: reviewable, loading: reviewableLoading } = useAdaptedReviewable(path, appId)
  const { averageScore, reviewCount, loading: reviewAggregateLoading } = useReviewAggregate(path)

  if (reviewableLoading || reviewAggregateLoading) return <></>
  if (path === '/programs/4759ac4a-c838-40ce-92d5-142ff0ee8c31') console.log(averageScore, reviewCount)

  return enabledModules.customer_review ? (
    currentUserRole === 'app-owner' ||
    (reviewable?.is_score_viewable &&
      reviewCount >= (settings.review_lower_bound ? Number(settings.review_lower_bound) : 3)) ? (
      <StyledReviewRating className="d-flex mb-2">
        <StarRating score={Math.round((Math.round(averageScore * 10) / 10) * 2) / 2} max={5} size="20px" />
        <span>({formatMessage(reviewMessages.text.reviewCount, { count: reviewCount })})</span>
      </StyledReviewRating>
    ) : (
      <StyledReviewRating className="mb-2">{formatMessage(reviewMessages.text.noReviews)}</StyledReviewRating>
    )
  ) : null
}

export default ReviewScoreStarRow
